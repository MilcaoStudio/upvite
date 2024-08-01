<script context="module" lang="ts">
    import { useClient } from "$lib/controllers/ClientController";

    export function useAutoComplete(
        setValue: (v?: string) => void,
        searchClues?: SearchClues,
    ) {
        let state: Writable<AutoCompleteState> = writable({ type: "none" });
        let focused = false;
        const client = useClient();
        function onChange(value: string, selectionStart?: number, selectionEnd?: number) {
            if (!value) return;
            let _state = get(state);
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
                            switch (channel?.channel_type) {
                                case "Group":
                                case "DirectMessage":
                                    users = channel.recipients!.filter(
                                        (x) => typeof x !== "undefined",
                                    ) as User[];
                                    break;
                                case "TextChannel":
                                    {
                                        const server = channel.server_id;
                                        users = [...client.members.keys()]
                                            .map((x) => JSON.parse(x))
                                            .filter((x) => x.server === server)
                                            .map((x) =>
                                                client.users.get(x.user),
                                            )
                                            .filter(
                                                (x) => typeof x !== "undefined",
                                            ) as User[];
                                    }
                                    break;
                                default:
                                    return;
                            }
                        }
                    }

                    users = users.filter(
                        (x) => x._id != "00000000000000000000000000",
                    );

                    const matches = (
                        search.length
                            ? users.filter((user) =>
                                  user.username.toLowerCase().match(regex),
                              )
                            : users
                    )
                        .splice(0, 5)
                        .filter((x) => typeof x != "undefined");

                    if (matches.length) {
                        const currentPosition =
                            _state.type != "none" ? _state.selected : 0;

                        state.set({
                            type: "user",
                            matches,
                            selected: Math.min(
                                currentPosition,
                                matches.length - 1,
                            ),
                            within: false,
                        });

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
                    )
                        .splice(0, 5)
                        .filter((x) => typeof x != "undefined");

                    if (matches.length) {
                        const currentPosition =
                            _state.type != "none" ? _state.selected : 0;

                        state.set({
                            type: "channel",
                            matches,
                            selected: Math.min(
                                currentPosition,
                                matches.length - 1,
                            ),
                            within: false,
                        });

                        return;
                    }
                }
            }
            if (_state.type != "none") {
                state.set({ type: "none" });
            }
            setValue(value);
        }

        function selectCurrent(el: HTMLElement) {
            console.debug("[selectCurrent] selecting", el);
            let _state = get(state);
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
            if (_state.type != "none") {
                const result = searchString(value, selectionStart, selectionEnd);
                if (result) {
                    const [_type, search, index] = result;

                    const content = value.split("");
                    if (_state.type == "user") {
                        content.splice(
                            index,
                            search.length + 1,
                            "<@",
                            _state.matches[_state.selected]._id,
                            "> ",
                        );
                    } else {
                        content.splice(
                            index,
                            search.length + 1,
                            "<#",
                            _state.matches[_state.selected]._id,
                            "> ",
                        );
                    }

                    setValue(content.join(""));
                }
            }
        }

        function onClick(ev: MouseEvent) {
            ev.preventDefault();
            const el: HTMLElement = document.querySelector("#message")!;
            selectCurrent(el);
            focused = false;
        }

        function onKeyDown(e: KeyboardEvent) {
            let _state = get(state);
            if (focused && _state.type != "none") {
                if (e.key == "ArrowUp") {
                    e.preventDefault();
                    if (_state.selected > 0) {
                        state.update(state=>({
                            ...state,
                            selected: state.type != "none" ? state.selected - 1 : 0,
                        }));
                    }

                    return true;
                }

                if (e.key == "ArrowDown") {
                    e.preventDefault();
                    if (_state.selected < _state.matches.length - 1) {
                        state.update(state=>({
                            ...state,
                            selected: state.type != "none" ? state.selected + 1 : 0,
                        }));
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

        function onKeyUp(
            e: KeyboardEvent & { currentTarget: HTMLTextAreaElement },
        ) {
            if (e.currentTarget) {
                onChange(e.currentTarget.value, e.currentTarget.selectionStart, e.currentTarget.selectionEnd);
            }
        }

        function onFocus(
            ev: FocusEvent & { currentTarget: HTMLElement },
        ) {
            console.debug("focus", true);
            focused = true;
        }

        function onBlur() {
            let _state = get(state);
            if (_state.type != "none" && _state.within) return;
            console.debug("blur", false);
            focused = false;
        }

        return {
            state,
            onClick,
            onChange,
            onKeyUp,
            onKeyDown,
            onFocus,
            onBlur,
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
    import type { AutoCompleteState, SearchClues } from "$lib/types/messaging";
    import { css, cx } from "@emotion/css";
    import type { Channel, User } from "revolt.js";
    import type {
        MouseEventHandler,
    } from "svelte/elements";
    import UserIcon from "./user/UserIcon.svelte";
    import ChannelIcon from "./channels/ChannelIcon.svelte";
    import { get, writable, type Writable } from "svelte/store";

    export let detached = false,
        state: Writable<AutoCompleteState>,
        onClick: MouseEventHandler<HTMLButtonElement>;
    const Base = cx(
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
    );


</script>


<div class={Base}>
    <div>
        {#if $state.type == "user"}
            {#each $state.matches as match, i (match._id)}
                <button
                    class:active={i == $state.selected}
                    on:mouseenter={() => {
                        (i != $state.selected || !$state.within) &&
                            state.update(_state=>({
                                ..._state,
                                selected: i,
                                within: true,
                            }));
                    }}
                    on:mouseleave={() =>
                        $state.within &&
                        state.update(_state =>({
                            ..._state,
                            within: false,
                        }))}
                    on:click={onClick}
                >
                    <UserIcon
                        size={24}
                        target={match}
                        status={true}
                    />{match.username}
                </button>
            {/each}
        {/if}
        {#if $state.type == "channel"}
            {#each $state.matches as match, i (match._id)}
                <button class:active={i == $state.selected}
                on:mouseenter={()=>{
                    (i != $state.selected || !$state.within) && state.update(_state=>({
                        ..._state,
                        selected: i,
                        within: true
                    }))
                }}
                on:mouseleave={()=>{
                    $state.within && state.update(_state=>({..._state, within: false}))
                }}>
                <ChannelIcon size={24} target={match} />
                {match.name}
                </button>
            {/each}
        {/if}
    </div>
</div>
