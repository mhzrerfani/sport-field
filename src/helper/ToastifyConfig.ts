import type { Options } from 'toastify-js';

const ToastifyConfig = (text: string): Options => {
	return {
		text,
		duration: 3000,
		newWindow: true,
		close: true,
		gravity: 'top', // `top` or `bottom`
		position: 'center', // `left`, `center` or `right`
		stopOnFocus: true // Prevents dismissing of toast on hover
	};
};

export default ToastifyConfig;
