<script lang="ts">
    import Prism from "$lib/markdown/prism";

    export let value = "", minHeight = 0, maxRows = 5, lineHeight = "var(--textarea-line-height)", onBlur: (()=>void) | undefined = undefined;
    let highlight = "";
    $: console.log(highlight);
    $: highlight = Prism.highlight(value, Prism.languages.py, "python");
</script>
<!--<Scrubble />-->
<!--
    <div role="textbox" aria-multiline="true" spellcheck="true" aria-haspopup="listbox" aria-invalid="false" aria-autocomplete="list" class="markup_a7e664 editor__66464 slateTextArea_b19976 fontSize16Padding_bcbeae" autocorrect="off" data-can-focus="true" aria-label="Mensaje #dev" data-slate-editor="true" data-slate-node="value" contenteditable="true" zindex="-1" style="position: relative; outline: none; white-space: pre-wrap; overflow-wrap: break-word;">
        Line 1
        <div data-slate-node="element">
            Text node
            <span data-slate-node="text">
                Code node
                <span data-slate-leaf="true" class="codeBlockSyntax__4104a" spellcheck="false">
                    <span data-slate-string="true">```</span>
                </span>
                Lenguage node
                <span data-slate-leaf="true" class="">
                    <span data-slate-string="true">py</span>
                </span>
            </span>
        </div>
        Line 2
        Code line
        <div class="codeLine__10acb" spellcheck="false" data-slate-node="element">
            Text node
            <span data-slate-node="text">
                Prism syntax
                <span data-slate-leaf="true" class="hljs-keyword"><span data-slate-string="true">def</span></span><span data-slate-leaf="true" class=""><span data-slate-string="true"> </span></span><span data-slate-leaf="true" class="hljs-title function_"><span data-slate-string="true">main</span></span><span data-slate-leaf="true" class=""><span data-slate-string="true">():</span></span></span></div><div class="codeLine__10acb" spellcheck="false" data-slate-node="element"><span data-slate-node="text"><span data-slate-leaf="true" class=""><span data-slate-string="true">  </span></span><span data-slate-leaf="true" class="hljs-built_in"><span data-slate-string="true">print</span></span><span data-slate-leaf="true" class=""><span data-slate-string="true">(</span></span><span data-slate-leaf="true" class="hljs-string"><span data-slate-string="true">"Hola mundo"</span></span><span data-slate-leaf="true" class=""><span data-slate-string="true">)</span></span></span></div><div data-slate-node="element"><span data-slate-node="text"><span data-slate-leaf="true" class="codeBlockSyntax__4104a" spellcheck="false"><span data-slate-string="true">```</span></span></span></div></div>
-->
<div class="TextEditor" style:min-height="{minHeight}px" style:max-height="calc({lineHeight} * {maxRows})" role="textbox" aria-multiline="true" spellcheck="true" aria-haspopup="listbox" aria-invalid="false" aria-autocomplete="list" autocorrect="off"  contenteditable="true" {...$$restProps} on:blur={onBlur}>
    <div class="codeline">
        <code>{@html highlight}</code>
    </div>
</div>

<style>
    .TextEditor {
        position: relative;
        outline: none;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        flex-grow: 1;
        display: flex;
        padding: var(--message-box-padding);
        border-radius: var(--border-radius-inner);
        border: var(--input-border-width) solid var(--accent);
    }
</style>