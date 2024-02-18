<script>
    import { css, cx } from "@emotion/css";

    export let compact = false;
    $: Category = cx('Category', css`
    padding: ${compact ? "0 4px" : "6px 0 6px 8px"};
    `)
</script>

<div class={Category}>
    <slot />
</div>