<script lang="ts">
	import { signingStep, token, loading } from '../stores';
	import { fade } from 'svelte/transition';
	import Signing from '../components/Signing.svelte';
	import axios from 'axios';
	import routeToPage from '../helper/routing';
	import Toastify from 'toastify-js';
	import 'toastify-js/src/toastify.css'
	import ToastifyConfig from '../helper/ToastifyConfig';
	import numberTransformer from '../helper/numberTransformer';
	import store from '../helper/token';
	import { onMount } from 'svelte';
	axios.defaults.baseURL = 'http://localhost:8026/';
	let name: string,
		phone: number,
		code: number,
		password: string,
		password2: string,
		newPassPhase = false;
	const errorHandler = (error) => {
		error.response.data.errors.forEach((error: { field: string; message: string }) => {
			Toastify(ToastifyConfig(error.message)).showToast();
		});
	};
	onMount(() => {
		$loading = false;
	});
	const contentHandler = (event) => {
		return {
			sent: () => {
				$loading = true;
				event.target.disabled = true;
				event.target.textContent = 'درحال ارسال ...';
			},
			errorReceived: (error) => {
				$loading = false;
				event.target.disabled = false;
				event.target.textContent = 'ارسال دوباره';
				errorHandler(error);
			}
		};
	};
	// Events Handlers
	const phoneHandler = async (e) => {
		contentHandler(e).sent();
		try {
			const formData = new FormData();
			formData.append('phone', numberTransformer(phone + ''));
			!newPassPhase
				? await axios.post('/user/submit-phone', formData)
				: await axios.post('/auth/forget-password', formData);
			$signingStep = 'code';
		} catch (error) {
			contentHandler(e).errorReceived(error);
		}
	};
	const codeHandler = async (e) => {
		contentHandler(e).sent();
		try {
			const formData = new FormData();
			formData.append('phone', numberTransformer(phone + ''));
			formData.append('code', numberTransformer(code + ''));
			!newPassPhase
				? await axios.post('/user/verify-phone', formData)
				: await axios.post('/auth/check-code', formData);
			$signingStep = 'password';
		} catch (error) {
			contentHandler(e).errorReceived(error);
		}
	};
	const passwordHandler = async (e) => {
		contentHandler(e).sent();
		if (password !== password2) {
			e.target.disabled = false;
			e.target.textContent = 'ارسال دوباره';
			Toastify(ToastifyConfig('رمزها مطابقت ندارند')).showToast();
		} else {
			try {
				const formData = new FormData();
				formData.append('phone', numberTransformer(phone + ''));
				if (!newPassPhase) formData.append('name', name);
				if (newPassPhase) formData.append('code', numberTransformer(code + ''));
				formData.append('password', password);
				!newPassPhase
					? await axios.post('/user/create', formData)
					: await axios.patch('/auth/change-password', formData);
				newPassPhase = false;
				$signingStep = 'login';
			} catch (error) {
				contentHandler(e).errorReceived(error);
			}
		}
	};
	const loginHandler = async (e) => {
		contentHandler(e).sent();
		try {
			const formData = new FormData();
			formData.append('phone', numberTransformer(phone + ''));
			formData.append('password', password);
			const res = await axios.post('/auth/login', formData);
			store(res.data.token);
			$token = res.data.token;
			localStorage.setItem('token', res.data.token);
			routeToPage('./dashboard', true);
			e.target.disabled = true;
		} catch (error) {
			contentHandler(e).errorReceived(error);
		}
	};
</script>

<Signing>
	<form
		in:fade={{ duration: 400, delay: 400 }}
		out:fade={{ duration: 400 }}
		slot="phone"
		class="flex flex-col gap-6 justify-center items-center"
	>
		<input class="input" type="text" placeholder="شماره همراه" bind:value={phone} />
		<button class="btn mt-12 px-3 py-2" on:click|preventDefault={phoneHandler}
			>ارسال کد تائید</button
		>
	</form>
	<form
		in:fade={{ duration: 400, delay: 400 }}
		out:fade={{ duration: 400 }}
		slot="code"
		class="flex flex-col gap-6 justify-center items-center"
	>
		<input
			class="input"
			type="text"
			placeholder="کدی که برایتان پیامک شد را وارد کنید"
			bind:value={code}
		/>
		<button class="btn mt-12 px-3 py-2" on:click|preventDefault={codeHandler}>تائید کد</button>
	</form>
	<form
		in:fade={{ duration: 400, delay: 400 }}
		out:fade={{ duration: 400 }}
		slot="password"
		class="flex flex-col gap-6 justify-center items-center"
	>
		{#if !newPassPhase}
			<input class="input" type="text" placeholder="نام و نام خانوادگی" bind:value={name} />
		{/if}
		<input class="input" type="password" placeholder="رمز" bind:value={password} />
		<input class="input" type="password" placeholder="تکرار رمز" bind:value={password2} />
		<button class="btn mt-12 px-3 py-2" on:click|preventDefault={passwordHandler}
			>{#if !newPassPhase}ثبت نام{:else}ثبت رمز جدید{/if}</button
		>
	</form>
	<form
		in:fade={{ duration: 400, delay: 400 }}
		out:fade={{ duration: 400 }}
		slot="login"
		class="flex flex-col w-min gap-6 justify-center items-center"
	>
		<input class="input" type="text" placeholder="شماره همراه" bind:value={phone} />
		<input class="input" type="password" placeholder="رمز" bind:value={password} />
		<button
			class=" self-start text-white"
			on:click|preventDefault={() => {
				$signingStep = 'phone';
				newPassPhase = true;
			}}>فراموشی رمز</button
		>
		<button class="btn mt-4 px-3 py-2" on:click|preventDefault={loginHandler}>ورود</button>
	</form>
</Signing>