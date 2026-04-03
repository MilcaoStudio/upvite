<script module lang="ts">
    import { defer } from "$lib";
    import { internalEmit, internalSubscribe } from "$lib/InternalEmitter";
    import { getRenderer } from "$lib/rendered/Singleton.svelte";
    import type { ScrollState } from "$lib/rendered/types";
    import { autorun, runInAction } from "mobx";
    import type { Channel } from "stoat.js";
    import { onMount, setContext } from "svelte";
    import { modalController } from "../modals/ModalController";

    export const MESSAGE_AREA_PADDING = 82;
</script>

<script lang="ts">
    import Preloader from "../indicators/Preloader.svelte";
    import MessageRenderer from "./MessageRenderer.svelte";
    import Start from "./Start.svelte";
    import { beforeNavigate } from "$app/navigation";
    import { useSession } from "../client/ClientContext.svelte";

    interface Props {
        lastId?: string | undefined;
        messageId?: string | null;
        channel: Channel;
    }

    let { lastId = undefined, messageId = null, channel }: Props = $props();

    // ? This is the scroll container.
    let ref: HTMLDivElement | undefined = $state();
    let width = $state(0);
    let height = $state(0);

    let highlight: string | undefined = $state();

    // ? Current channel state.
    const renderer = $derived(getRenderer(channel));

    // ? avoid re-renders
    let scrollState: ScrollState = $state({ type: "Free" });

    function setScrollState(v: ScrollState) {
        if (v.type == "StayAtBottom") {
            if (scrollState.type == "Bottom" || atBottom()) {
                scrollState = {
                    type: "ScrollToBottom",
                    smooth: v.smooth,
                };
            } else {
                scrollState = { type: "Free" };
            }
        } else {
            scrollState = v;
        }

        defer(() => {
            if (scrollState.type == "ScrollToBottom") {
                setScrollState({
                    type: "Bottom",
                    scrollingUntil: +new Date() + 150,
                });

                setTimeout(
                    () =>
                        ref?.scrollTo({
                            behavior: "smooth",
                            top: ref.scrollHeight,
                        }),
                    0,
                );
            } else if (scrollState.type == "ScrollToView") {
                document
                    .getElementById(scrollState.id)
                    ?.scrollIntoView({ block: "center" });

                setScrollState({ type: "Free" });
            } else if (scrollState.type == "OffsetTop") {
                ref?.scrollTo({
                    behavior: "instant",
                    top: Math.max(
                        101,
                        ref
                            ? ref.scrollTop +
                                  (ref.scrollHeight -
                                      scrollState.previousHeight)
                            : 101,
                    ),
                });
                setScrollState({ type: "Free" });
            } else if (scrollState.type == "ScrollTop") {
                ref?.scrollTo({ behavior: "instant", top: scrollState.y });
                setScrollState({ type: "Free" });
            }

            defer(() => renderer.complete());
        });
    }

    // ? Determine if we are at the bottom of the scroll container.
    // By default, we assume we are at the bottom, i.e. when we first load.
    const atBottom = (offset = 0) =>
        ref
            ? Math.floor(ref?.scrollHeight - ref?.scrollTop) - offset <=
              ref?.clientHeight
            : true;
    const atTop = (offset = 0) => (ref ? ref.scrollTop <= offset : false);

    internalSubscribe("MessageArea", "jump_to_bottom", () =>
        setScrollState({ type: "ScrollToBottom" }),
    );

    // it works?

    $effect(() => setScrollState(renderer.scrollState));

    onMount(() => {
        // ? Load channel initially.
        if (renderer.state == "RENDER") {
            renderer.fetching = true;

            if (renderer.scrollAnchored) {
                setScrollState({ type: "ScrollToBottom" });
            } else {
                setScrollState({
                    type: "ScrollTop",
                    y: renderer.scrollPosition,
                });
            }
        } else {
            if (messageId) {
                highlight = messageId;
                renderer.init(messageId);
            } else {
                renderer.init();
            }
        }
    });

    // Highlights message on navigation
    beforeNavigate((nav) => {
        const params = nav.to?.params;
        if (!params || !params.message) return;

        // Prevents searching message from another channel
        if (params.channel == channel.id) {
            highlight = params.message;
            renderer.init(params.message);
        }
    });

    // ? If we are waiting for network, try again.
    $effect(() => {
        switch (useSession()?.state) {
            case "Online":
                if (renderer.state == "WAITING_FOR_NETWORK") {
                    renderer.init();
                } else {
                    renderer.reloadStale();
                }

                break;
            case "Offline":
            case "Disconnected":
            case "Connecting":
                renderer.markStale();
                break;
        }
    });

    // ? When the container is scrolled.
    // ? Also handle StayAtBottom
    // ? Top and bottom loaders.
    let onScroll = async function () {
        if (scrollState.type == "Free" && atBottom()) {
            setScrollState({ type: "Bottom" });
        } else if (scrollState.type == "Bottom" && !atBottom()) {
            if (
                scrollState.scrollingUntil &&
                scrollState.scrollingUntil > +new Date()
            )
                return;
            setScrollState({ type: "Free" });
        }

        if (!ref) return;
        renderer.scrollPosition = ref.scrollTop;

        if (atTop(100)) {
            renderer.loadTop(ref!);
        }

        if (atBottom(100)) {
            renderer.loadBottom(ref!);
        }

        if (atBottom()) {
            renderer.scrollAnchored = true;
        } else {
            renderer.scrollAnchored = false;
        }
    };

    let stbOnResize = $derived(function() {
        if (!atBottom() && scrollState.type == "Bottom") {
            ref?.scrollTo({ behavior: "instant", top: ref.scrollHeight });
            setScrollState({ type: "Bottom" });
        }
    });

    $effect(() => {
        stbOnResize();
    });

    let keyUp = $derived(function (e: KeyboardEvent) {
        if (e.key == "Escape" && !modalController.isVisible) {
            renderer.jumpToBottom(true);
            internalEmit("TextArea", "focus", "message");
        }
    });

    $effect(() => {
        setContext("MessageAreaWidth", (width ?? 0) - MESSAGE_AREA_PADDING);
    });
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<svelte:document onresize={stbOnResize} onkeyup={keyUp} />

<div class="MessageArea" bind:this={ref} onscroll={onScroll}>
    <div>
        {#if renderer.state == "LOADING"}
            <Preloader type="ring" />
        {/if}
        {#if renderer.state == "WAITING_FOR_NETWORK"}
            <!--<RequiresOnline>-->
            <Preloader type="ring" />
        {/if}
        {#if renderer.state == "RENDER"}
            <MessageRenderer {lastId} {renderer} {highlight} />
        {/if}
        {#if renderer.state == "EMPTY"}
            <Start {channel} />
        {/if}
    </div>
</div>

<style>
    div.MessageArea {
        height: 100%;
        flex-grow: 1;
        min-height: 0;
        word-break: break-word;

        overflow-x: hidden;
        overflow-y: scroll;
    }

    div.MessageArea::-webkit-scrollbar-thumb {
        min-height: 150px;
    }

    div.MessageArea > div {
        display: flex;
        min-height: 100%;
        padding-bottom: 26px;
        flex-direction: column;
        justify-content: flex-end;
    }
</style>
