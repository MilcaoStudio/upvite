<script lang="ts">
    import { useClient } from "$lib/components/client/ClientContext.svelte";
    import UserShort from "$lib/components/user/UserShort.svelte";
    import { css } from "@emotion/css";
    interface Props {
        match: string;
    }

    const client = useClient();
    let { match }: Props = $props();
    const Mention = css`
        &:hover {
            filter: brightness(0.75);
        }

        &:active {
            filter: brightness(0.65);
        }

        svg {
            width: 1em;
            height: 1em;
        }`;
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<a class={["user-mention", Mention]}>
    <UserShort
        showServerIdentity
        user={client.users.get(match)}
    />
</a>

<style>
    .user-mention {
        gap: 4px;
        flex-shrink: 0;
        padding-left: 2px;
        padding-right: 6px;
        align-items: center;
        display: inline-flex;
        vertical-align: middle;

        cursor: pointer;

        font-weight: 600;
        text-decoration: none;
        background: var(--secondary-background);
        border-radius: calc(var(--border-radius) * 2);

        transition: 0.1s ease filter;
    }
</style>