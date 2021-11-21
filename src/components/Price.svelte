<script lang="ts">
	import { onMount } from 'svelte';
	import { sport, ball, cost } from '../stores';
	import axiosInstance from '../helper/axios';

	let res, total, prices, sportPrice, ballPrice;
	onMount(async () => {
		res = await (await axiosInstance.get('/public/fields')).data.data;
		prices = await res.reduce((o, cur) => ({ ...o, [cur.field_name]: cur.field_price }), {});
		prices.ball_price = (await axiosInstance.get('/public/static-values')).data.statics.filter(item => item.name === 'ball_price')[0].value;
	});
	$: if (prices) {
		sportPrice = prices[$sport];
		ballPrice = $ball == 'بله' ? prices.ball_price : 0;
		total = Number(sportPrice) + Number(ballPrice);
	}
	$: $cost = total;
</script>

<div class="flex justify-center gap-5 mt-20">
	<div>مبلغ قابل پرداخت:</div>
	<div>
		{#if total}
			{total} ریال
		{:else}
			لطفا منتظر بمانید
		{/if}
	</div>
</div>
