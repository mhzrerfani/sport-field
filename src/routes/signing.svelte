<script lang="ts">
	import { signingStep } from '../stores';
	import { fade } from 'svelte/transition';
	import Signing from '../components/Signing.svelte';
	import axiosInstance from '../helper/axios';
	import Toastify from 'toastify-js';
	import ToastifyConfig from '../helper/ToastifyConfig';
	import numberTransformer from '../helper/numberTransformer';
	let name: string, phone: number, code: number, password: string, password2: string;

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
	const infoHandler = async (event: Event) => {
		contentHandler(event).sent();
		try {
			const formData = new FormData();
			formData.append('phone', numberTransformer(phone + ''));
			await axiosInstance.post('/user/submit-phone', formData);
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
			await axiosInstance.post('/user/verify-phone', formData);
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
				formData.append('name', name);
				formData.append('password', password);
				await axiosInstance.post('/user/create', formData);
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
		transition:fade={{ duration: 700 }}
		slot="info"
		class="flex flex-col gap-6 justify-center items-center"
	>
		<input class="input" type="text" placeholder="شماره همراه" bind:value={phone} />
		<button class="btn mt-12 px-3 py-2" on:click|preventDefault={infoHandler}>ارسال کد تائید</button
		>
	</form>
	<form
		in:fade={{ delay: 700 }}
		out:fade={{ delay: 400 }}
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
		transition:fade={{ duration: 700 }}
		slot="password"
		class="flex flex-col gap-6 justify-center items-center"
	>
		<input class="input" type="text" placeholder="نام و نام خانوادگی" bind:value={name} />
		<input class="input" type="password" placeholder="رمز" bind:value={password} />
		<input class="input" type="password" placeholder="تکرار رمز" bind:value={password2} />
		<button class="btn mt-12 px-3 py-2" on:click|preventDefault={passwordHandler}>ثبت نام</button>
	</form>
	<form
		transition:fade={{ duration: 700 }}
		slot="login"
		class="flex flex-col gap-6 justify-center items-center"
	>
		<input class="input" type="text" placeholder="شماره همراه" bind:value={phone} />
		<input class="input" type="password" placeholder="رمز" bind:value={password} />
		<button class="btn mt-12 px-3 py-2" on:click|preventDefault={loginHandler}>ورود</button>
	</form>
</Signing>
