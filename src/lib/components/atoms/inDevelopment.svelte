<script>
    import Emoji from "$lib/markdown/plugins/Emoji.svelte";
import { InfoBar } from "fluent-svelte";

</script>
<InfoBar closable={false} >
        <Emoji slot="icon" match="🛠"></Emoji>
        
	In development, some feature might be not ready in this build.
</InfoBar>

