<script lang="ts">
    import { PersonPicture } from "fluent-svelte";
    import type { Server, File } from "stoat.js";

    interface Props {
        target?: Server | null;
        attachment?: File | undefined;
        size: number;
        animate?: boolean;
        server_name?: string;
    }

    let {
        target = null,
        attachment = undefined,
        size,
        animate = false,
        server_name = ''
    }: Props = $props();
    const iconURL = animate ? (target?.animatedIconURL || attachment?.createFileURL(true)) : (target?.iconURL || attachment?.createFileURL());

    const name = target?.name ?? server_name;
</script>
<!--
<PersonPicture class="ServerText" src={iconURL} alt={name} {size} {...$$restProps} />
-->