const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		fontFamily: {
			vazir: ['bardiya', 'vazir']
		},
		extend: {
			colors: {
				orange: '#DF6531',
				lightBlue: '#E4F5FB',
				blue: '#4D93E5',
				gray1: '#ECECEC',
				gray2: '#A6A4A4',
				green: '#58CC30'
			}
		}
	},
	plugins: []
};

module.exports = config;
