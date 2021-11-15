<script>
	import Select from 'svelte-select';
	import dayjs from 'dayjs';
	import { globalStore, timeslot, newReserve } from '../stores';
	import axiosInstance from '../helper/axios';
	import { onMount } from 'svelte';

	dayjs().format('YYYY-MM-DD');

	let reservation, selectValue, newDate;

	onMount(async () => {
		reservation = await (await axiosInstance.get('/reserve/reserves-status')).data;
	});
	newReserve.subscribe(async () => {
		reservation = await (await axiosInstance.get('/reserve/reserves-status')).data;
		$newReserve = false;
	});
	let items = [
		{ value: '0', label: '۸ - ۹:۳۰', selectable: true },
		{ value: '1', label: '۹:۳۰ - ۱۱', selectable: true },
		{ value: '2', label: '۱۱ - ۱۲:۳۰', selectable: true },
		{ value: '3', label: '۱۲:۳۰ - ۱۴', selectable: true },
		{ value: '4', label: '۱۴ - ۱۵:۳۰', selectable: true },
		{ value: '5', label: '۱۵:۳۰ - ۱۷', selectable: true },
		{ value: '6', label: '۱۷ - ۱۸:۳۰', selectable: true },
		{ value: '7', label: '۱۸:۳۰ - ۲۰', selectable: true },
		{ value: '8', label: '۲۰ - ۲۱:۳۰', selectable: true },
		{ value: '9', label: '۲۱:۳۰ - ۲۳', selectable: true }
	];

	function handleSelect(event) {
		$timeslot = event.detail.value;
	}
	$: globalStore.subscribe(() => {
		selectValue = '';
		$timeslot = '';
	});

	let reserved;
	$: if (reservation)
		reserved = reservation[dayjs($globalStore.date).calendar('gregory').format('YYYY-MM-DD')];
	$: if (dayjs($globalStore.date).isBefore(dayjs(), 'day')) {
		items = items.map((slot) => {
			slot.selectable = false;
			return slot;
		});
	} else {
		items = items.map((slot) => {
			slot.selectable = true;
			return slot;
		});
	}
	$: if (reserved) {
		reserved.forEach((slot) => {
			items[slot.reserve_timeslot].selectable = false;
		});
	}
</script>

<div class="flex flex-col items-center mt-20 justify-center gap-5">
	<span>سانس خود را انتخاب کنید</span>
	<div class="themed">
		<Select
			placeholder="سانس ها"
			isClearable={false}
			id="timeslots"
			{items}
			bind:value={selectValue}
			on:select={handleSelect}
		/>
	</div>
</div>

<style>
	.themed {
		--border: 3px solid #df6531;
		--borderRadius: 10px;
		--placeholderColor: black;
		width: 250px;
	}
</style>
