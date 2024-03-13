<script lang="ts">
    import UserIcon from "../user/UserIcon.svelte";
    import IconButton from "../atoms/input/IconButton.svelte";

    import { goto } from "$app/navigation";
    import Modal from "./Modal.svelte";
    import type { ModalProps } from "$lib/types/Modal";
    import { useClient, useSession } from "$lib/controllers/ClientController";
    import { API, UserPermission } from "revolt.js";
    import UserHeader from "../user/UserHeader.svelte";
    export let props: ModalProps<"user_profile">;
    const session = useSession()!;
    const client = session.client!;
    const user = client.users.get(props.user_id);
    
</script>

<Modal {...props}>
    <div class="container" slot="override">
        <div class="userProfile">
            <UserHeader {user} placeholderProfile={props.placeholderProfile} />
            <div class="userContent">
                <div class="">
                    <div class="category"></div>
                    <div class="content"></div>
                </div>
            </div>
        </div>
    </div>
</Modal>

<style>
    .container {
        -webkit-animation:
            svelte-1qibxfp-menu-open var(--fds-control-normal-duration)
                var(--fds-control-fast-out-slow-in-easing),
            svelte-1qibxfp-menu-shadow var(--fds-control-fast-duration)
                var(--fds-control-fast-out-slow-in-easing)
                var(--fds-control-normal-duration) forwards;
        animation:
            svelte-1qibxfp-menu-open var(--fds-control-normal-duration)
                var(--fds-control-fast-out-slow-in-easing),
            svelte-1qibxfp-menu-shadow var(--fds-control-fast-duration)
                var(--fds-control-fast-out-slow-in-easing)
                var(--fds-control-normal-duration) forwards;
        backdrop-filter: blur(2px);
        background: rgba(0, 0, 0, 0.5);
        min-height: 200px;
        max-width: min(100% - 50px, 560px);
        max-height: min(-20px + 100vh, 650px);
        margin: 20px;
        position: relative;
        display: flex;
        flex-direction: column;
        border-radius: var(--border-radius-inner);
        width: 100%;
        background-color: var(--tertiary-background);
        -webkit-backdrop-filter: blur(8px) !important;
        backdrop-filter: blur(8px) !important;
        z-index: 20 !important;
        background-color: rgba(
            var(--tertiary-background-rgb),
            max(0, 0.7)
        ) !important;
    }
</style>
