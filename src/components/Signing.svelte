<script>
	import { signingStep } from '../stores';
	import players from '../assets/img/loging-players.svg';
	import { fade } from 'svelte/transition';
</script>

<div
	in:fade={{ duration: 400, delay: 400 }}
	out:fade={{ duration: 400 }}
	class=" relative w-full min-h-screen flex justify-center flex-col overflow-hidden"
	style="background: rgb(223, 90, 33);
			background: linear-gradient(90deg, rgba(223, 90, 33, 1) 0%, rgba(233, 121, 74, 1) 100%);"
>
	<svg class="absolute w-full h-80 top-0" xmlns="http://www.w3.org/2000/svg"
		><path
			fill="#E4F5FB"
			fill-opacity="1"
			d="M0,192L80,202.7C160,213,320,235,480,234.7C640,235,800,213,960,218.7C1120,224,1280,256,1360,272L1440,288L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
		/></svg
	>
	<div class="realtive flex justify-around z-50">
		<img src={players} alt="Athletes" />
	</div>
	<div class="mt-10 h-full flex w-full justify-center">
		{#if $signingStep == 'phone'}
			<slot name="phone" />
		{:else if $signingStep == 'code'}
			<slot name="code" />
		{:else if $signingStep == 'password'}
			<slot name="password" />
		{:else if $signingStep == 'login'}
			<slot name="login" />
		{:else if $signingStep == 'forgetPass'}
			<slot name="forgetPass" />
		{:else if $signingStep == 'newPass'}
			<slot name="newPass" />
		{/if}
	</div>
</div>
