<script>
	import DashboardHeader from '../components/DashboardHeader.svelte';
	import Username from '../components/Username.svelte';
	import Calendar from '../components/Calendar.svelte';
	import TimeSlots from '../components/TimeSlots.svelte';
	import Sports from '../components/Sports.svelte';
	import Ball from '../components/Ball.svelte';
	import Price from '../components/Price.svelte';
	import ReserveSubmit from '../components/ReserveSubmit.svelte';
	import routeToPage from '../helper/routing';
	import { fade } from 'svelte/transition';
	import { get } from '../helper/token';
	import { isAdmin, loading } from '../stores';
	import { onMount } from 'svelte';
	import { getLocalStorage } from '../utils/window';

	onMount(() => {
		$loading = false;
	});

	const { user_is_admin } = get();

	$isAdmin = user_is_admin;

	if (getLocalStorage().getItem('token') == null) {
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
	<div class=" p-10 mx-auto" style="width: 100%; background-color:#fcf7f3; margin-top:2em;" >
		<Calendar />
		<TimeSlots />
	</div>
	<Sports />
	<Ball />
	<Price />
	<ReserveSubmit />
</div>
