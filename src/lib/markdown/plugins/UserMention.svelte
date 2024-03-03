<script lang="ts">
    import UserShort from "$lib/components/user/UserShort.svelte";
    import { clientController } from "$lib/controllers/ClientController";
    import { css, cx } from "@emotion/css";
    export let match: string;
    const Mention = cx("Mention", css`
        gap: 4px;
        flex-shrink: 0;
        padding-left: 2px;
        padding-right: 6px;
        align-items: center;
        display: inline-flex;
        vertical-align: middle;

        cursor: pointer;

        font-weight: 600;
        text-decoration: none !important;
        background: var(--secondary-background);
        border-radius: calc(var(--border-radius) * 2);

        transition: 0.1s ease filter;

        &:hover {
            filter: brightness(0.75);
        }

        &:active {
            filter: brightness(0.65);
        }

        svg {
            width: 1em;
            height: 1em;
        }`);
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a class={Mention}>
    <UserShort
        showServerIdentity
        user={clientController.availableClient.users.get(match)}
    />
</a>