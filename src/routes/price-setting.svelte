<script>
	import DashboardHeader from '../components/DashboardHeader.svelte';
	import Username from '../components/Username.svelte';
	import { fade } from 'svelte/transition';
	import routeToPage from '../helper/routing';
	import { isAdmin, loading } from '../stores';
	import { get } from '../helper/token';
	import { onMount } from 'svelte';
	import NewPrices from '../components/NewPrices.svelte';

	const { user_is_admin } = get();

	$isAdmin = user_is_admin;
	onMount(() => {
		$loading = false;
	});
	if (localStorage.getItem('token') == null) {
		routeToPage('./signing', false);
	}
</script>

<div
	in:fade={{ duration: 400, delay: 400 }}
	out:fade={{ duration: 400 }}
	class="bg-white w-full h-screen"
>
	<DashboardHeader />
	<Username />
	<NewPrices />
</div>
