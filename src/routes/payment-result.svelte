<script>
	import axios from '../helper/axios';
	import CheckLogo from '../assets/img/check.svg';
	import CrossLogo from '../assets/img/cross.svg';
	import { onMount } from 'svelte';
	import { loading } from '../stores';

	let success, ref_id;
	if (window) {
		const params = window.location.search;
		const urlSearch = new URLSearchParams(params);
		const Authority = urlSearch.get('Authority');
		const prev = urlSearch.get('prev');

		onMount(async () => {
			$loading = true;
			const { data } = await axios.get('/reserve/payverify', { params: { Authority, prev } });
			if (data.success) {
				ref_id = data.ref_id;
				success = true;
			} else {
				success = false;
			}
			$loading = false;
		});
	}
</script>

<div class="container-r">
	<!-- <div> -->
	{#if success === true}
		<img src={CheckLogo} class="icon_reciept" />
		<p style="margin-top:1em;">سانس شما با موفقیت رزرو شد</p>
		<p>شماره پیگیری:{ref_id}</p>
	{:else}
		<img src={CrossLogo} class="icon_reciept" />
		<p style="margin-top:1em;">رزرو با مشکل مواجه شد، با پشتیبانی تماس بگیرید.</p>
	{/if}
	<a class="px-3 py-2 bg-green text-white rounded-lg mx-auto mt-2" href="/history">
		بازگشت به پنل
	</a>
	<!-- </div> -->
</div>

<style>
	.container-r {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		flex-direction: column;
	}
	.icon_reciept {
		height: 8em;
		width: auto;
	}
</style>
