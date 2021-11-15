import { writable } from 'svelte/store';
export const selectedDay = writable();
export const token = writable(localStorage.getItem('token') || '');
export const signingStep = writable('login');
export const sport = writable();
export const ball = writable();
export const cost = writable();
export const loading = writable(false);
export const timeslot = writable();
export const isAdmin = writable(false);
export const newReserve = writable(false);
const globalStoreInitializer = (initialValue = { date: null }) => {
	const { set, update, subscribe } = writable(initialValue);

	return { set, update, subscribe, setDate: (date) => update((store) => ({ ...store, date })) };
};

export const globalStore = globalStoreInitializer();
