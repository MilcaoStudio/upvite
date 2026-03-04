<script lang="ts">
    import { cx } from "@emotion/css";
    import "./Item.css";

    interface Props {
        class?: string;
        active?: boolean;
        alert?: "unread" | "mention" | null;
        alertCount?: number;
        onClick?: any;
        compact?: boolean;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        class: className = "",
        active = false,
        alert = null,
        alertCount = 0,
        onClick = () => {},
        compact = false,
        children,
        ...rest
    }: Props = $props();
    
</script>

<button
    {...rest}
    class={cx("item", className, { compact }, { normal: !compact })}
    onclick={onClick}
    data-active={active}
    data-alert={typeof alert == "string"}
>
    <div class="content">
        {@render children?.()}
    </div>
    {#if alert}
        <div class="alert" data-style={alert}>
            {alertCount}
        </div>
    {/if}
</button>
