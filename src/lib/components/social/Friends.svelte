<script lang="ts">
    import { useClient } from "$lib/controllers/ClientController";
    import { autorun } from "mobx";
    import H3 from "../atoms/heading/H3.svelte";
    import Friend from "./Friend.svelte";
    import Incoming from "./Incoming.svelte";

    const client = useClient();
    let users = [...client.users.values()];
    $: autorun(()=>{
        users = [...client.users.values()];
    });
    $: users.sort((a, b) => a.username.localeCompare(b.username));
    //$: friends = users.filter(x => x.relationship == "Friend");
    let friends = [client.user!, client.user!, client.user!, client.user!];
    $: incoming = users.filter(x => x.relationship == "None");
    $: outgoing = users.filter(x => x.relationship == "Outgoing");

</script>
<H3>Solicitudes</H3>
<div class="UserGrid">
    {#each incoming as user}
        <Incoming {user} />
    {/each}
</div>

<H3>Amigos</H3>
<div class="UserGrid">
    {#each friends as user}
        <Friend {user} />
    {/each}
</div>

<style>
    .UserGrid {
        display: flex;
        flex-wrap: wrap;
        gap: 32px;
    }
</style>