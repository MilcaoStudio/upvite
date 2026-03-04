<script lang="ts">
    import { PersonPicture } from "fluent-svelte";
    import type { Server, File } from "stoat.js";

    export let target: Server | null = null, attachment: File | undefined = undefined, size: number, animate = false, server_name = '';
    const iconURL = animate ? (target?.animatedIconURL || attachment?.createFileURL(true)) : (target?.iconURL || attachment?.createFileURL());

    const name = target?.name ?? server_name;
</script>
<!--
<PersonPicture class="ServerText" src={iconURL} alt={name} {size} {...$$restProps} />
-->