<script lang="ts">
    import { SvelteComponent } from "svelte";
    
    enum Docked { None, Left, Right, Both }
    enum ShowIf { Left = 1, Right = 2, Both = 3, Always = 4 }
    export let leftPanel: SvelteComponent | null, rightPanel: SvelteComponent | null, bottomNav: SvelteComponent | null, docked: Docked;
</script>


<div></div>