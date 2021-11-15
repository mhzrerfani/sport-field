<script lang="ts">
	import DataTable, { Head, Body, Row, Cell, Pagination } from '@smui/data-table';
	import IconButton from '@smui/icon-button';
	import axiosInstance from '../helper/axios';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import jalaliday from 'jalaliday';
	import { isAdmin, newReserve, loading } from '../stores';
	import { get } from '../helper/token';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';

	const { user_is_admin } = get();
	$isAdmin = user_is_admin;
	const endpoint = $isAdmin ? '/admin/reserves-history' : '/reserve/history';

	dayjs.extend(jalaliday);
	dayjs.locale('fa');
	dayjs.calendar('jalali');

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
		9: '۲۱:۳۰ - ۲۳'
	};

	let items = [];
	let rowsPerPage = 10;
	let currentPage = 0;
	let from = '',
		to = '',
		name = '',
		status = '',
		phone = '';
	let listFilter = async () => {
		// $loading = true;
		const fromQuery = `from=${dayjs(from, { jalali: true }, [
			'YYYY-MM-DD',
			'YYYY-M-DD',
			'YYYY-MM-D',
			'YYYY-M-D'
		])
			.calendar('gregory')
			.format('YYYY-MM-DD')}`;
		const toQuery = `to=${dayjs(to, { jalali: true }, [
			'YYYY-MM-DD',
			'YYYY-M-DD',
			'YYYY-MM-D',
			'YYYY-M-D'
		])
			.calendar('gregory')
			.format('YYYY-MM-DD')}`;

		const phoneQuery = `phone=${phone}`;
		const statusQuery = `status=${status}`;
		const query = 
		const updatedList = await axiosInstance.get(`/admin/cancel-reserve?${fromQuery}`);
		items = await updatedList.data;
		$loading = false;
	};
	let removeReservation = async (e) => {
		$loading = true;
		const formData = new FormData();
		formData.append('reserve_id', e.target.id);
		const res = await axiosInstance.delete('/admin/cancel-reserve', { data: formData });
		const updatedList = await (await axiosInstance.get(endpoint)).data;
		items = await updatedList.data;
		$loading = false;
	};

	onMount(async () => {
		$loading = true;
		const res = await (await axiosInstance.get(endpoint)).data;
		items = await res.data;
		$loading = false;
	});

	$: start = currentPage * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, items.length);
	$: slice = items.slice(start, end);
	$: lastPage = Math.max(Math.ceil(items.length / rowsPerPage) - 1, 0);

	$: if (currentPage > lastPage) {
		currentPage = lastPage;
	}
</script>

{#if $isAdmin}
	<div
		class="columns margins flex gap-2 justify-center mt-5"
		style="direction: ltr;width: 663px; margin: 0 auto"
	>
		<div class="w-40">
			<Textfield class="shaped-filled" variant="filled" bind:value={phone} label="شماره تلفن" />
		</div>

		<div class="w-36">
			<Textfield class="shaped-filled" variant="filled" bind:value={from} label="از">
				<Icon class="material-icons" slot="leadingIcon">event</Icon>
			</Textfield>
		</div>
		<div class="w-36">
			<Textfield class="shaped-filled" variant="filled" bind:value={to} label="تا">
				<Icon class="material-icons" slot="leadingIcon">event</Icon>
			</Textfield>
		</div>
		<div class="w-28">
			<Textfield class="shaped-filled" variant="filled" bind:value={status} label="وضعیت" />
		</div>
		<button class="bg-orange rounded-t-xl text-white px-3" on:click={listFilter}>جستجو</button>
	</div>
{/if}
<div class="flex justify-center">
	<DataTable
		table$aria-label="Todo list"
		style="width: 663px; direction: ltr; border-top-left-radius: 0; border-top-right-radius: 0;border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;"
	>
		<Head style="direction: rtl;">
			<Row>
				{#if $isAdmin}
					<Cell style="text-align: center;" numeric>شماره تلفن</Cell>
					<Cell style="text-align: center; width: 50px">نام خانوادگی</Cell>
				{/if}
				<Cell style="text-align: center;" numeric>تاریخ</Cell>
				<Cell style="text-align: center;">سانس</Cell>
				<Cell style="text-align: center;">سالن (توپ)</Cell>
				<Cell style="text-align: center;">وضعیت</Cell>
				{#if $isAdmin}
					<Cell style="text-align: center;">کنسل</Cell>
				{/if}
			</Row>
		</Head>
		<Body style="direction: ltr">
			{#each [...slice].reverse() as item (item.reserve_id)}
				<Row>
					{#if $isAdmin}
						<Cell style="text-align: center;" numeric>{item.User['user_phone']}</Cell>
						<Cell style="text-align: center;max-width: 50px" numeric>{item.User['user_name']}</Cell>
					{/if}
					<Cell style="text-align: center;" numeric
						>{dayjs(item.reserve_date).format('YYYY-MM-DD')}</Cell
					>
					<Cell style="text-align: center;">{timeSlots[`${item.reserve_timeslot}`]}</Cell>
					<Cell style="text-align: center;"
						>({item.need_ball ? 'بله' : 'خیر'}) {item.Field['field_name']}</Cell
					>
					<Cell style="text-align: center;"
						>{item.reserve_status == 'completed' ? 'کامل' : 'موقت'}</Cell
					>
					{#if $isAdmin}
						<Cell style="text-align: center; cursor: pointer;">
							<img
								style="cursor: pointer;"
								src="https://img.icons8.com/color/48/000000/delete-sign--v1.png"
								alt="delete"
								id={item.reserve_id}
								on:click={removeReservation}
							/>
						</Cell>
					{/if}
				</Row>
			{/each}
		</Body>

		<Pagination slot="paginate" style="display: flex; justify-content: center;">
			<svelte:fragment slot="total">
				{start + 1}-{end} of {items.length}
			</svelte:fragment>

			<IconButton
				class="material-icons"
				action="first-page"
				title="First page"
				on:click={() => (currentPage = 0)}
				disabled={currentPage === 0}>first_page</IconButton
			>
			<IconButton
				class="material-icons"
				action="prev-page"
				title="Prev page"
				on:click={() => currentPage--}
				disabled={currentPage === 0}>chevron_left</IconButton
			>
			<IconButton
				class="material-icons"
				action="next-page"
				title="Next page"
				on:click={() => currentPage++}
				disabled={currentPage === lastPage}>chevron_right</IconButton
			>
			<IconButton
				class="material-icons"
				action="last-page"
				title="Last page"
				on:click={() => (currentPage = lastPage)}
				disabled={currentPage === lastPage}>last_page</IconButton
			>
		</Pagination>
	</DataTable>
</div>

<style>
	* :global(.shaped-filled) {
		border-radius: 16px 16px 0 0;
	}
</style>
