<script lang="ts">
	import Textfield from '@smui/textfield';
	import { onMount } from 'svelte';
	import { loading } from '../stores';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import axiosInstance from '../helper/axios';
	import numberTransformer from '../helper/numberTransformer';
	import { ToFormData } from '../helper/axios';
	import Toastify from 'toastify-js';
	import 'toastify-js/src/toastify.css';
	import ToastifyConfig from '../helper/ToastifyConfig';
	interface Field {
		field_id?: string;
		field_name?: string;
		field_price?: number;
	}
	interface publicFields {
		data: Field[];
		success: boolean;
	}
	interface contactinfo {
		address?: string;
		tel?: number;
	}
	let contactInfo = {
		address: '',
		tel: 0
	} as contactinfo;

	let field_name, field_price, ball_price: number;
	let fields: Field[] = [];
	let addSport = async () => {
		$loading = true;
		const resp = await axiosInstance.post(
			`/admin/fields/`,
			ToFormData({ field_name, field_price })
		);
		fields = ((await axiosInstance.get('/public/fields')).data as publicFields).data;
		field_name = '';
		field_price = '';
		$loading = false;
	};
	const submitPrice = async (id?: string) => {
		$loading = true;
		const resp = await axiosInstance.patch(
			'/admin/fields',
			ToFormData(fields.filter((f: Field) => f.field_id === id)[0])
		);
		$loading = false;
	};
	const deleteSport = async (id?: string) => {
		$loading = true;
		const resp = await axiosInstance.delete(
			`/admin/fields/${fields.filter((f: Field) => f.field_id === id)[0].field_id}`
		);
		fields = ((await axiosInstance.get('/public/fields')).data as publicFields).data;
		$loading = false;
	};
	const ballPrice = async () => {
		$loading = true;
		if (ball_price) {
			const resp = await axiosInstance.patch(
				'/admin/static_values',
				ToFormData({ fields: JSON.stringify([{ name: 'ball_price', value: ball_price }]) })
			);
		} else {
			Toastify(ToastifyConfig('قیمت توپ را وارد کنید')).showToast();
		}

		$loading = false;
	};
	const newContactInfoHandler = async () => {
		$loading = true;
		if (contactInfo.address && contactInfo.address) {
			const resp = await axiosInstance.patch('/admin/contact-info', ToFormData(contactInfo));
		} else {
			Toastify(ToastifyConfig('اطلاعات را کامل وارد کنید')).showToast();
		}

		$loading = false;
	};
	onMount(async () => {
		$loading = true;
		fields = ((await axiosInstance.get('/public/fields')).data as publicFields).data;
		$loading = false;
	});
</script>

<div class="columns margins flex flex-col gap-2 items-center mt-5" style="direction:ltr">
	<DataTable table$aria-label="People list" style="max-width: 100%;">
		<Head>
			<Row>
				<Cell style="width:50px">ورزش</Cell>
				<Cell>قیمت جدید (ریال)</Cell>
				<Cell>تائید</Cell>
				<Cell>حذف</Cell>
			</Row>
		</Head>
		<Body>
			{#each fields as field}
				<Row>
					<Cell style="width:50px">{field.field_name}</Cell>
					<Cell style="text-align: center;" numeric>
						<input bind:value={field.field_price} class="rounded-md p-1" type="number" />
					</Cell>
					<Cell style="text-align: center;">
						<button
							on:click={() => {
								submitPrice(field.field_id);
							}}
							><img
								alt="tick"
								class="w-8 h-8"
								src="https://img.icons8.com/emoji/48/000000/check-mark-emoji.png"
							/>
						</button>
					</Cell>
					<Cell>
						<button
							on:click={() => {
								deleteSport(field.field_id);
							}}
						>
							<img
								class="w-8 h-8"
								src="https://img.icons8.com/color/48/000000/delete-sign--v1.png"
								alt="delete"
							/>
						</button></Cell
					>
				</Row>
			{/each}
			<Row style="margin-top: 10px; background-color: orange;">
				<Cell
					><input
						bind:value={field_name}
						class="rounded-md p-1"
						type="text"
						placeholder="نام ورزش جدید"
					/></Cell
				>
				<Cell numeric>
					<input
						class="rounded-md p-1"
						bind:value={field_price}
						type="number"
						placeholder="قیمت را وارد کنید"
					/>
				</Cell>
				<Cell />
				<Cell>
					<button class="px-3 py-2 rounded-lg bg-white" on:click={addSport}>+</button></Cell
				>
			</Row>
		</Body>
	</DataTable>
	<div class="flex items-center justify-center gap-2 mt-10 h-16 px-2" style="direction:ltr">
		<input
			class="border border-orange rounded-xl px-1 h-12"
			bind:value={ball_price}
			placeholder="قیمت جدید توپ"
			type="number"
		/>
		<button class="px-3 py-2 bg-green text-white rounded-lg" on:click={ballPrice}>ثبت</button>
	</div>
	<div class="flex items-center justify-center gap-2 mt-10 h-16 px-2" style="direction:ltr">
		<input
			class="border border-orange rounded-xl px-1 h-12"
			bind:value={contactInfo.address}
			placeholder="آدرس"
			type="text"
		/>
		<input
			class="border border-orange rounded-xl px-1 h-12"
			bind:value={contactInfo.tel}
			placeholder="شماره تلفن"
			type="number"
		/>
		<button class="px-3 py-2 bg-green text-white rounded-lg" on:click={newContactInfoHandler}
			>ثبت</button
		>
	</div>
</div>
