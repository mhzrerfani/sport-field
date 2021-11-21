<script lang="ts">
	import SegmentedButton, { Segment } from '@smui/segmented-button';
	import { Label } from '@smui/common';
	import { sport } from '../stores';
	import { onMount } from 'svelte';
	import axiosInstance from '../helper/axios';

	interface publicFields {
		data: {
			field_id: string;
			field_name: string;
			field_price: number;
		}[];
		success: boolean;
	}
	let choices: string[] = [];
	let selected;
	onMount(async () => {
		const res = await axiosInstance.get('/public/fields');
		console.log(res.data);
		choices = (res.data as publicFields).data.map((field) => {
			return field.field_name;
		});
	});
	$: $sport = selected;
</script>

<!--
  Note: segments must be unique. (They cannot === each other.)
  If you need to show the same value, use keyed segments.
-->
<div class="flex flex-col items-center gap-5 mt-20">
	<div>لطفا ورزش خود را انتخاب کنید</div>

	<SegmentedButton
		style="direction: ltr;"
		segments={choices}
		let:segment
		singleSelect
		bind:selected
	>
		<!-- Note: the `segment` property is required! -->
		<Segment {segment}>
			<Label>{segment}</Label>
		</Segment>
	</SegmentedButton>
</div>
