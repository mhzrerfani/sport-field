<script lang="ts">
	import CircularProgress from '@smui/circular-progress';
</script>

<div
	style="z-index: 100"
	class="flex justify-center items-center w-screen h-screen fixed bg-gray2 bg-opacity-60"
>
	<CircularProgress
		class="my-four-colors"
		style="height: 50px; width: 50px;"
		indeterminate
		fourColor
	/>
</div>
