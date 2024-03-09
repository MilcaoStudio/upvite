<script lang="ts">
    import { modalController } from "$lib/components/modals/ModalController";
    import { determineLink } from "$lib/links";

    export let href: string | undefined = undefined;
    $: link = determineLink(href);
</script>

{#if !href || href.startsWith("#")}
    <a {href} {...$$restProps}>
        <slot />
    </a>
{:else if link.type == "none"}
    <a href="null" {...$$restProps}>
        <slot />
    </a>
{:else if link.type == "navigate"}
    <a href={link.path}>
        <slot />
    </a>
{:else}
    <a
        {href}
        target="_blank"
        rel="noreferrer"
        on:click|preventDefault={(ev) =>
            modalController.openLink(
                href,
                false,
                ev.currentTarget.innerText != href,
            )}
        {...$$restProps}
    >
        <slot />
    </a>
{/if}
