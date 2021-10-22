import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:3000'
});

axiosInstance.interceptors.request.use(async function (config) {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers['x-access-token'] = token;
		return config;
	}
}, undefined);

export default axiosInstance;
