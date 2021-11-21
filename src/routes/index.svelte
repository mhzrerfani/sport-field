<script>
	import Logo from '$lib/Logo.svelte';
	import { fade } from 'svelte/transition';
	import routeToPage from '../helper/routing';
	import { signingStep, loading } from '../stores';
	import { onMount } from 'svelte';
	import { getLocalStorage } from '../utils/window';
	let userState, href;

	onMount(async () => {
		userState = await getLocalStorage().getItem('token');
		return userState ? (href = './dashboard') : (href = './signing');
	});
	const signUp = () => {
		if (getLocalStorage().getItem('token')) {
			$loading = true;
			return routeToPage('./dashboard', true);
		} else {
			return ($signingStep = 'phone');
		}
	};
	const logIn = () => {
		if (getLocalStorage().getItem('token')) {
			$loading = true;
			return routeToPage('./dashboard', true);
		} else {
			return ($signingStep = 'login');
		}
	};
</script>

<svelte:head>
	<title>باشگاه</title>
</svelte:head>
<div
	style="background: rgb(223, 90, 33);
			background: linear-gradient(90deg, rgba(223, 90, 33, 1) 0%, rgba(233, 121, 74, 1) 100%);"
	in:fade={{ duration: 400, delay: 400 }}
	out:fade={{ duration: 400 }}
	class="flex flex-col h-screen f-full"
>
	<header class="flex justify-between mx-7 mt-7  realtive">
		<div class="flex gap-4 text-white text-lg">
			<a {href} on:click={signUp}>ثبت نام</a>
			<a {href} on:click={logIn}>ورود</a>
		</div>
		<Logo />
		<svg
			class="absolute z-10 -top-8 -left-8"
			width="257"
			height="294"
			viewBox="0 0 257 294"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M-3.78795 222.79C-61.1659 232.359 -114.724 294.316 -167.586 269.349C-220.052 244.567 -212.398 165.654 -237.194 112.546C-261.283 60.9528 -312.161 19.9601 -310.624 -37.0087C-309.016 -96.6161 -273.588 -151.599 -229.027 -190.211C-186.192 -227.328 -128.916 -239.963 -72.5921 -243.263C-20.1682 -246.334 36.8712 -242.35 77.3578 -208.161C115.234 -176.178 105.037 -115.041 130.183 -72.0335C158.75 -23.174 226.666 1.23453 232.763 57.6338C239.128 116.505 209.081 181.066 161.164 214.521C114.749 246.927 51.8693 213.508 -3.78795 222.79Z"
				fill="#E4F5FB"
			/>
		</svg>
	</header>
	<div class="flex flex-col gap-8 text-white self-center mt-40 items-center">
		<h2 class="text-4xl">فرصتو از دست نده</h2>
		<h3 class="text-xl">
			همین الان سانسو <a {href} class="btn mx-2 px-7 py-3">رزرو</a>کن...
		</h3>
	</div>
	<div class="w-full flex justify-center mt-24">
		<button class="btn px-3 py-6 text-3xl font-medium" title="دانلود برنامه اندروید"
			>دانلود برنامه اندروید</button
		>
	</div>
	<div />
</div>

<div in:fade={{ duration: 400, delay: 400 }} out:fade={{ duration: 400 }} class="w-full bg-white">
	<div class="pt-4 mr-8 flex flex-col text-md gap-6 pb-4">
		<span class="text-lg mr-2">ارتباط با ما</span>
		<span>تلفن: ۰۲۱۱۲۳۴۵۶۷</span>
		<span>آدرس: شهر فلان - خیابان فلان - پلاک فلان</span>
	</div>
</div>
