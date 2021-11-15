<script lang="ts">
	import SegmentedButton, { Segment } from '@smui/segmented-button';
	import Button from '@smui/button';
	import { Label } from '@smui/common';
	import { sport } from '../stores';
	let choices = ['والیبال', 'فوتبال', 'بسکتبال'];
	let selected = 'فوتبال';
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
