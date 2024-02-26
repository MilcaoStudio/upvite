import { goto } from "$app/navigation";
import { state } from "$lib/State";

export async function load() {
    goto(state.layout.getLastPath())
}