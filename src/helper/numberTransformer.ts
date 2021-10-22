const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
	englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g];
const numberTransformer = (str: string): string => {
	if (typeof str === 'string') {
		for (let i = 0; i < 10; i++) {
			str = str.replace(persianNumbers[i], i).replace(englishNumbers[i], i);
		}
	}
	return str;
};

export default numberTransformer;
