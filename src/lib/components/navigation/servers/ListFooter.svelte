<script lang="ts">
    import Tooltip from "$lib/components/atoms/Tooltip.svelte";
    import { PersonPicture } from "fluent-svelte";
    import { ItemContainer } from "./Item.svelte";
    import BxPlus from "svelte-boxicons/BxPlus.svelte";
    export let createServer: ()=>void;
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a  on:click={createServer} on:keydown={createServer} role="button" tabindex="0">
    <div class={ItemContainer}>
        <Tooltip content="Add a Server" div right>
            <PersonPicture size={42} style="background-color: var(--background);">
                <BxPlus color="var(--accent)" size={24} />
            </PersonPicture>
        </Tooltip>
    </div>
</a>
<!--TODO: discover icon-->