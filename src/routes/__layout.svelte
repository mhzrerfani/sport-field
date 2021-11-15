<script>
	import '../app.css';
	import { loading } from '../stores';
	import Loading from '../components/Loading.svelte';
</script>

{#if $loading}
	<Loading />
{/if}
<slot />
