<script lang="ts">
	import Textfield from '@smui/textfield';
	import { onMount } from 'svelte';
	import { loading } from '../stores';
	import { sport, ball, cost } from '../stores';
	import axiosInstance from '../helper/axios';
	import numberTransformer from '../helper/numberTransformer';

	let prices,
		football_price = '',
		volleyball_price = '',
		basketball_price = '',
		ball_price = '';
	let submitPrices = () => {
		const formData = new FormData();
		formData.append('football_price', football_price);
		formData.append('volleyball_price', volleyball_price);
		formData.append('basketball_price', basketball_price);
		formData.append('ball_price', ball_price);
		const req = axiosInstance.post('/admin/static_values', formData);
	};
	onMount(async () => {
		$loading = false;
	});
</script>

<div class="columns margins flex flex-col gap-2 items-center mt-5" style="direction:ltr">
	<div>قیمت ها را به ریال وارد کنید</div>
	<div>
		<Textfield bind:value={football_price} label="فوتبال" />
	</div>
	<div>
		<Textfield bind:value={volleyball_price} label="والیبال" />
	</div>
	<div>
		<Textfield bind:value={basketball_price} label="بسکتبال" />
	</div>
	<div>
		<Textfield bind:value={ball_price} label="توپ" />
	</div>
	<button class="px-3 py-2 bg-green text-white rounded-lg mx-auto mt-5" on:click={submitPrices}
		>ثبت قیمت ها</button
	>
</div>
