<script lang="ts">
    import { takeError } from "$lib";
    import { state } from "$lib/State";
    import TextAreaAutoSize from "$lib/components/atoms/TextAreaAutoSize.svelte";
    import H1 from "$lib/components/atoms/heading/H1.svelte";
    import H2 from "$lib/components/atoms/heading/H2.svelte";
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import InputBox from "$lib/components/form/InputBox.svelte";
    import { clientController } from "$lib/controllers/ClientController";
    import FileReader from "$lib/controllers/FileReader.svelte";
    import FileWriter from "$lib/controllers/FileWriter.svelte";
    import Button from "$lib/components/atoms/Button.svelte";
    import { Checkbox } from "fluent-svelte";
    import Play from "svelte-boxicons/BxPlay.svelte";

    document.title = "Sandbox | Uprising";
    const entryPlaceholder =
        "ctx => {\n\treturn {\n\t\tonUnload(){},\n\t\tonUpdate(){}\n\t}\n}";
    const ctx = state.plugins.ctx;
    let entrypoint = "";
    let format = 1;
    let namespace = "";
    let id = "";
    let version = "1.0.0";
    let enabled = true;
    let error: string = "";
    let channel_id: string = "";
    $: ctx.channel = clientController.availableClient.channels.get(channel_id);
    $: ctx.server = ctx.channel?.server;

    function setEntrypoint(content?: string) {
        entrypoint = content ?? "";
    }
    function runScript() {
        if (!entrypoint) {
            error = "Entrypoint is empty"; 
            return;
        }
        if (entrypoint.includes("revolt.chat")) {
            console.warn("This entrypoint is hardcoding a connection to another instance. It is recommended to use URLs provided from `ctx.configuration`.")
        }
        try {
            // Test 1
            const func = eval(entrypoint) as Function;
            console.log("Test 1 passed.");
            if (typeof func != "function") {
                throw TypeError("entrypoint is not a function");
            }
            // Test 2
            const instance = func.call(null, ctx);
            console.log("Test 2 passed.");
            if (!instance) {
                console.warn("Function is void. All test passed.");
                return;
            }
            // Test 3
            if (instance.onUnload) {
                instance.onUnload();
            } else {
                console.warn("Function does not return onUnload. Please take care of garbage collector.")
            }
            console.log("Test 3 passed.");
            // Test 4
            if (instance.onUpdate) {
                instance.onUpdate();
            } else {
                console.warn("Function does not return onUpdate. Then, it cannot be updated.")
            }
            console.log("Test 4 passed.");
            console.log("All test passed.");
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                error = `${err.name}: ${err.message}`;
            } else {
               error = takeError(err); 
            }
        }
    }
    async function onChange(file: File) {
        try {
            const content = await file.text();
            const object = JSON.parse(content);
            format = object.format || 1;
            namespace = object.namespace || namespace;
            id = object.id || id;
            version = object.version || version;
            setEntrypoint(object.entrypoint);
            enabled = object.enabled || enabled;
        } catch (err) {
            console.error(err);
        }
    }
</script>

<!--Only the entrypoint matters-->
<svelte:window on:beforeunload={(ev)=>entrypoint && ev.preventDefault()} />

<section>
    <H1>Make your own plugin</H1>
</section>
<section>
    <H2>Context</H2>
    <div class="row">
        <div>
            Channel ID:
            <InputBox type="text" bind:value={channel_id} placeholder={"0".repeat(26)} maxlength="26" /> 
        </div>
    </div>
</section>
<section>
    <H3>Plugin configuration</H3>
    <FileReader maxFileSize={50_000} accept="application/json" {onChange}>Import configuration</FileReader>
    Format:
    <input type="number" bind:value={format} max="1" disabled />
    <br />
    <div class="row">
        <div>
            Namespace:
            <br>
            (Author or organization name)
            <br>
            <InputBox type="text" bind:value={namespace} />
        </div>
        <div>
            ID:
            <InputBox type="text" bind:value={id} placeholder="my_plugin" />
        </div>
        <div>
            Version:
            <InputBox type="text" bind:value={version} placeholder="1.0.0" />
        </div>
    </div>
    Entrypoint:
    <Button props={{palette: "plain"}} on:click={runScript}><Play size={14} />Run</Button>
    {#if error}
        <span style:color="var(--error)">{error}</span>
    {/if}
    
    <TextAreaAutoSize
        code
        tabSize="2"
        maxRows={50}
        minHeight={300}
        value={entrypoint}
        onChange={(ev) => setEntrypoint(ev.currentTarget.value)}
        placeholder={entryPlaceholder}
    />
    <Checkbox bind:checked={enabled}>Export as enabled</Checkbox>
    <br />
    <FileWriter
        fileType="application/json"
        filename="plugin.json"
        disabled={!id || !entrypoint}
        data={JSON.stringify({
            format,
            namespace,
            id,
            version,
            entrypoint,
            enabled,
        })}
    />
</section>

<style>
    section {
        padding: 2rem;
    }
    .row {
        display: flex;
        gap: 30px;
        align-items: end;
        margin: 1rem 0;
    }
</style>
