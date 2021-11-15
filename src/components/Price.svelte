<script lang="ts">
	import { onMount } from 'svelte';
	import { sport, ball, cost } from '../stores';
	import axiosInstance from '../helper/axios';

	let res, total, prices, sportPrice, ballPrice;
	onMount(async () => {
		res = await (await axiosInstance.get('/public/static-values')).data;
		prices = await res['statics'].reduce((o, cur) => ({ ...o, [cur.name]: cur.value }), {});
	});
	$: if (prices) {
		sportPrice =
			$sport == 'فوتبال'
				? prices.football_price
				: $sport == 'والیبال'
				? prices.volleyball_price
				: prices.basketball_price;
		ballPrice = $ball == 'بله' ? prices.ball_price : 0;
		total = sportPrice + ballPrice;
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
