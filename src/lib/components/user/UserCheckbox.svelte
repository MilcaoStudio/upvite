<script lang="ts">
    import { run } from 'svelte/legacy';

    import { Checkbox } from "fluent-svelte";
    import Row from "../atoms/layout/Row.svelte";
    import UserIcon from "./UserIcon.svelte";
    import Column from "../atoms/layout/Column.svelte";
    import Username from "./Username.svelte";
    import type { User } from "stoat.js";

    interface Props {
        checked: boolean;
        user?: User | undefined;
        onChange: (v: boolean)=>void;
    }

    let { checked = $bindable(), user = undefined, onChange }: Props = $props();
    run(() => {
        onChange(checked);
    });
</script>

<Checkbox value={user?.id} bind:checked>
    <Row centred gap="8px">
        <UserIcon target={user} size={32} />
            <Username {user} />
        </Row
    >
</Checkbox>
