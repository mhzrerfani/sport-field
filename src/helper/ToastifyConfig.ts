const ToastifyConfig = (text: string) => {
	return {
		text,
		duration: 3000,
		newWindow: true,
		close: true,
		gravity: 'top', // `top` or `bottom`
		position: 'center', // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		style: {
			background: '#fff',
			color: '#DF6531',
			borderRadius: '12px'
		}
	};
};

export default ToastifyConfig;
