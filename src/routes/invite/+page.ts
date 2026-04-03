import { goto } from "$app/navigation";
import { useState } from "$lib/components/state/StateContext.svelte";

export async function load() {
    try {
        goto(useState().layout.getLastPath())
    } catch (error) {
        console.error(error);
        goto("/404");
    }
}