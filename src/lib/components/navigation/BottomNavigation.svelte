<script>
    import IconButton from "../atoms/input/IconButton.svelte";
    import Cog from "svelte-boxicons/BxCog.svelte";
    import Group from "svelte-boxicons/BxGroup.svelte";
    import Chat from "svelte-boxicons/BxChat.svelte";
    import { state } from "$lib/State";

</script>
<div class="BottomNavigation">
    <IconButton href={state.layout.getLastHomePath()}>
        <Chat size={32} />
    </IconButton>
    <IconButton href="/friends">
        <Group size={32} />
    </IconButton>
    <IconButton href="/settings">
        <Cog size={32} />
    </IconButton>
</div>

<style>
    .BottomNavigation {
        padding: .25rem 0;
        display: flex;
        justify-content: space-evenly;
        background-color: var(--secondary-background);
    }
</style>