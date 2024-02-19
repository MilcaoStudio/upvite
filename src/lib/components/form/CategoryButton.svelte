<script lang="ts">
    import { css, cx } from "@emotion/css";
    import { BxChevronRight, BxLinkExternal } from 'svelte-boxicons'
    export let disabled = false,
        account = false, icon: ConstructorOfATypedSvelteComponent, description = '', onClick=function(){}, action: 'chevron' | 'external' | ConstructorOfATypedSvelteComponent = 'chevron';
    $: Base = cx(
        "Base",
        css`
            ${disabled
                ? `
                opacity: 0.4;
                .action {
                    font-size: 0.875rem;
                }`
                : `cursor: pointer;
                  opacity: 1;
                  transition: 0.1s ease background-color;

                  &:hover {
                      background: var(--secondary-background);
                  }`}
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
    );
</script>

<style>
    a.Base {
        padding: 9.8px 12px;
        border-radius: var(--border-radius);
        margin-bottom: 10px;
        color: var(--foreground);
        background: var(--secondary-header);
        gap: 12px;
        display: flex;
        align-items: center;
        flex-direction: row;
    }

    a.Base > :global(svg) {
        flex-shrink: 0;
    }

    a.Base .content {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        font-weight: 600;
        font-size: 0.875rem;
    }

    a.Base .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    a.Base .description {
        font-weight: 400;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        color: var(--secondary-foreground);
    }
    a.Base .description :global(a:hover) {
        text-decoration: underline;
    }
</style>

<!-- svelte-ignore a11y-missing-attribute -->
<a class={Base} role="button" tabindex="0" on:click={onClick} on:keydown={onClick}>
    <svelte:component this={icon} size={24} />
    <div class="content">
        <div class="title">
            <slot />
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
            <svelte:component this={action} size="32" />
        {/if}
    </div>
</a>