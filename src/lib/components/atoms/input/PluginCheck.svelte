<script lang="ts">
    import { state } from "$lib/State";
    import type { PluginInfo } from "$lib/stores/Plugins";
    import { Checkbox } from "fluent-svelte";
    import { onDestroy } from "svelte";

    const plugins = state.plugins;
    export let plugin: PluginInfo;
    let checked = plugin.enabled;
    function onChange() {
        console.log(plugin.id);
        // checked value updates slower than onChange
        // then if the check WAS off, it IS actually on
        if (!checked) {
            plugins.load(plugin.namespace, plugin.id);
        } else {
            plugins.unload(plugin.namespace, plugin.id);
        }
    }
    let source = plugins.get(`${plugin.namespace}/${plugin.id}`)?.entrypoint;
    let url = source && URL.createObjectURL(new Blob([source], {type: "text/plain"}));
    onDestroy(()=>url && URL.revokeObjectURL(url));
</script>

<Checkbox bind:checked on:change={onChange}>{plugin.namespace}/{plugin.id} {plugin.version}</Checkbox>
<a href={url} target="_blank"><button>View entrypoint</button></a>
<button on:click={()=>plugins.remove(plugin.namespace, plugin.id)}>Remove</button>