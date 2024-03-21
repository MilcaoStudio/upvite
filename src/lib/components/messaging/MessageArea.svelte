<script context="module" lang="ts">
    import { defer } from "$lib";
    import { internalEmit, internalSubscribe } from "$lib/InternalEmitter";
    import { useSession } from "$lib/controllers/ClientController";
    import { getRenderer } from "$lib/rendered/Singleton";
    import type { ScrollState } from "$lib/rendered/types";
    import { autorun, runInAction } from "mobx";
    import type { Channel } from "revolt.js";
    import { onDestroy, onMount, setContext } from "svelte";
    import { modalController } from "../modals/ModalController";

    export const MESSAGE_AREA_PADDING = 82;
</script>

<script lang="ts">
    import Preloader from "../indicators/Preloader.svelte";
    import MessageRenderer from "./MessageRenderer.svelte";
    import Start from "./Start.svelte";
    import { _autoAction } from "mobx";
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    import { page } from "$app/stores";

    export let lastId: string | undefined = undefined,
        messageId: string | null = null,
        channel: Channel;
    const session = useSession()!;

    // ? This is the scroll container.
    let ref: HTMLDivElement;
    let width: number;
    let height: number;

    let highlight: string | undefined;

    // ? Current channel state.
    const renderer = getRenderer(channel);

    // ? avoid re-renders
    let scrollState: ScrollState = { type: "Free" };

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
                        ref.scrollTo({
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
                ref.scrollTo({
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
                ref.scrollTo({ behavior: "instant", top: scrollState.y });
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

    autorun(() => setScrollState(renderer.scrollState));

    onMount(() => {
        // ? Load channel initially.
        if (renderer.state == "RENDER") {
            runInAction(() => (renderer.fetching = true));

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
        if (params.channel == channel._id) {
            highlight = params.message;
            renderer.init(params.message);
        }
    });

    // ? If we are waiting for network, try again.
    $: autorun(() => {
        switch (session.state) {
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

    $: stbOnResize = function () {
        if (!atBottom() && scrollState.type == "Bottom") {
            ref.scrollTo({ behavior: "instant", top: ref.scrollHeight });
            setScrollState({ type: "Bottom" });
        }
    };

    $: height && stbOnResize();

    $: keyUp = function (e: KeyboardEvent) {
        if (e.key == "Escape" && !modalController.isVisible) {
            renderer.jumpToBottom(true);
            internalEmit("TextArea", "focus", "message");
        }
    };

    $: setContext("MessageAreaWidth", (width ?? 0) - MESSAGE_AREA_PADDING);
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<svelte:document on:resize={stbOnResize} on:keyup={keyUp} />

<div class="MessageArea" bind:this={ref} on:scroll={onScroll}>
    <div>
        {#if renderer.state == "LOADING"}
            <Preloader type="ring" />
        {/if}
        {#if renderer.state == "WAITING_FOR_NETWORK"}
            <!--<RequiresOnline>-->
            <Preloader type="ring" />
        {/if}
        {#if renderer.state == "RENDER"}
            <!--Force renderer update on highlight-->
            {#key highlight}
                <MessageRenderer {lastId} {renderer} {highlight} />
            {/key}
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
