<script>
    import { css, cx } from "@emotion/css";

    let className = "";
    export {className as class}
    export let gap = '8px', group = '16px', centred = false, grow = false;
    $: style = css`
            display: flex;
            flex-direction: column;
            gap: ${gap};
            margin: ${typeof group == 'string' ? group : '16px'} 0;
            ${centred ? 'align-items: center;': ''}
            ${grow ? 'flex-grow: 1;' : ''}
        }`;
</script>

<div class={cx('Column', className, style)}>
    <slot />
</div>