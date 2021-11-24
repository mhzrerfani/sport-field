<script lang="ts">
	import SegmentedButton, { Segment } from '@smui/segmented-button';
	import Button from '@smui/button';
	import { Label } from '@smui/common';
	import { ball } from '../stores';
	let choices = ['بله', 'خیر'];
	let selected = 'بله';
	$: $ball = selected;
</script>

<div class="flex flex-col items-center gap-5 my-20">
	<div>آیا به توپ نیاز دارید؟</div>

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
