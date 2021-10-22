<script lang="ts">
	import { signingStep } from '../stores';
	import { fade } from 'svelte/transition';
	import Signing from '../components/Signing.svelte';
	import axiosInstance from '../helper/axios';
	import Toastify from 'toastify-js';
	import ToastifyConfig from '../helper/ToastifyConfig';
	import numberTransformer from '../helper/numberTransformer';
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
	const contentHandler = (event: { target: HTMLButtonElement }) => {
		return {
			sent: () => {
				event.target.disabled = true;
				event.target.textContent = 'درحال ارسال ...';
			},
			errorReceived: (error) => {
				event.target.disabled = false;
				event.target.textContent = 'ارسال دوباره';
				errorHandler(error);
			}
		};
	};

	// Events Handlers
	const phoneHandler = async (event: Event) => {
		contentHandler(event).sent();
		try {
			const formData = new FormData();
			formData.append('phone', numberTransformer(phone + ''));
			!newPassPhase
				? await axiosInstance.post('/user/submit-phone', formData)
				: await axiosInstance.post('/auth/forget-password', formData);
			$signingStep = 'code';
		} catch (error) {
			contentHandler(event).errorReceived(error);
		}
	};
	const codeHandler = async (event: { target: HTMLButtonElement }) => {
		contentHandler(event).sent();
		try {
			const formData = new FormData();
			formData.append('phone', numberTransformer(phone + ''));
			formData.append('code', numberTransformer(code + ''));
			!newPassPhase
				? await axiosInstance.post('/user/verify-phone', formData)
				: await axiosInstance.post('/auth/check-code', formData);
			$signingStep = 'password';
		} catch (error) {
			contentHandler(event).errorReceived(error);
		}
	};
	const passwordHandler = async (event: { target: HTMLButtonElement }) => {
		contentHandler(event).sent();
		if (password !== password2) {
			event.target.disabled = false;
			event.target.textContent = 'ارسال دوباره';
			Toastify(ToastifyConfig('رمزها مطابقت ندارند')).showToast();
		} else {
			try {
				const formData = new FormData();
				formData.append('phone', numberTransformer(phone + ''));
				if (!newPassPhase) formData.append('name', name);
				if (newPassPhase) formData.append('code', numberTransformer(code + ''));
				formData.append('password', password);
				!newPassPhase
					? await axiosInstance.post('/user/create', formData)
					: await axiosInstance.patch('/auth/change-password', formData);
				newPassPhase = false;
				$signingStep = 'login';
			} catch (error) {
				contentHandler(event).errorReceived(error);
			}
		}
	};
	const loginHandler = async (event: { target: HTMLButtonElement }) => {
		contentHandler(event).sent();
		try {
			const formData = new FormData();
			formData.append('phone', numberTransformer(phone + ''));
			formData.append('password', password);
			await axiosInstance.post('/auth/login', formData);
			alert('خوش آمدید');
		} catch (error) {
			contentHandler(event).errorReceived(error);
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
		> <button class="btn mt-4 px-3 py-2" on:click|preventDefault={loginHandler}>ورود</button>
	</form>
</Signing>
