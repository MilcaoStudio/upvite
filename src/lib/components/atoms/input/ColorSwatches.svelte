<script lang="ts">
    import InputElement from "$lib/components/form/InputElement.svelte";
    import BxCheck from "svelte-boxicons/BxCheck.svelte";
    import Column from "../layout/Column.svelte";
    import Row from "../layout/Row.svelte";
    import HueSlider from "./HueSlider.svelte";
    import Swatch from "./Swatch.svelte";
    export let disabled = false, onChange: (color: string) => void;
    let gradient = "None";
    let selected: string[] = ["#000000"];
    let hue = 0;
    $: console.log(selected);
    let lightness_tones = ["20%", "40%", "50%", "60%", "80%", "90%"];
    function onGradientChange(value: string) {
        gradient = value;
    }
    function onSolidColorChange(value: string) {
        selected[0] = value;
    }
</script>

<InputElement
    props={{
        disabled,
        type: "combo",
        value: "None",
        options: [
            { value: "None", name: "Solid color" },
            { value: "Linear", name: "Linear gradient" },
            { value: "Radial", name: "Radial Gradient" },
            { value: "Conic", name: "Conic Gradient" },
        ],
        onChange: onGradientChange,
    }}
/>
{#if gradient == "None"}
    <Row gap="16px" centred>
        <div class="preview" style:background-color={selected[0]} />
        <Column centred>
            <HueSlider {disabled} bind:value={hue}></HueSlider>
            <Column>
                <Row gap="8px">
                    {#each lightness_tones as light (light)}
                        <Swatch
                            hsl={[hue, "100%", light]}
                            onchange={onSolidColorChange}
                            let:colour
                        >
                            {#if selected[0] == colour}
                                <BxCheck size={18} />
                            {/if}
                        </Swatch>
                    {/each}
                </Row>
                <Row gap="8px">
                    {#each lightness_tones as light (light)}
                        <Swatch
                            hsl={[hue, "60%", light]}
                            onchange={onSolidColorChange}
                            let:colour
                        >
                            {#if selected[0] == colour}
                                <BxCheck size={18} />
                            {/if}
                        </Swatch>
                    {/each}
                </Row>
            </Column>
        </Column>
    </Row>
{/if}

<style>
    .preview {
        width: 200px;
        height: 100px;
    }
</style>
