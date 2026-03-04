<script>
   /** @type {{children?: import('svelte').Snippet}} */
   let { children } = $props();
</script>


<h4>{@render children?.()}</h4>

<style>
   h4{
    color: var(--tertiary-foreground);
    font-weight: 600;
    margin: 0px;
    padding: 12px 4px 6px 4px;
   }
</style>