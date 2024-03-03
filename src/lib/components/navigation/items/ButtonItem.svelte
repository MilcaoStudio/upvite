<script lang="ts">
    import { cx } from "@emotion/css";

    let className = "";
    export let active = false,
        alert: "unread" | "mention" | null = null,
        alertCount = 0,
        onClick = () => {},
        compact = false;
    export { className as class };
</script>

<button
    {...$$restProps}
    class={cx("item", className, { compact }, { normal: !compact })}
    on:click={onClick}
    data-active={active}
    data-alert={typeof alert == "string"}
>
    <div class="content">
        <slot />
    </div>
    {#if alert}
        <div class="alert" data-style={alert}>
            {alertCount}
        </div>
    {/if}
</button>
