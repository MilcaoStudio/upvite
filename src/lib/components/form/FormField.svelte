<script lang="ts">
    import { _ } from "svelte-i18n";
    import InputBox from "./InputBox.svelte";

    type FieldType =
        | "email"
        | "username"
        | "password"
        | "invite"
        | "current_password";
    interface Props {
        type: FieldType;
        showOverline?: boolean;
        name?: string | undefined;
        value?: string | undefined;
    }

    let {
        type,
        showOverline = false,
        name = undefined,
        value = $bindable(undefined)
    }: Props = $props();
</script>

{#if showOverline}
    <div>{$_(`login.${type}`)}</div>
{/if}

<InputBox
    placeholder={$_(`login.enter.${type}`)}
    name={type == "current_password" ? "password" : name ?? type}
    type={type == "invite" || type == "username"
        ? "text"
        : type == "current_password"
          ? "password"
          : type}
    onChange={function (ev) {
        value = ev.currentTarget?.value;
    }}
/>
