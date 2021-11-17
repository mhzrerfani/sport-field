import { token } from '../stores';
import jwt_decode from 'jwt-decode';
import { getLocalStorage } from '../utils/window';

export const store = (t) => {
	if (getLocalStorage().getItem('token')) getLocalStorage().removeItem('token');
	return getLocalStorage().setItem('token', t);
};
export const get = () => {
	if (token) {
		let decoded;
		token.subscribe((value) => {
			decoded = jwt_decode(value);
		});
		return decoded;
	}
	return;
};
// export const check = () => {
// 	if (!getLocalStorage().getItem('token') && !token) {

// 	}
// }

export default store;
