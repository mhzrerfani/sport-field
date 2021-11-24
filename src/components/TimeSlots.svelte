<script>
	import dayjs from 'dayjs';
	import { globalStore, timeslot, newReserve, loading } from '../stores';
	import axiosInstance from '../helper/axios';
	import { onMount } from 'svelte';
	import SegmentedButton, { Segment } from '@smui/segmented-button';
	import { Label } from '@smui/common';
	import Select, { Option } from '@smui/select';

	dayjs().format('YYYY-MM-DD');

	let reservation, value;

	let timeSlots = {
		0: '۸ - ۹:۳۰',
		1: '۹:۳۰ - ۱۱',
		2: '۱۱ - ۱۲:۳۰',
		3: '۱۲:۳۰ - ۱۴',
		4: '۱۴ - ۱۵:۳۰',
		5: '۱۵:۳۰ - ۱۷',
		6: '۱۷ - ۱۸:۳۰',
		7: '۱۸:۳۰ - ۲۰',
		8: '۲۰ - ۲۱:۳۰',
		9: '۲۱:۳۰ - ۲۳',
		10:'۲۳ - ۰۰:۳۰'
	};

	onMount(async () => {
		$loading = true;
		reservation = await (await axiosInstance.get('/reserve/reserves-status')).data;
		if (reservation)
			reserved = reservation[dayjs($globalStore.date).calendar('gregory').format('YYYY-MM-DD')];
		if (reserved) {
			reserved.forEach((slot) => {
				if (timeSlots[slot.reserve_timeslot]) {
					delete timeSlots[slot.reserve_timeslot];
				}
				choices = Object.values(timeSlots);
			});
		} else {
			timeSlots = {
				0: '۸ - ۹:۳۰',
				1: '۹:۳۰ - ۱۱',
				2: '۱۱ - ۱۲:۳۰',
				3: '۱۲:۳۰ - ۱۴',
				4: '۱۴ - ۱۵:۳۰',
				5: '۱۵:۳۰ - ۱۷',
				6: '۱۷ - ۱۸:۳۰',
				7: '۱۸:۳۰ - ۲۰',
				8: '۲۰ - ۲۱:۳۰',
				9: '۲۱:۳۰ - ۲۳',
				10:'۲۳ - ۰۰:۳۰'
			};
			choices = Object.values(timeSlots);
		}
		$loading = false;
	});
	newReserve.subscribe(async () => {
		reservation = await (await axiosInstance.get('/reserve/reserves-status')).data;
		if (reservation)
			reserved = reservation[dayjs($globalStore.date).calendar('gregory').format('YYYY-MM-DD')];
		if (reserved) {
			reserved.forEach((slot) => {
				if (timeSlots[slot.reserve_timeslot]) {
					delete timeSlots[slot.reserve_timeslot];
				}
				choices = Object.values(timeSlots);
			});
		} else {
			timeSlots = {
				0: '۸ - ۹:۳۰',
				1: '۹:۳۰ - ۱۱',
				2: '۱۱ - ۱۲:۳۰',
				3: '۱۲:۳۰ - ۱۴',
				4: '۱۴ - ۱۵:۳۰',
				5: '۱۵:۳۰ - ۱۷',
				6: '۱۷ - ۱۸:۳۰',
				7: '۱۸:۳۰ - ۲۰',
				8: '۲۰ - ۲۱:۳۰',
				9: '۲۱:۳۰ - ۲۳',
				10:'۲۳ - ۰۰:۳۰'
			};
			choices = Object.values(timeSlots);
		}
		$newReserve = false;
	});

	let choices = [];
	let selected;
	$: selected = value;
	$: $timeslot = Object.keys(timeSlots).find((key) => timeSlots[key] === selected);
	$: console.log($timeslot);
	$: globalStore.subscribe(() => {
		selected = '';
		$timeslot = '';
	});
	let reserved;
	$: if (reservation)
		reserved = reservation[dayjs($globalStore.date).calendar('gregory').format('YYYY-MM-DD')];
	$: if (dayjs($globalStore.date).isBefore(dayjs(), 'day')) {
		choices = [];
	} else {
		choices = Object.values(timeSlots);
	}
	$: if (reserved) {
		reserved.forEach((slot) => {
			if (timeSlots[slot.reserve_timeslot]) {
				delete timeSlots[slot.reserve_timeslot];
			}
		});
	} else {
		timeSlots = {
			0: '۸ - ۹:۳۰',
			1: '۹:۳۰ - ۱۱',
			2: '۱۱ - ۱۲:۳۰',
			3: '۱۲:۳۰ - ۱۴',
			4: '۱۴ - ۱۵:۳۰',
			5: '۱۵:۳۰ - ۱۷',
			6: '۱۷ - ۱۸:۳۰',
			7: '۱۸:۳۰ - ۲۰',
			8: '۲۰ - ۲۱:۳۰',
			9: '۲۱:۳۰ - ۲۳',
			10:'۲۳ - ۰۰:۳۰'
		};
	}
</script>

<div class="flex flex-col items-center mt-20 justify-center gap-5">
	<span>سانس خود را انتخاب کنید</span>
	<div class="mobile flex lg:hidden  justify-center">
		<Select bind:value={selected} label="" style="direction:ltr">
			{#each choices as choice}
				<Option value={choice}>{choice}</Option>
			{/each}
		</Select>
	</div>
	<div class="desktop hidden lg:flex  justify-center">
		<SegmentedButton
			style="direction: ltr"
			segments={choices}
			let:segment
			singleSelect
			bind:selected
		>
			<Segment {segment}>
				<Label>{segment}</Label>
			</Segment>
		</SegmentedButton>
	</div>
</div>
