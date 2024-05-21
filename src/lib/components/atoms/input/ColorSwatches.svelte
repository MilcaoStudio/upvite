<script lang="ts">
    import InputElement from "$lib/components/form/InputElement.svelte";
    import BxCheck from "svelte-boxicons/BxCheck.svelte";
    import Column from "../layout/Column.svelte";
    import Row from "../layout/Row.svelte";
    import HueSlider from "./HueSlider.svelte";
    import Swatch from "./Swatch.svelte";
    import GradientEditor, {getSteps} from "./GradientEditor.svelte";

    export let colour: string | null = null, disabled = false, onChange: (color: string) => void;
    let gradient = "none";
    let hue = 0;
    let lightness_tones = ["20%", "40%", "50%", "60%", "80%", "90%"];
    function onGradientChange(value: string) {
        gradient = value;
    }
    function onSolidColorChange(value: string) {
        colour = value;
    }
</script>

<InputElement
    props={{
        disabled,
        type: "combo",
        value: colour?.startsWith("linear") ? "linear" : colour?.startsWith("radial") ? "radial" : colour?.startsWith("conic") ? "conic" : "none",
        options: [
            { value: "none", name: "Solid Color" },
            { value: "linear", name: "Linear Gradient" },
            { value: "radial", name: "Radial Gradient" },
            { value: "conic", name: "Conic Gradient" },
        ],
        onChange: onGradientChange,
    }}
/>
{#if gradient == "none"}
    <Row gap="16px" centred>
        <div class="preview" style:background={colour} />
        <Column centred>
            <HueSlider {disabled} bind:value={hue}>Hue</HueSlider>
            <Column>
                <Row gap="8px">
                    {#each lightness_tones as light (light)}
                        <Swatch
                            hsl={[hue, "100%", light]}
                            onchange={onSolidColorChange}
                            let:colour={bgColour}
                        >
                            {#if colour == bgColour}
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
                            let:colour={bgColour}
                        >
                            {#if colour == bgColour}
                                <BxCheck size={18} />
                            {/if}
                        </Swatch>
                    {/each}
                </Row>
            </Column>
        </Column>
    </Row>
{:else}
    <Row gap="8px" centred>
        <div class="preview" style:background={colour} />
        {#if colour?.startsWith("linear-gradient")}
            <GradientEditor steps={getSteps(colour) ?? []} />
        {:else}
            <GradientEditor  />
        {/if}
        
    </Row>
{/if}

<style>
    .preview {
        width: 200px;
        height: 100px;
    }
</style>
