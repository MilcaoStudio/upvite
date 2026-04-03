<script lang="ts">
    import { takeError } from "$lib";
    import { _, locale } from "svelte-i18n";
    import Preloader from "../indicators/Preloader.svelte";
    import FormField from "./FormField.svelte";
    import Button from "../atoms/Button.svelte";
    import MailProvider from "./MailProvider.svelte";
    import { useClient } from "../client/ClientContext.svelte";
    import { HOSTNAME } from "$lib/links";

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
    let email = $state<string>();
    let success = $state<string>();
    let password = $state<string>();
    let error = $state<string>();
    let loading = $state(false);

    const configuration = useClient().configuration;
    function onsubmit(ev: Event) {
        ev.preventDefault();
        
        if (email && password) {
            error = undefined;
            loading = true;
            callback({email, password}).then(()=>{
                success = email;
            }).catch(onError).finally(()=>{
                loading = false;
            });
        }
    }

    function onError(err: unknown) {
        error = takeError(err);
        console.error(error);
    }
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
                <div>({HOSTNAME})</div>
            </div>
        </div>
        <form onsubmit={onsubmit}>
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
