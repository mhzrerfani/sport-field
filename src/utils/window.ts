export const getLocalStorage = () =>
	typeof window !== 'undefined'
		? localStorage
		: {
				setItem: (key: string, value: string) => null,
				getItem: (key: string) => undefined,
				removeItem: (key: string) => null
		  };
