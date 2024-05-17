<script lang="ts">
    import { css } from "@emotion/css";

    export let borderRadius: string | null = null, hover = false, alt: string | null = null;
    let Base = css`
        flex-shrink: 0;
        object-fit: cover;
        ${hover ? `&:hover img { filter: brightness(0.8);}` : ``}
    `;
</script>

<img class={Base} style:border-radius="var({borderRadius})" {alt} {...$$restProps} />