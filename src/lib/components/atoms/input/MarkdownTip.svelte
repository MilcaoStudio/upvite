<script>
    import { css, cx } from "@emotion/css";

    const MarkdownTip = cx(
        "MarkdownTip",
        css`
            display: flex;
            align-items: center;
            margin-top: 8px;
            gap: 4px;
            user-select: none;
            color: var(--foreground);

            svg {
                flex-shrink: 0;
            }

            a:hover {
                text-decoration: underline;
            }

            h5 {
                margin: 0;
            }
        `,
    );
</script>

<div class={MarkdownTip}><slot /></div>
