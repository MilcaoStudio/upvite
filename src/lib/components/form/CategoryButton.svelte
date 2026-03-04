<script lang="ts">
    import { css, cx } from "@emotion/css";
    import BxChevronRight from "svelte-boxicons/BxChevronRight.svelte";
    import BxLinkExternal from "svelte-boxicons/BxLinkExternal.svelte";

    interface Props {
        disabled?: boolean;
        account?: boolean;
        icon: ConstructorOfATypedSvelteComponent;
        description?: string;
        onClick?: any;
        action?: 'chevron' | 'external' | ConstructorOfATypedSvelteComponent;
        children?: import('svelte').Snippet;
    }

    let {
        disabled = false,
        account = false,
        icon,
        description = '',
        onClick = function(){},
        action = 'chevron',
        children
    }: Props = $props();
    let CategoryButton = $derived(cx(
        "CategoryButton",
        css`
            ${account
                ? `
                height: 54px;
                .content {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                .title {
                text-transform: uppercase;
                font-size: 0.75rem;
                color: var(--secondary-foreground);
                }

                .description {
                font-size: 0.9375rem;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                }
                }`
                : ``}
        `,
    ));

    const SvelteComponent = $derived(icon);
</script>

<style>
    a.CategoryButton {
        padding: .5rem 12px;
        border-radius: var(--border-radius);
        margin-bottom: 10px;
        color: var(--foreground);
        background: var(--secondary-header);
        gap: 12px;
        display: flex;
        align-items: center;
        flex-direction: row;
        cursor: pointer;
        opacity: 1;
        transition: 0.1s ease background-color;
    }

    a.CategoryButton.disabled {
        opacity: 0.4;
    }

    a.CategoryButton:not(.disabled):hover {
        background: var(--secondary-background);
    }

    a.CategoryButton > :global(svg) {
        flex-shrink: 0;
    }

    a.CategoryButton .content {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        font-weight: 600;
        font-size: 0.875rem;
    }

    a.CategoryButton .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow: hidden;
    }
    a.CategoryButton .description {
        font-weight: 400;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        overflow: hidden;
        color: var(--secondary-foreground);
    }
    a.CategoryButton .description :global(a:hover) {
        text-decoration: underline;
    }
</style>

<!-- svelte-ignore a11y_missing_attribute -->
<a class="{CategoryButton} {disabled ? "disabled" : ""}" role="button" tabindex="0" onclick={onClick} onkeydown={onClick}>
    <SvelteComponent size={24} />
    <div class="content">
        <div class="title">
            {@render children?.()}
        </div>
        {#if description}
            <div class="description">{description}</div>
        {/if}
    </div>
    <div class="action">
        {#if typeof action == 'string'}
            {#if action == 'chevron'}
                <BxChevronRight size="24"/>
            {:else}
                <BxLinkExternal size="20"/>
            {/if}
        {:else}
            {@const SvelteComponent_1 = action}
            <SvelteComponent_1 size="32" />
        {/if}
    </div>
</a>