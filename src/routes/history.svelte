<script>
	import DashboardHeader from '../components/DashboardHeader.svelte';
	import Username from '../components/Username.svelte';
	import HistoryTable from '../components/HistoryTable.svelte';
	import { fade } from 'svelte/transition';
	import routeToPage from '../helper/routing';
	import { isAdmin, loading } from '../stores';
	import { get } from '../helper/token';
	import { onMount } from 'svelte';

	const { user_is_admin } = get();

	$isAdmin = user_is_admin;

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
	<HistoryTable />
</div>
