<script context="module" lang="ts">
    export type GradientStep = {
        stop?: number;
        colour: string;
    };
    const stopRegex = /(\d+)%/;
    const colourRegex = /(hsl\(.+\))|(rgba?\(.+\))|(#[a-fA-F0-9]+)/i;
    export function asStep(value: string): GradientStep {
        let stop, colour = "#000000";
        const colourResults = colourRegex.exec(value);
        console.log(colourResults);
        if(colourResults){
            colour = colourResults[1];
        }
        const stopResults = stopRegex.exec(value);
        console.log(stopResults);
        if (stopResults) {
            stop = parseInt(stopResults[1]);
        }
        return {colour, stop}
    }
</script>

<script lang="ts">
  import BxRotateLeft from "svelte-boxicons/BxRotateLeft.svelte";
  import Column from "../layout/Column.svelte";
  import IconButton from "./IconButton.svelte";
  export let shape = "linear",
    onchange: ((value: string) => void) | undefined = undefined,
    steps: GradientStep[] = [
      {
        stop: 50,
        colour: "#000000",
      },
      {
        stop: 100,
        colour: "#ffffff",
      },
    ];
  let rotation = 0;

  function toString() {
    return `${shape}-gradient(${rotation}deg, ${steps
      .map((s) => `${s.colour}` + (s.stop ?  ` ${Math.min(Math.max(s.stop, 0), 100)}%` : ``))
      .join(",")})`;
  }
  function rotateLeft() {
    rotation = rotation < 315 ? rotation + 45 : 0;
    onchange?.(toString())
  }
</script>

<div class="GradientEditor">
  <IconButton onClick={() => rotateLeft()}
    ><BxRotateLeft size={16} /></IconButton
  >
  <div>
    <div
      class="preview"
      style:background-image="{shape}-gradient(to right, {steps
        .map((s) => `${s.colour}` + (s.stop ? ` ${s.stop}%` : ""))
        .join(",")})"
    />
  </div>
  <Column>
    <table>
      <tbody>
        {#each steps as step}
          <tr>
            <td>{step.stop ? `${step.stop}%` : "-"}</td>
            <td class="sample" style:background-color={step.colour} />
            <td>{step.colour}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Column>
</div>

<style>
  .preview {
    width: 120px;
    height: 20px;
  }
  .sample {
    width: 25px;
    height: 10px;
  }
</style>
