import axios from 'axios';
import { getLocalStorage } from '../utils/window';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:3000'
});

axiosInstance.interceptors.request.use(async function (config) {
	const token = getLocalStorage().getItem('token');
	if (token) {
		config.headers['x-access-token'] = token;
		return config;
	}
}, null);

export default axiosInstance;
