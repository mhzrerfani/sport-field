import { token } from '../stores';
import jwt_decode from 'jwt-decode';

export const store = (t) => {
	if (localStorage.getItem('token')) localStorage.removeItem('token');
	return localStorage.setItem('token', t);
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
// 	if (!localStorage.getItem('token') && !token) {

// 	}
// }

export default store;
