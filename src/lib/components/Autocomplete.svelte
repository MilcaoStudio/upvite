<script module lang="ts">
    export function useAutoComplete(
        setValue: (v?: string) => void,
        searchClues?: SearchClues,
    ) {
        let state = $state<AutoCompleteState>({ type: "none" });
        let focused = false;
        const client = useClient();
        function onchange(value: string, selectionStart?: number, selectionEnd?: number) {
            if (!value) return;
            state;
            const result = searchString(value, selectionStart, selectionEnd);
            if (result) {
                const [type, search] = result;
                const regex = new RegExp(search, "i");
                if (type == "user" && searchClues?.users) {
                    let users: User[] = [];
                    switch (searchClues.users.type) {
                        case "all":
                            users = [...client.users.values()];
                            break;
                        case "channel": {
                            const channel = client.channels.get(
                                searchClues.users.id,
                            );
                            switch (channel?.type) {
                                case "Group":
                                case "DirectMessage":
                                    users = channel.recipients;
                                    break;
                                case "TextChannel":
                                    {
                                        const server = channel.serverId;
                                        users = [...client.serverMembers.values()]
                                            .filter((x) => x.id.server == server)
                                            .map((x) => x.user)
                                            .filter(
                                                (x) => typeof x != "undefined",
                                            ) as User[];
                                    }
                                    break;
                                default:
                                    return;
                            }
                        }
                    }

                    users = users.filter(
                        (x) => x.id != "00000000000000000000000000",
                    );

                    const matches = (
                        search.length
                            ? users.filter((user) =>
                                  user.username.toLowerCase().match(regex),
                              )
                            : users
                    ).splice(0, 5);

                    if (matches.length) {
                        const currentPosition =
                            state.type != "none" ? state.selected : 0;

                        state = {
                            type: "user",
                            matches,
                            selected: Math.min(
                                currentPosition,
                                matches.length - 1,
                            ),
                            within: false,
                        };

                        return;
                    }
                }

                if (type == "channel" && searchClues?.channels) {
                    const channels = client.servers
                        .get(searchClues.channels.server)
                        ?.channels.filter(
                            (x) => typeof x != "undefined",
                        ) as Channel[];

                    const matches = (
                        search.length
                            ? channels.filter((channel) =>
                                  channel.name!.toLowerCase().match(regex),
                              )
                            : channels
                    ).splice(0, 5);

                    if (matches.length) {
                        const currentPosition =
                            state.type != "none" ? state.selected : 0;

                        state = {
                            type: "channel",
                            matches,
                            selected: Math.min(
                                currentPosition,
                                matches.length - 1,
                            ),
                            within: false,
                        };

                        return;
                    }
                }
            }
            if (state.type != "none") {
                state = { type: "none" };
            }
            setValue(value);
        }

        function selectCurrent(el: Element) {
            console.debug("[selectCurrent] selecting", el);
            let value = "", selectionStart = 0, selectionEnd = 0;
            if (el instanceof HTMLDivElement) {
                value = el.textContent ?? "";
                const selection = document.getSelection();
                const leaf = selection?.anchorNode?.
                // span data-slate-string="true"
                parentElement?.
                // span data-slate-leaf="true"
                parentElement;
                let prev = leaf?.previousSibling;
                selectionStart = selection?.anchorOffset ?? 0;
                selectionEnd = selection?.focusOffset ?? 0;
                while (prev) {
                    if (prev.textContent) {
                        const len = prev.textContent.length;
                        selectionStart += len;
                        selectionEnd += len;
                    }
                    prev = prev.previousSibling;
                }
                
            } else if (el instanceof HTMLTextAreaElement) {
                ({value, selectionStart, selectionEnd} = el);
            }
            if (state.type != "none") {
                const result = searchString(value, selectionStart, selectionEnd);
                if (result) {
                    const [_type, search, index] = result;

                    const content = value.split("");
                    if (state.type == "user") {
                        content.splice(
                            index,
                            search.length + 1,
                            "<@",
                            state.matches[state.selected].id,
                            "> ",
                        );
                    } else {
                        content.splice(
                            index,
                            search.length + 1,
                            "<#",
                            state.matches[state.selected].id,
                            "> ",
                        );
                    }

                    setValue(content.join(""));
                }
            }
        }

        function onclick(ev: MouseEvent) {
            ev.preventDefault();
            const el: HTMLElement = document.querySelector("#message")!;
            selectCurrent(el);
            focused = false;
        }

        function onkeydown(e: KeyboardEvent) {
            if (focused && state.type != "none") {
                if (e.key == "ArrowUp") {
                    e.preventDefault();
                    if (state.selected > 0) {
                        state = {
                            ...state,
                            selected: state.selected - 1,
                        };
                    }

                    return true;
                }

                if (e.key == "ArrowDown") {
                    e.preventDefault();
                    if (state.selected < state.matches.length - 1) {
                        state ={
                            ...state,
                            selected: state.selected + 1,
                        };
                    }

                    return true;
                }

                if (e.key == "Enter" || e.key == "Tab") {
                    e.preventDefault();
                    const t = e.currentTarget;
                    t && selectCurrent(t as HTMLElement);
                    focused = false;
                    return true;
                }
            }

            return false;
        }

        function onkeyup(
            e: KeyboardEvent & { currentTarget: HTMLTextAreaElement },
        ) {
            if (e.currentTarget) {
                onchange(e.currentTarget.value, e.currentTarget.selectionStart, e.currentTarget.selectionEnd);
            }
        }

        function onfocus() {
            console.debug("focus", true);
            focused = true;
        }

        function onblur() {
            if (state.type != "none" && state.within) return;
            console.debug("blur", false);
            focused = false;
        }

        function useAutoCompleteState() {
            return state;
        }

        return {
            useAutoCompleteState,
            onclick,
            onchange,
            onkeyup,
            onkeydown,
            onfocus,
            onblur,
        };
    }

    function searchString(
        value: string,
        selectionStart?: number,
        selectionEnd?: number
    ): ["user" | "channel", string, number] | undefined {
        if (selectionStart == selectionEnd) {
            const cursor = selectionStart;
            const content = value.slice(0, cursor);

            const valid = /[\w\-]/;

            let j = content.length - 1;
            if (content[j] == "@") {
                return ["user", "", j];
            } else if (content[j] == "#") {
                return ["channel", "", j];
            }

            while (j >= 0 && valid.test(content[j])) {
                j--;
            }

            if (j == -1) return;
            const current = content[j];

            if (current == "@" || current == "#") {
                const search = content.slice(j + 1, content.length);
                const minLen = 1;

                if (search.length >= minLen) {
                    return [
                        current == "#" ? "channel" : "user",
                        search.toLowerCase(),
                        j,
                    ];
                }
            }
        }
    }
