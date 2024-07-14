<script lang="ts">
    import { t } from "svelte-i18n";
    import Button from "../atoms/Button.svelte";
    import TextSvelte from "$lib/i18n/TextSvelte.svelte";

    export let email: string;
    $: providerData = mapMailProvider(email);
    let [name, url] = providerData ?? [null, null];
    function mapMailProvider(email: string): [string, string] | null {
        if (typeof email != "string") {
            return null;
        }
        const match = /@(.+)/.exec(email);
        if (match == null) {
            return null;
        }

        const domain = match[1];
        switch (domain) {
            case "gmail.com":
            case "googlemail.com":
                return ["Gmail", "https://mail.google.com"];
            case "tuta.io":
                return ["Tutanota", "https://mail.tutanota.com"];
            case "outlook.com":
            case "hotmail.com":
            case "outlook.jp":
            case "outlook.fr":
            case "outlook.dk":
            case "outlook.com.ar":
            case "outlook.com.au":
            case "outlook.at":
            case "outlook.be":
            case "outlook.com.br":
            case "outlook.cl":
            case "outlook.cz":
            case "outlook.com.gr":
            case "outlook.co.il":
            case "outlook.in":
            case "outlook.co.id":
            case "outlook.ie":
            case "outlook.it":
            case "outlook.hu":
            case "outlook.kr":
            case "outlook.lv":
            case "outlook.my":
            case "outlook.co.nz":
            case "outlook.com.pe":
            case "outlook.ph":
            case "outlook.pt":
            case "outlook.sa":
            case "outlook.sg":
            case "outlook.sk":
            case "outlook.es":
            case "outlook.co.th":
            case "outlook.com.tr":
            case "outlook.com.vn":
                return ["Outlook", "https://outlook.live.com"];
            case "yahoo.com":
                return ["Yahoo", "https://mail.yahoo.com"];
            case "wp.pl":
                return ["WP Poczta", "https://poczta.wp.pl"];
            case "protonmail.com":
            case "protonmail.ch":
            case "pm.me":
                return ["ProtonMail", "https://mail.protonmail.com"];
            case "seznam.cz":
            case "email.cz":
            case "post.cz":
                return ["Seznam", "https://email.seznam.cz"];
            case "zoho.com":
                return ["Zoho Mail", "https://mail.zoho.com/zm/"];
            case "aol.com":
            case "aim.com":
                return ["AOL Mail", "https://mail.aol.com/"];
            case "icloud.com":
                return ["iCloud Mail", "https://mail.icloud.com/"];
            case "mail.com":
            case "email.com":
                return ["mail.com", "https://www.mail.com/mail/"];
            case "yandex.ru":
            case "yandex.by":
            case "yandex.ua":
            case "yandex.com":
                return ["Yandex Mail", "https://mail.yandex.com/"];
            case "hey.com":
                return ["HEY", "https://app.hey.com/"];
            case "mail.ru":
            case "bk.ru":
            case "inbox.ru":
            case "list.ru":
            case "internet.ru":
                return ["Mail.ru", "https://mail.ru/"];
            case "rambler.ru":
            case "lenta.ru":
            case "autorambler.ru":
            case "myrambler.ru":
            case "ro.ru":
            case "rambler.ua":
                return ["Rambler", "https://rambler.ru/"];
            default:
                return [domain, `https://${domain}`];
        }
    }
</script>

{#if name && url}
    <div class="MailProvider">
        <a href={url} target="_blank" rel="noreferrer">
            <Button>
                <TextSvelte id="login.open_mail_provider" fields={{provider: name}} />
            </Button>
        </a>
    </div>
{/if}
