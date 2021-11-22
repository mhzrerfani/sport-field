<script lang="ts">
	import { onMount } from 'svelte';
	import Logo from '$lib/Logo.svelte';
	import Drawer, { AppContent, Content, Header, Title, Subtitle, Scrim } from '@smui/drawer';
	import List, { Item } from '@smui/list';
	import routeToPage from '../helper/routing';
	import { isAdmin, loading } from '../stores';
	import { getLocalStorage } from '../utils/window';

	let open = false;
	let active = location.pathname;

	function setActive(value: string) {
		active = value;
		open = false;
	}
</script>

<div class="drawer-container" dir="rtl">
	<Drawer variant="modal" bind:open>
		<Content>
			<List>
				<Item
					href="/dashboard"
					on:click={() => {
						if (active != '/dashboard') $loading = true;
						setActive('/dashboard');
					}}
					activated={active === '/dashboard'}
				>
					<span class="text-lg">رزرو سانس</span>
				</Item>
				<Item
					href="/history"
					on:click={() => {
						if (active != '/history') $loading = true;
						setActive('/history');
					}}
					activated={active === '/history'}
				>
					<span class="text-lg">تاریخچه رزرو ها</span>
				</Item>
				{#if $isAdmin}
					<Item
						href="/setting"
						on:click={() => {
							if (active != '/setting') $loading = true;
							setActive('/setting');
						}}
						activated={active === '/setting'}
					>
						<span class="text-lg">تنظیمات</span>
					</Item>
				{/if}
			</List>
		</Content>
	</Drawer>

	<Scrim />
</div>
<div class="flex justify-between px-7 pt-6">
	<div class="flex gap-10">
		<svg
			on:click={() => (open = !open)}
			class="cursor-pointer"
			width="34"
			height="34"
			viewBox="0 0 34 34"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M29.75 25.5H4.25V22.6667H29.75V25.5ZM29.75 18.4167H4.25V15.5833H29.75V18.4167ZM29.75 11.3333H4.25V8.5H29.75V11.3333Z"
				fill="#DF6531"
			/>
		</svg>
		<svg
			class="cursor-pointer"
			on:click={() => {
				getLocalStorage().removeItem('token');
				routeToPage('./', true);
			}}
			width="31"
			height="31"
			viewBox="0 0 31 31"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M20.15 4.6499V7.7499H23.25V23.2499H20.15V26.3499H26.35V4.6499H20.15ZM20.15 17.0499V13.9499H8.36998L15.035 7.2849L12.865 5.1149L2.47998 15.4999L12.865 25.8849L15.035 23.7149L8.36998 17.0499H20.15Z"
				fill="#DF6531"
			/>
		</svg>
	</div>
	<Logo
		on:click={() => {
			routeToPage('./', true);
		}}
	/>
</div>
