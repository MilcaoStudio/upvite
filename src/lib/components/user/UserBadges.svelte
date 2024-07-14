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
    <div class="UserBadges">
        <Row centred>
            {#if badges.has(RevoltBadges.Developer)}
                <Tooltip delay={300} alignment="center">
                    <img
                        alt={$t("app.navigation.tabs.dev")}
                        src="/badges/developer.svg"
                    />
                    <span slot="tooltip">{$t("app.navigation.tabs.dev")}</span
                    ></Tooltip
                >
            {/if}
            {#if badges.has(RevoltBadges.Supporter) || badges.has(RevoltBadges.ActiveSupporter)}
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
