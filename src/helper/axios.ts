import axios from 'axios';
import { getLocalStorage } from '../utils/window';

const axiosInstance = axios.create({
	baseURL: 'https://api.salonbesat.ir'
});

axiosInstance.interceptors.request.use(async function (config) {
	const token = getLocalStorage().getItem('token');
	if (token) {
		config.headers['x-access-token'] = token;
		return config;
	}
}, null);

export default axiosInstance;
