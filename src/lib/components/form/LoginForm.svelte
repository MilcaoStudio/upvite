<script lang="ts">
    import { preventDefault } from 'svelte/legacy';

    import { takeError } from "$lib";
    import { clientController } from "$lib/controllers/ClientController";
    import { _, locale } from "svelte-i18n";
    import Preloader from "../indicators/Preloader.svelte";
    import FormField from "./FormField.svelte";
    import Button from "../atoms/Button.svelte";
    import MailProvider from "./MailProvider.svelte";

    interface FormInputs {
        email: string;
        password: string;
    }

    interface Props {
        type: "create" | "login" | "send_reset" | "reset" | "resend";
        callback: (fields: {
        email: string;
        password: string;
        captcha?: string;
    }) => Promise<void>;
        children?: import('svelte').Snippet;
    }

    let { type, callback, children }: Props = $props();

    const configuration = clientController.serverConfig;
    let loading = $state(false),
        success: string | undefined = $derived(async function () {
        error = undefined;
        loading = true;
        function onError(err: unknown) {
            loading = false;
            error = takeError(err);
            console.error(error);
        }
        const data: FormInputs = { email, password };
        try {
            await callback(data);
            success = data.email;
        } catch (err) {
            onError(err);
        }
    }),
        error: string | undefined = $state();
    let email: string = $state(""),
        password = $state("");
    
</script>

{#if success}
    <div class="success">
        {#if configuration?.features.email}
            <div>
                <div class="title">{$_("login.check_mail")}</div>
                <div class="subtitle">{$_("login.email_delay")}</div>
            </div>
            <MailProvider email={success} />
        {:else if type == "login"}
            <div class="title">{$_("login.verified_account")}</div>
        {:else}
            <div class="title">{$_("login.successful_registration")}</div>
        {/if}
        <a href="/">{$_("login.remembered")}</a>
    </div>
{:else if loading}
    <Preloader type="spinner" />
{:else} 
    <div class="formModal">
        <div class="welcome">
            <div class="title">
                {$_(type == "create" ? "login.welcome2" : "login.welcome")}
            </div>
            <div class="subtitle">
                {$_(type == "create" ? "login.subtitle2" : "login.subtitle")}
                <div>(app.uprising.chat)</div>
            </div>
        </div>
        <form onsubmit={preventDefault(onSubmit)}>
            {#if type != "reset"}
                <FormField type="email" showOverline bind:value={email} />
            {/if}
            {#if type == "login" || type == "create" || type == "reset"}
                <FormField type="password" showOverline bind:value={password} />
            {/if}
            {#if error}
                <div>
                    {$_(`login.error.${type}`)}
                </div>
            {/if}
            <Button>
                {$_(
                    type == "create"
                        ? "login.register"
                        : type == "login"
                          ? "login.title"
                          : type === "reset"
                            ? "login.set_password"
                            : type === "resend"
                              ? "login.resend"
                              : "login.reset",
                )}
            </Button>
        </form>
        {#if children}{@render children()}{:else}
            <span class="create">
                <a href="/login">{$_("login.remembered")}</a>
            </span>
        {/if}
    </div>
{/if}
