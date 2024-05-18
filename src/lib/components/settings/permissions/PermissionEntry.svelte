<script lang="ts">
    import { t } from "svelte-i18n";
    import Lock from "svelte-boxicons/BxLock.svelte";

    export let disabled = false, id: string;
</script>

<label class="PermissionEntry" style:color={disabled ? "var(--tertiary-foreground)" : ""}>
    <span class="title">
        <span>
            {$t(`permissions.${id}.t`, { default: id })}
            {#if disabled}
                <Lock size={14} class="lock" />
            {/if}
        </span>
        <span class="description">
            {$t(`permissions.${id}.d`)}
        </span>
    </span>
    <slot />
</label>

<style>
    .PermissionEntry {
        gap: 8px;
        width: 100%;
        margin: 8px 0;
        display: flex;
        align-items: center;
    }

    .title {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    :global(.lock) {
        margin-inline-start: 4px;
    }

    .description {
        font-size: 0.8em;
        color: var(--secondary-foreground);
    }
</style>