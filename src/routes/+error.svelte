<script>
	import { page } from '$app/stores';
</script>


<div class="error-container">
	<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mood-puzzled" width="64" height="64" viewBox="0 0 24 24" stroke-width="1.5" stroke="#8097de" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
		<path d="M14.986 3.51a9 9 0 1 0 1.514 16.284c2.489 -1.437 4.181 -3.978 4.5 -6.794" />
		<path d="M10 10h.01" />
		<path d="M14 8h.01" />
		<path d="M12 15c1 -1.333 2 -2 3 -2" />
		<path d="M20 9v.01" />
		<path d="M20 6a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
	  </svg>
	<h1>{$page.status}: {$page.error?.message}</h1>
	<a class="hover" href="/">
		<h2>Home</h2>
	</a>
</div>

<style>
	.error-container{
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100%;
		align-items: center;
		justify-content: center;
	}
	.hover{
		transition: all 0.1s ease;
	}
	.hover:hover{
		color:#476fe9;
	}
	.hover:active{
		color:var(--secondary-foreground);
	}
</style>