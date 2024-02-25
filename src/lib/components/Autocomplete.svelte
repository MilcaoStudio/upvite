<script context="module" lang="ts">
    import { useClient } from "$lib/controllers/ClientController";

    export function useAutoComplete(
        setValue: (v?: string) => void,
        searchClues?: SearchClues,
    ) {
        let state: AutoCompleteState = { type: "none" };
        let focused = false;
        function setState(_state: AutoCompleteState) {
            console.log("state changed from", state, "to", _state);
            state = _state;
        }
        const client = useClient();
        function onChange(e: Event & { currentTarget: HTMLTextAreaElement }) {
            if (!e.currentTarget) return;
            const result = searchString(e.currentTarget);
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
                            state.type != "none" ? state.selected : 0;

                        setState({
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
                            state.type != "none" ? state.selected : 0;

                        setState({
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
            if (state.type != "none") {
                setState({ type: "none" });
            }
            setValue(e.currentTarget.value);
        }

        function selectCurrent(el: HTMLTextAreaElement) {
            if (state.type != "none") {
                const result = searchString(el);
                if (result) {
                    const [_type, search, index] = result;

                    const content = el.value.split("");
                    if (state.type == "user") {
                        content.splice(
                            index,
                            search.length + 1,
                            "<@",
                            state.matches[state.selected]._id,
                            "> ",
                        );
                    } else {
                        content.splice(
                            index,
                            search.length + 1,
                            "<#",
                            state.matches[state.selected]._id,
                            "> ",
                        );
                    }

                    setValue(content.join(""));
                }
            }
        }

        function onClick(ev: MouseEvent) {
            ev.preventDefault();
            selectCurrent(document.querySelector("#message")!);
            focused = false;
        }

        function onKeyDown(e: KeyboardEvent) {
            if (focused && state.type != "none") {
                if (e.key == "ArrowUp") {
                    e.preventDefault();
                    if (state.selected > 0) {
                        setState({
                            ...state,
                            selected: state.selected - 1,
                        });
                    }

                    return true;
                }

                if (e.key == "ArrowDown") {
                    e.preventDefault();
                    if (state.selected < state.matches.length - 1) {
                        setState({
                            ...state,
                            selected: state.selected + 1,
                        });
                    }

                    return true;
                }

                if (e.key == "Enter" || e.key == "Tab") {
                    e.preventDefault();
                    selectCurrent(e.currentTarget as HTMLTextAreaElement);

                    return true;
                }
            }

            return false;
        }

        function onKeyUp(
            e: KeyboardEvent & { currentTarget: HTMLTextAreaElement },
        ) {
            if (e.currentTarget) {
                onChange(e);
            }
        }

        function onFocus(
            ev: FocusEvent & { currentTarget: HTMLTextAreaElement },
        ) {
            focused = true;
            onChange(ev);
        }

        function onBlur() {
            if (state.type != "none" && state.within) return;
            focused = false;
        }

        return {
            state: focused ? state : { type: "none" } as AutoCompleteState,
            setState,
            onClick,
            onChange,
            onKeyUp,
            onKeyDown,
            onFocus,
            onBlur,
        };
    }

    function searchString(
        el: HTMLTextAreaElement,
    ): ["user" | "channel", string, number] | undefined {
        if (el.selectionStart == el.selectionEnd) {
            const cursor = el.selectionStart;
            const content = el.value.slice(0, cursor);

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
        ChangeEventHandler,
        FocusEventHandler,
        MouseEventHandler,
    } from "svelte/elements";
    import UserIcon from "./user/UserIcon.svelte";

    export let detached = false,
        state: AutoCompleteState,
        setState: (s: AutoCompleteState) => void,
        onClick: MouseEventHandler<HTMLButtonElement>;
    const Base = cx(
        "AutoComplete",
        css`
            position: relative;
            ${detached
                ? `
            bottom: 8px;
            > div {
                border-radius: var(--border-radius);
            }`
                : ``}

            > div {
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
                    background: var(--primary-background);
                }
            }
        `,
    );
</script>

<div class={Base}>
    <div>
        {#if state.type == "user"}
            {#each state.matches as match, i}
                <button
                    class:active={i == state.selected}
                    on:mouseenter={() => {
                        if (state.type == "none") return;
                        (i != state.selected || !state.within) &&
                            setState({
                                ...state,
                                selected: i,
                                within: true,
                            });
                    }}
                    on:mouseleave={() =>
                        state.type != "none" &&
                        state.within &&
                        setState({
                            ...state,
                            within: false,
                        })}
                    on:click={onClick}
                >
                    <UserIcon
                        size={24}
                        target={match}
                        status={true}
                    />{match.username}
                </button>
            {/each}
            <!--TODO: Channel selector-->
        {/if}
    </div>
</div>
