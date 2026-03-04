<script>
    import { css, cx } from "@emotion/css";

    /** @type {{compact?: boolean, children?: import('svelte').Snippet}} */
    let { compact = false, children } = $props();
    let Category = $derived(cx('Category', css`
    padding: ${compact ? "0 4px" : "6px 0 6px 8px"};
    `))
</script>

<div class={Category}>
    {@render children?.()}
</div>