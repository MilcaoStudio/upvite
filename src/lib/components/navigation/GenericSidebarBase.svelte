<script lang="ts">
    import { isTouchscreenDevice } from "$lib";
    import { css, cx } from "@emotion/css";

    export let mobilePadding = false;
    const Base = cx("GenericSidebar", css`
        height: 100%;
        width: 232px;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        background: var(--secondary-background);

        ${mobilePadding && isTouchscreenDevice && ``}
    `)
</script>

<div class={Base}>
    <slot />
</div>