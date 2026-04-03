<script lang="ts">
    import { css } from "@emotion/css";

    interface Props {
        borderRadius?: string | null;
        hover?: boolean;
        alt?: string | null;
        [key: string]: any
    }

    let { borderRadius = null, hover = false, alt = null, ...rest }: Props = $props();
    let Base = $derived(css`
        flex-shrink: 0;
        object-fit: cover;
        ${hover ? `&:hover img { filter: brightness(0.8);}` : ``}
    `);
</script>

<img class={Base} style:border-radius="var({borderRadius})" {alt} {...rest} />