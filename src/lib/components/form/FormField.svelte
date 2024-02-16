<script lang="ts">
    import { _ } from "svelte-i18n";
    import InputBox from "./InputBox.svelte";

    type FieldType =
    | "email"
    | "username"
    | "password"
    | "invite"
    | "current_password";
    export let type: FieldType, showOverline = false, name: string | undefined = undefined, value: string | undefined= undefined;
</script>

{#if showOverline}
    <div>{$_(`login.${type}`)}</div>
{/if}

<InputBox props={{
    placeholder: $_(`login.enter.${type}`),
    name: type == 'current_password' ? 'password' : name ?? type,
    type: type == "invite" || type == "username"
        ? "text" : type == "current_password"
        ? "password" : type,
    'on:change': function(ev){value = ev.currentTarget?.value},
}}/>