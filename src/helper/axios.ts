import axios from 'axios';
import { getLocalStorage } from '../utils/window';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:8026'
});

axiosInstance.interceptors.request.use(async function (config) {
	const token = getLocalStorage().getItem('token');
	if (token) {
		config.headers['x-access-token'] = token;
		return config;
	}
}, null);

export const ToFormData = (object) =>
	Object.keys(object).reduce((formData, key) => {
		formData.append(key, object[key]);
		return formData;
	}, new FormData());

export default axiosInstance;
