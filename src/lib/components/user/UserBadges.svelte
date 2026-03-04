<script lang="ts">
    import { Tooltip } from "fluent-svelte";
    import Row from "../atoms/layout/Row.svelte";
    import { User, UserBadges } from "stoat.js";
    import { t } from "svelte-i18n";
    import { DONATION } from "$lib/links";

    export let user: User;
    $: badges = user.badges;
</script>

<!-- if badges.bits != 0 -->
{#if badges}
    <div class="UserBadges">
        <Row centred>
            {#if badges & UserBadges.Developer}
                <Tooltip delay={300} alignment="center">
                    <img
                        alt={$t("app.navigation.tabs.dev")}
                        src="/badges/developer.svg"
                    />
                    <span slot="tooltip">{$t("app.navigation.tabs.dev")}</span
                    ></Tooltip
                >
            {/if}
            {#if badges & (UserBadges.Supporter | UserBadges.ActiveSupporter)}
                <Tooltip delay={300} alignment="center">
                    <a href={DONATION}>
                        <img
                            alt={$t(
                                "app.special.popovers.user_profile.badges.supporter",
                            )}
                            src="/badges/supporter.svg"
                        />
                    </a>
                    <span slot="tooltip"
                        >{$t(
                            "app.special.popovers.user_profile.badges.supporter",
                        )}</span
                    >
                </Tooltip>
            {/if}
        </Row>
    </div>
{/if}

<style>
    .UserBadges {
        padding: 1rem 1rem 0;
    }

    img {
        width: 32px;
        height: 32px;
    }
</style>
