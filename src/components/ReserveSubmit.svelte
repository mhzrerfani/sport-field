<script lang="ts">
	// @ts-nocheck

	import { cost, ball, sport, timeslot, globalStore } from '../stores';
	import axiosInstance from '../helper/axios';
	import { onMount } from 'svelte';
	import Toastify from 'toastify-js';
	import 'toastify-js/src/toastify.css';
	import ToastifyConfig from '../helper/ToastifyConfig';
	import dayjs from 'dayjs';
	import { isAdmin, newReserve, loading  , adminPhoneSelected} from '../stores';

	let res, fields;
	let button;
	onMount(async () => {
		res = await (await axiosInstance.get('/public/fields')).data;
		fields = await res.data.reduce((o, cur) => ({ ...o, [cur.field_name]: cur.field_id }), {});
	});

	const payingPage = async () => {
		$loading = true;
		let reserve_date = $globalStore.date.calendar('gregory').format('YYYY-MM-DD'),
			amount = $cost,
			need_ball = $ball == 'بله' ? true : false,
			timeslot_id = $timeslot,
			field_id = fields[$sport],
			phone = $adminPhoneSelected;
		if (timeslot_id && field_id) {
			button.textContent = 'لطفا منتظر بمانید';
			const formData = new FormData();
			formData.append('reserve_date', reserve_date);
			formData.append('amount', amount);
			formData.append('need_ball', need_ball);
			formData.append('timeslot_id', timeslot_id);
			formData.append('field_id', field_id);
			if ($isAdmin) {
				formData.append('phone' , phone );
				const reserve = await await axiosInstance.post('/admin/reserve', formData);
				$loading = false;
				button.textContent = reserve.data.message;
				$timeslot = '';
				$globalStore.date = dayjs();
				$newReserve = true;
				setTimeout(() => {
					button.textContent = 'رزرو فوری';
				}, 2500);
			} else {
				const payRes = await await axiosInstance.post('/reserve/pay', formData);
				const { authority } = await payRes.data.data;
				location.href = `https://www.zarinpal.com/pg/StartPay/${authority})`;
			}
		} else {
			$loading = false;
			Toastify(ToastifyConfig('اطلاعات را کامل وارد کنید')).showToast();
		}
	};
</script>

<div class="flex justify-center my-10">
	<button
		class="px-3 py-2 bg-green text-white rounded-lg mx-auto mb-10"
		bind:this={button}
		on:click={payingPage}
	>
		{#if $isAdmin}
			رزرو فوری
		{:else}
			پرداخت
		{/if}
	</button>
</div>
