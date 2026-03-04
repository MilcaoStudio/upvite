<script lang="ts">
    import { preventDefault } from 'svelte/legacy';

    import { modalController } from "$lib/components/modals/ModalController";
    import { determineLink } from "$lib/links";

    interface Props {
        href?: string | undefined;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let { href = undefined, children, ...rest }: Props = $props();
    let link = $derived(determineLink(href));
</script>

{#if !href || href.startsWith("#")}
    <a {href} {...rest}>
        {@render children?.()}
    </a>
{:else if link.type == "none"}
    <a href="null" {...rest}>
        {@render children?.()}
    </a>
{:else if link.type == "navigate"}
    <a href={link.path}>
        {@render children?.()}
    </a>
{:else}
    <a
        {href}
        target="_blank"
        rel="noreferrer"
        onclick={preventDefault((ev) =>
            modalController.openLink(
                href,
                false,
                ev.currentTarget.innerText != href,
            ))}
        {...rest}
    >
        {@render children?.()}
    </a>
{/if}
