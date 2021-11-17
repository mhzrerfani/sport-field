<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	import DashboardHeader from '../components/DashboardHeader.svelte';
	import Username from '../components/Username.svelte';
	import HistoryTable from '../components/HistoryTable.svelte';
	import { get as getToken } from '../helper/token';
	import routeToPage from '../helper/routing';
	import { isAdmin, loading } from '../stores';
	import { getLocalStorage } from '../utils/window';

	onMount(() => {
		const { user_is_admin } = getToken();
		$isAdmin = user_is_admin;

		if (getLocalStorage().getItem('token') == null) {
			routeToPage('./signing', false);
		}
	});
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
