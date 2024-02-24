<script lang="ts">
    import { css, cx } from "@emotion/css";

    export let unread = false, date = '';
    const Base = cx('MessageDivider', css`
        display: flex;
        align-items: center;
        height: 0;
        margin: 17px 12px 5px;
        border-top: thin solid var(--tertiary-foreground);
        user-select: none;

        time {
            margin-top: -2px;
            font-size: 0.6875rem;
            line-height: 0.6875rem;
            font-weight: 600;
            padding-inline: 5px 5px;

            // We set the background to mask the border.
            color: var(--tertiary-foreground);
            background: var(--primary-background);
        }
        ${unread ? `border-top: thin solid var(--accent);`: ``}
    `);
</script>

<div class={Base}>
    {#if unread}
        <div class="Unread">NEW</div>
    {/if}
    {#if date}
        <time>{date}</time>
    {/if}
</div>

<style>
div.Unread {
    font-size: 0.625rem;
    font-weight: 600;
    background: var(--accent);
    color: var(--accent-contrast);

    padding: 2px 6px;
    margin-top: -1px;
    border-radius: 60px;
}
</style>