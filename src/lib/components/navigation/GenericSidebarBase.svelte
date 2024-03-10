<script lang="ts">
    import { isTouchscreenDevice } from "$lib";
    import { css, cx } from "@emotion/css";

    export let mobilePadding = false;
    const Base = cx("GenericSidebar", css`
        width: 232px;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        background: var(--secondary-background);
        border-radius: var(--border-radius-inner);
        margin: 6px 0px 6px 0px;
        overflow: hidden;
        position: relative;

    `)
</script>

<div class={Base}>
    <slot />
</div>