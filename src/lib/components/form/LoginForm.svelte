<script lang="ts">
    import { takeError } from "$lib";
    import { clientController } from "$lib/controllers/ClientController";
    import { _ } from "svelte-i18n";
    import Preloader from "../indicators/Preloader.svelte";
    import FormField from "./FormField.svelte";
    import Button from "../atoms/Button.svelte";

    interface FormInputs {
        email: string;
        password: string;
    }

    export let page: "create" | "login" | "send_reset" | "reset" | "resend";
    export let callback: (fields: {
        email: string;
        password: string;
        captcha?: string;
    }) => Promise<void>;

    const configuration = clientController.serverConfig;
    let loading = false, success: string | undefined, error: string | undefined;
    let email: string = '', password = '';
    $: onSubmit = async function() {
        error = undefined;
        loading = true;
        function onError(err: unknown) {
            loading = false;
            error =  takeError(err);
            console.error(error);
        }
        const data: FormInputs = {email, password}
        try {
            await callback(data);
            success = data.email
        } catch (err) {
            onError(err)
        }
    }
</script>

{#if success}
    <div class="success">
        {#if configuration?.features.email}
            <div>
                <div class="title">{$_('login.check_mail')}</div>
                <div class="subtitle">{$_('login.email_delay')}</div>
            </div>
            <!--<MailProvider email={success} />-->
        {:else}
        <div class="title">{$_('login.successful_registration')}</div>
        {/if}
        <a href="/login">{$_('login.remembered')}</a>
    </div>
    {:else if loading}
        <Preloader type='spinner'/>
    {:else}
    <div class="formModal">
        <div class="welcome">
            <div class="title">
                {$_(page == 'create' ? 'login.welcome2' : 'login.welcome')}
            </div>
            <div class="subtitle">
                {$_(page == 'create' ? 'login.subtitle2' : 'login.subtitle')}
                <div>(app.uprising.chat)</div>
            </div>
        </div>
        <form on:submit|preventDefault={onSubmit}>
            {#if page != 'reset'}
                <FormField type='email' showOverline bind:value={email} />
            {/if}
            {#if page == 'login' || page == 'create' || page == 'reset'}
                <FormField type='password' showOverline bind:value={password} />
            {/if}
            {#if error}
                <div>
                    {$_(`login.error.${page}`)}
                </div>
            {/if}
            <Button>
                {$_(page == 'create'
                ? 'login.register'
                : page == 'login'
                ? 'login.title'
                : page === 'reset'
                ? 'login.set_password'
                : page === 'resend'
                ? 'login.resend'
                : 'login.reset')}
            </Button>
        </form>
        <slot>
            <span class="create">
                <a href="/login">{$_('login.remembered')}</a>
            </span>
        </slot>
    </div>
{/if}