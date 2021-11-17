export const getLocalStorage = () =>
	typeof window !== 'undefined'
		? localStorage
		: {
				setItem: (key: string, value: string) => null,
				getItem: (key: string) => null,
				removeItem: (key: string) => null
		  };
