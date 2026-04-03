<script lang="ts">
    import ButtonLarge from "$lib/components/atoms/buttons/ButtonLarge.svelte";
    import H1 from "$lib/components/atoms/heading/H1.svelte";
    import InDevelopment from "$lib/components/atoms/inDevelopment.svelte";
    import { useClient } from "$lib/components/client/ClientContext.svelte";
    import { modalController } from "$lib/components/modals/ModalController";
    import { t } from "svelte-i18n";

    let email = $state<string>();
    const client = useClient();
    const setEmail = (value: string) => { email = value };
    $effect(() => {
        if (!email) {
            client.account.fetchEmail().then(setEmail);
        }
    });
</script>

<div class="base">
    <InDevelopment></InDevelopment>

    <H1>{$t("app.settings.pages.account.title")}</H1>

    {#if client}
        <ButtonLarge
            onClick={() =>
                modalController.push({
                    type: "modify_account",
                    field: "username",
                    client,
                })}
        >
            {#snippet title()}
                        <div >
                    {$t("login.username")}
                </div>
                    {/snippet}
            {client.user?.username}
        </ButtonLarge>
        <ButtonLarge
            onClick={() =>
                modalController.push({
                    type: "modify_account",
                    field: "email",
                    client,
                })}
        >
            {#snippet svg()}
                        <svg
                    
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-mail"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                        d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"
                    />
                    <path d="M3 7l9 6l9 -6" />
                </svg>
                    {/snippet}
            {#snippet title()}
                        <div >
                    {$t("login.email")}
                </div>
                    {/snippet}
            {email}
        </ButtonLarge>
        <ButtonLarge
            onClick={() =>
                modalController.push({
                    type: "modify_account",
                    field: "password",
                    client,
                })}
        >
            {#snippet svg()}
                        <svg
                    
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-key"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                        d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0z"
                    />
                    <path d="M15 9h.01" />
                </svg>
                    {/snippet}
            {#snippet title()}
                        <div >
                    {$t("login.password")}
                </div>
                    {/snippet}
            •••••••••
        </ButtonLarge>
    {/if}
</div>

<style>
    .base {
        display: flex;
        gap: 12px;
        flex-direction: column;
    }
</style>
