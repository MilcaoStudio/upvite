<script lang="ts">
    import { css } from "@emotion/css";

    export let borderRadius: string | null = null, hover = false, alt: string | null = null;
    const Base = css`
        flex-shrink: 0;
        object-fit: cover;
        ${borderRadius ? `border-radius: var(${borderRadius})` : ``}
        ${hover ? `&:hover img { filter: brightness(0.8);}` : ``}
    `;
</script>

<img class={Base} {alt} {...$$restProps} />