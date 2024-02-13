<script>
    export let gap = '8px', group = '16px', centred = false, grow = false;
    const css = `<style>
        .Column {
            display: flex;
            flex-direction: column;
            gap: ${gap};
            margin: ${typeof group == 'string' ? group : '16px'} 0;
            ${centred && 'align-items: center;'}
            ${grow && 'flex-grow: 1;'}
        }
    </style>`
</script>

{@html css}
<div class="Column">
    <slot />
</div>