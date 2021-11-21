<script lang="ts">
	import Textfield from '@smui/textfield';
	import { onMount } from 'svelte';
	import { loading } from '../stores';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import axiosInstance from '../helper/axios';
	import numberTransformer from '../helper/numberTransformer';
	import {ToFormData} from '../helper/axios'
	interface Field {
		field_id?: string;
		field_name?: string;
		field_price?: number;
	}
	interface publicFields {
		data: Field[];
		success: boolean;
	}


	let field_name, field_price, ball_price: number;
	let fields: Field[] = [];
	let addSport = async () => {
		$loading = true;
		const resp = await axiosInstance.post(
			`/admin/fields/`,
			ToFormData({field_name, field_price})
		);
		fields = ((await axiosInstance.get('/public/fields')).data as publicFields).data;
		$loading = false;
	};
	const submitPrice = async (id?: string) => {
		$loading = true;
		const resp = await axiosInstance.patch(
			'/admin/fields',
			ToFormData(fields.filter((f: Field) => f.field_id === id)[0]));
		$loading = false;
	};
	const deleteSport = async (id?: string) => {
		$loading = true;
		const resp = await axiosInstance.delete(
			`/admin/fields/${fields.filter((f: Field) => f.field_id === id)[0].field_id}`,
		);
		fields = ((await axiosInstance.get('/public/fields')).data as publicFields).data;
		$loading = false;
	};
	const ballPrice = async() => {
		$loading = true;
		const resp = await axiosInstance.patch(
			'/admin/static_values',
			ToFormData({fields: JSON.stringify([{name: 'ball_price', value: ball_price}])}));
		$loading = false;
	}
	onMount(async () => {
		$loading = false;
		fields = ((await axiosInstance.get('/public/fields')).data as publicFields).data;
		console.log(fields);
	});
</script>

<div class="columns margins flex flex-col gap-2 items-center mt-5" style="direction:ltr">
	<DataTable table$aria-label="People list" style="max-width: 100%;">
		<Head>
			<Row>
				<Cell>ورزش</Cell>
				<Cell>قیمت جدید</Cell>
				<Cell>تائید</Cell>
				<Cell>حذف</Cell>
			</Row>
		</Head>
		<Body>
			{#each fields as field}
				<Row>
					<Cell>{field.field_name}</Cell>
					<Cell numeric>
						<input bind:value={field.field_price} type="number" />
					</Cell>
					<Cell>
						<button
							on:click={() => {
								submitPrice(field.field_id);
							}}>69</button
						></Cell
					>
					<Cell>
						<button
							on:click={() => {
								deleteSport(field.field_id);
							}}>X</button
						></Cell
					>
				</Row>
			{/each}
			<Row>
				<Cell><input bind:value={field_name} type="text" placeholder="نام ورزش" /></Cell>
				<Cell numeric>
					<input bind:value={field_price} type="number" />
				</Cell>
				<Cell>
					<button
						on:click={addSport}>ADD</button
					></Cell
				>
			</Row>
		</Body>
	</DataTable>
	<div class="flex gap-2 mt-10" style="direction:ltr">
		<input bind:value={ball_price} placeholder="قیمت توپ" />
		<button class="px-3 py-2 bg-green text-white rounded-lg mx-auto mt-5" on:click={ballPrice}
			>ثبت</button
		>
	</div>
</div>

