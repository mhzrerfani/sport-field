import { goto } from '$app/navigation';
const routeToPage = (route: string, replaceState: boolean) => {
	goto(`/${route}`, { replaceState });
};
export default routeToPage;
