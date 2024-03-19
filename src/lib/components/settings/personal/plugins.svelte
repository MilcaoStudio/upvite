<script lang="ts">
    import { takeError } from "$lib";
    import { state } from "$lib/State";
    import InDevelopment from "$lib/components/atoms/inDevelopment.svelte";
    import PluginCheck from "$lib/components/atoms/input/PluginCheck.svelte";
    import FileReader from "$lib/controllers/FileReader.svelte";
    import type { PluginInfo } from "$lib/stores/Plugins";
    import { autorun } from "mobx";
    let list: PluginInfo[] = [];
    $: autorun(()=>{
        list = state.plugins.list();
    })
</script>
Installed plugins
{#each list as plugin}
    <PluginCheck {plugin} />
{/each}

Add a plugin
<FileReader accept="application/json" maxFileSize={50_000} onChange={async (file)=>{
    try {
        const content = await file.text();
        const object = JSON.parse(content);
        if (!object.entrypoint) {
            console.error(file.name, "does not include an entrypoint");
        }
        if (!object.id) {
            console.error(file.name, "does not include an id");
        }
        state.plugins.add({
            format: object.format || 1,
            namespace: object.namespace || "",
            id: object.id,
            version: object.version || "1.0.0",
            entrypoint: object.entrypoint,
            enabled: typeof object.enabled == "undefined" || object.enabled,
        })
    } catch (err) {
        console.error(takeError(err));
    }
}}>
Import from JSON
</FileReader>