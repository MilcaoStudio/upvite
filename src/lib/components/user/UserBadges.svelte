<script lang="ts">
    import { Tooltip } from "fluent-svelte";
    import Row from "../atoms/layout/Row.svelte";
    import type { User } from "revolt.js";
    import { RevoltBadges, UserBadges } from "revkit";
    import { t } from "svelte-i18n";
    import { DONATION } from "$lib/links";

    export let user: User;
    $: badges = new UserBadges(user.badges ?? 0);
</script>

<!-- if badges.bits != 0 -->
{#if badges.bits}
    <Row>
        {#if badges.has(RevoltBadges.Developer)}
            <Tooltip>
                <img alt={$t("app.navigation.tabs.dev")} src="/badges/developer.svg">
                <span slot="tooltip">{$t("app.navigation.tabs.dev")}</span></Tooltip>
        {/if}
        {#if badges.has(RevoltBadges.Supporter) || badges.has(RevoltBadges.ActiveSupporter)}
            <Tooltip placement="top">
                <a href={DONATION}>
                    <img alt={$t("app.special.popovers.user_profile.badges.supporter")} src="/badges/supporter.svg">
                </a>
                <span slot="tooltip">{$t("app.special.popovers.user_profile.badges.supporter")}</span>
            </Tooltip>
        {/if}
    </Row>
{/if}

<style>
    img {
        width: 24px;
        height: 24px;
    }
</style>