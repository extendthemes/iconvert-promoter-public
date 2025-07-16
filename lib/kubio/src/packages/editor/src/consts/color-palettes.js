import { __ } from '@wordpress/i18n';
import { PRO_ON_FREE_FLAG } from '@kubio/pro';

const colorPalettes = [
	{
		label: __('Kubio Default', 'kubio'),
		colors: [
			{ slug: 'kubio-color-1', color: [3, 169, 244] },
			{ slug: 'kubio-color-2', color: [247, 144, 7] },
			{ slug: 'kubio-color-3', color: [0, 191, 135] },
			{ slug: 'kubio-color-4', color: [102, 50, 255] },
			{ slug: 'kubio-color-5', color: [255, 255, 255] },
			{ slug: 'kubio-color-6', color: [0, 0, 0] },
		],
	},
	{
		label: __('Vibrant & Elegant', 'kubio'),
		colors: [
			{ slug: 'kubio-color-1', color: [48, 62, 122] },
			{ slug: 'kubio-color-2', color: [247, 229, 151] },
			{ slug: 'kubio-color-3', color: [246, 97, 97] },
			{ slug: 'kubio-color-4', color: [158, 201, 226] },
			{ slug: 'kubio-color-5', color: [246, 248, 250] },
			{ slug: 'kubio-color-6', color: [32, 42, 84] },
		],
	},
	{
		label: __('XPR | Glaucous & Coquelicot', 'kubio'),
		colors: [
			{ slug: 'kubio-color-1', color: [233, 63, 12] },
			{ slug: 'kubio-color-2', color: [238, 192, 13] },
			{ slug: 'kubio-color-3', color: [9, 164, 207] },
			{ slug: 'kubio-color-4', color: [181, 214, 209] },
			{ slug: 'kubio-color-5', color: [239, 249, 235] },
			{ slug: 'kubio-color-6', color: [85, 119, 173] },
		],
	},
	{
		label: __('XPR | Fruits & Jellies', 'kubio'),
		colors: [
			{ slug: 'kubio-color-1', color: [90, 209, 0] },
			{ slug: 'kubio-color-2', color: [0, 176, 244] },
			{ slug: 'kubio-color-3', color: [94, 204, 227] },
			{ slug: 'kubio-color-4', color: [255, 181, 0] },
			{ slug: 'kubio-color-5', color: [239, 249, 235] },
			{ slug: 'kubio-color-6', color: [23, 37, 42] },
		],
	},
	{
		label: __('XPR-1', 'kubio'),
		colors: [
			{ slug: 'kubio-color-1', color: [255, 137, 0] },
			{ slug: 'kubio-color-2', color: [0, 144, 183] },
			{ slug: 'kubio-color-3', color: [180, 180, 180] },
			{ slug: 'kubio-color-4', color: [230, 230, 230] },
			{ slug: 'kubio-color-5', color: [246, 248, 250] },
			{ slug: 'kubio-color-6', color: [58, 58, 58] },
		],
	},
	{
		label: __('XPR-2', 'kubio'),
		colors: [
			{ slug: 'kubio-color-1', color: [122, 146, 0] },
			{ slug: 'kubio-color-2', color: [200, 0, 69] },
			{ slug: 'kubio-color-3', color: [248, 110, 0] },
			{ slug: 'kubio-color-4', color: [255, 194, 0] },
			{ slug: 'kubio-color-5', color: [246, 248, 250] },
			{ slug: 'kubio-color-6', color: [71, 0, 55] },
		],
	},
	{
		label: __('XPR-3', 'kubio'),
		colors: [
			{ slug: 'kubio-color-1', color: [3, 12, 73] },
			{ slug: 'kubio-color-2', color: [255, 0, 0] },
			{ slug: 'kubio-color-3', color: [191, 234, 238] },
			{ slug: 'kubio-color-4', color: [255, 181, 0] },
			{ slug: 'kubio-color-5', color: [226, 235, 231] },
			{ slug: 'kubio-color-6', color: [23, 37, 42] },
		],
	},
	{
		label: __('XPR-4', 'kubio'),
		colors: [
			{ slug: 'kubio-color-1', color: [153, 0, 255] },
			{ slug: 'kubio-color-2', color: [237, 0, 166] },
			{ slug: 'kubio-color-3', color: [172, 255, 0] },
			{ slug: 'kubio-color-4', color: [243, 162, 0] },
			{ slug: 'kubio-color-5', color: [215, 228, 228] },
			{ slug: 'kubio-color-6', color: [66, 157, 255] },
		],
	},
	{
		label: __('XPR-5', 'kubio'),
		colors: [
			{ slug: 'kubio-color-1', color: [31, 43, 87] },
			{ slug: 'kubio-color-2', color: [153, 187, 227] },
			{ slug: 'kubio-color-3', color: [70, 124, 198] },
			{ slug: 'kubio-color-4', color: [225, 98, 66] },
			{ slug: 'kubio-color-5', color: [231, 240, 249] },
			{ slug: 'kubio-color-6', color: [71, 0, 55] },
		],
	},
	{
		label: __('XPR-6', 'kubio'),
		colors: [
			{ slug: 'kubio-color-1', color: [237, 59, 56] },
			{ slug: 'kubio-color-2', color: [242, 250, 200] },
			{ slug: 'kubio-color-3', color: [208, 238, 57] },
			{ slug: 'kubio-color-4', color: [222, 235, 171] },
			{ slug: 'kubio-color-5', color: [238, 240, 231] },
			{ slug: 'kubio-color-6', color: [23, 37, 42] },
		],
	},
	{
		label: __('XPR-7', 'kubio'),
		colors: [
			{ slug: 'kubio-color-1', color: [0, 192, 150] },
			{ slug: 'kubio-color-2', color: [0, 231, 153] },
			{ slug: 'kubio-color-3', color: [51, 247, 133] },
			{ slug: 'kubio-color-4', color: [152, 255, 129] },
			{ slug: 'kubio-color-5', color: [242, 252, 247] },
			{ slug: 'kubio-color-6', color: [23, 37, 42] },
		],
	},
	{
		label: __('XPR-8', 'kubio'),
		colors: [
			{ slug: 'kubio-color-1', color: [20, 30, 112] },
			{ slug: 'kubio-color-2', color: [39, 76, 196] },
			{ slug: 'kubio-color-3', color: [69, 168, 255] },
			{ slug: 'kubio-color-4', color: [94, 247, 255] },
			{ slug: 'kubio-color-5', color: [236, 246, 255] },
			{ slug: 'kubio-color-6', color: [27, 46, 77] },
		],
	},
];

colorPalettes.forEach((item, index) => {
	if (index > 1) {
		item[PRO_ON_FREE_FLAG] = true;
	}
	return item;
});

export default colorPalettes;
