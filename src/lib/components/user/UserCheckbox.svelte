<script lang="ts">
    import { Checkbox } from "fluent-svelte";
    import Row from "../atoms/layout/Row.svelte";
    import UserIcon from "./UserIcon.svelte";
    import Username from "./Username.svelte";
    import type { User } from "stoat.js";

    interface Props {
        checked: boolean;
        user?: User | undefined;
        onChange: (v: boolean)=>void;
    }

    let { checked = $bindable(), user = undefined, onChange }: Props = $props();
    $effect(() => {
        onChange(checked);
    });
</script>

<Checkbox value={user?.id} bind:checked>
    <Row centred gap="8px">
        <UserIcon target={user} size={32} />
        <Username {user} />
    </Row>
</Checkbox>
