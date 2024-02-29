<script>
export let data;

    /**
     * @type {any}
     */
let setting = data.setting;

    /**
     * @type {typeof import("$lib/components/settings/appearance.svelte").default}
     */
let component;

$: {
    switch (setting) {
        case 'valor1':
        case 'valor2':
            import('$lib/components/settings/appearance.svelte').then(module => {
                component = module.default;
            });
            break;
        default:
            import('$lib/components/settings/profile.svelte').then(module => {
                component = module.default;
            });
    }
}
</script>

<h1>{setting}</h1>


<svelte:component this={component} />