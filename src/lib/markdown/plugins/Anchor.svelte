<script lang="ts">
    import { modalController } from "$lib/components/modals/ModalController";
    import { determineLink } from "$lib/links";
    import type { Snippet } from "svelte";
    import type { HTMLAnchorAttributes } from "svelte/elements";

    interface Props extends HTMLAnchorAttributes {
        children?: Snippet;
    }

    let { href = undefined, children, ...rest }: Props = $props();
    let link = $derived(determineLink(href || ""));
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
        onclick={(ev) =>{
            ev.preventDefault();
            modalController.openLink(
                href,
                false,
                ev.currentTarget.innerText != href,
            );
            }}
        {...rest}
    >
        {@render children?.()}
    </a>
{/if}

<style>
    a:hover {
        text-decoration: underline;
    }
</style>