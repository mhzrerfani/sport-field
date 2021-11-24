<script lang="ts">
	import DataTable, { Head, Body, Row, Cell, Pagination } from '@smui/data-table';
	import IconButton from '@smui/icon-button';
	import axiosInstance from '../helper/axios';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import jalaliday from 'jalaliday';
	import { isAdmin, newReserve, loading, from, to } from '../stores';
	import { get } from '../helper/token';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import PopupCalendar from '../components/PopupCalender.svelte';
	import Select, { Option } from '@smui/select';
	import Icon from '@smui/select/icon';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import XLSX from 'xlsx';

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

	let items = [],
		selectedReservation,
		open = false,
		rowsPerPage = 10,
		currentPage = 0,
		from = '',
		to = '',
		phone = '',
		status = '',
		statusOptions = ['کامل', 'موقت'],
		table;
	let listFilter = async () => {
		$loading = true;
		let params = {
			from: from
				? dayjs(from, { jalali: true }, ['YYYY-MM-DD', 'YYYY-M-DD', 'YYYY-MM-D', 'YYYY-M-D'])
						.calendar('gregory')
						.format('YYYY-MM-DD')
				: undefined,
			to: to
				? dayjs(to, { jalali: true }, ['YYYY-MM-DD', 'YYYY-M-DD', 'YYYY-MM-D', 'YYYY-M-D'])
						.calendar('gregory')
						.format('YYYY-MM-DD')
				: undefined,
			phone,
			status: status == 'کامل' ? 'completed' : status == 'موقت' ? 'temp' : ''
		};
		for (let param in params) {
			if (!params[param]) delete params[param];
		}
		const { data: updatedList } = await axiosInstance.get('/admin/reserves-history', { params });
		items = updatedList.data;
		$loading = false;
	};
	let removeSelected = (e) => {
		open = true;
		selectedReservation = e.target.nextElementSibling.id;
		console.log(selectedReservation);
	};
	let removeConfirmed = async () => {
		$loading = true;
		const formData = new FormData();
		formData.append('reserve_id', selectedReservation);
		const res = await axiosInstance.delete('/admin/cancel-reserve', { data: formData });
		const updatedList = await (await axiosInstance.get(endpoint)).data;
		items = await updatedList.data;
		open = false;
		$loading = false;
	};

	let downloadExcel = () => {
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		return XLSX.writeFile(wb, `history(${dayjs().calendar('jalali').format('YYYY-MM-DD')}).xlsx`);
	};
	onMount(async () => {
		$loading = true;
		const res = await (await axiosInstance.get(endpoint)).data;
		items = await res.data;
		table = table.$$.ctx[9].firstChild;
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
		class="columns margins flex md:flex-col lg:flex-row gap-2 justify-center mt-5"
		style="direction: rtl;width: 663px; margin: 0 auto"
	>
		<div class="w-40">
			<Textfield bind:value={phone} label="شماره تلفن" />
		</div>

		<PopupCalendar bind:value={from} title="از" />
		<PopupCalendar bind:value={to} title="تا" />

		<Select class="w-28" bind:value={status} label="وضعیت">
			<Option value="" />
			{#each statusOptions as option}
				<Option value={option}>{option}</Option>
			{/each}
		</Select>
		<div
			class=" cursor-pointer"
			on:click={() => {
				from = '';
				to = '';
				status = '';
				phone = '';
			}}
		>
			<Icon class="material-icons" slot="trailingIcon">delete</Icon>
		</div>
		<button class="bg-orange rounded-xl text-white px-3" on:click={listFilter}>جستجو</button>
	</div>
{/if}
<div class="flex flex-col items-center justify-center mt-5">
	<DataTable
		bind:this={table}
		table$aria-label="Todo list"
		style="width: 750px; direction: ltr; border-top-left-radius: 0; border-top-right-radius: 0;border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;"
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
						>({item.need_ball ? 'بله' : 'خیر'}) {item.Field?.field_name || 'نامشخص'}</Cell
					>
					<Cell style="text-align: center;"
						>{item.reserve_status == 'completed' ? 'کامل' : 'موقت'}</Cell
					>
					{#if $isAdmin}
						<Cell style="text-align: center; cursor: pointer;">
							<Button on:click={removeSelected}>
								<img
									class="w-8 h-8"
									style="cursor: pointer;"
									id={item.reserve_id}
									src="https://img.icons8.com/color/48/000000/delete-sign--v1.png"
									alt="delete"
								/>
							</Button>
							<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
								<Title id="simple-title">پاک کردن رزرو</Title>
								<Content id="simple-content">آیا مطمئن هستید؟</Content>
								<Actions>
									<Button on:click={() => (open = false)}>
										<Label>خیر</Label>
									</Button>
									<Button on:click={removeConfirmed}>
										<Label>بله</Label>
									</Button>
								</Actions>
							</Dialog>
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
	{#if $isAdmin}
		<button class="px-3 py-2 text-white bg-green rounded-md mt-5" on:click={downloadExcel}
			>خروجی اکسل</button
		>
	{/if}
</div>

<style>
	* :global(.shaped-filled) {
		border-radius: 16px 16px 0 0;
	}
</style>