</script>

<script lang="ts">
    import { isNoneAutoComplete, type AutoCompleteState, type SearchClues } from "$lib/types/messaging";
    import { css, cx } from "@emotion/css";
    import type { Channel, User } from "stoat.js";
    import type {
        MouseEventHandler,
    } from "svelte/elements";
    import UserIcon from "./user/UserIcon.svelte";
    import ChannelIcon from "./channels/ChannelIcon.svelte";
    import { useClient } from "./client/ClientContext.svelte";

    interface Props {
        detached?: boolean;
        useAutoCompleteState: ()=>AutoCompleteState;
        onclick: MouseEventHandler<HTMLButtonElement>;
    }

    let { detached = false, useAutoCompleteState, onclick }: Props = $props();
    let currentState = $derived(useAutoCompleteState());
    const Base = $derived(cx(
        "AutoComplete",
        css`
            position: relative;
      
            background-color: var(--fds-focus-stroke-inner);
            margin: 3px 6px;
            border-radius: var(--border-radius-inner);
            ${detached
                ? `
            bottom: 8px;
            > button {
                border-radius: var(--border-radius);
            }`
                : ``}

            > button {
                bottom: 0;
                width: 100%;
                position: absolute;
                background: var(--primary-header);
            }

            button {
                gap: 8px;
                margin: 4px;
                padding: 6px;
                border: none;
                display: flex;
                font-size: 1em;
                cursor: pointer;
                align-items: center;
                flex-direction: row;
                font-family: inherit;
                background: transparent;
                color: var(--foreground);
                width: calc(100% - 12px);
                border-radius: var(--border-radius);

                span {
                    display: grid;
                    place-items: center;
                }

                &.active {
                    background: var(--background-dark);

                }
            }
        `,
    ));


    function onmouseleave() {
        if (isNoneAutoComplete(currentState)) return;
        if (currentState.within) {
            currentState = {
                ...currentState,
                within: false,
            };
        }
    }

    function onmouseenter(i: number) {
        if (isNoneAutoComplete(currentState)) return;
        if (i != currentState.selected || !currentState.within) {
            currentState = {
                ...currentState,
                selected: i,
                within: true,
            };
        }
    }
</script>


<div class={Base}>
    <div>
        {#if currentState.type == "user"}
            {#each currentState.matches as match, i (match.id)}
                <button
                    class:active={i == currentState.selected}
                    onmouseenter={() => onmouseenter(i)}
                    {onmouseleave}
                    {onclick}
                >
                    <UserIcon
                        size={24}
                        target={match}
                        status={true}
                    />{match.username}
                </button>
            {/each}
        {/if}
        {#if currentState.type == "channel"}
            {#each currentState.matches as match, i (match.id)}
                <button class:active={i == currentState.selected}
                onmouseenter={()=>onmouseenter(i)}
                {onmouseleave}>
                <ChannelIcon size={24} target={match} />
                {match.name}
                </button>
            {/each}
        {/if}
    </div>
</div>
