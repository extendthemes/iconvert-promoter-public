import { useBlocksOwnerDocument } from '@kubio/editor-data';
import { getMonochromaticColors } from '@kubio/style-manager';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { each, find, isEmpty, isString, once } from 'lodash';
import tinycolor from 'tinycolor2';
import { renderGlobalColorsPalette } from './global-style-render';
import useGlobalDataEntity from './use-global-data-entity';

const generateVariants = (colorPalette) => {
	let colorVariants = [];

	each(colorPalette, ({ color, slug }) => {
		const rgbColor = tinycolor(
			'rgb(' + color.join(',') + ')'
		).toHexString();
		colorVariants = colorVariants.concat(
			getMonochromaticColors(rgbColor).map(
				(variantColor, variantIndex) => ({
					slug: `${slug}-variant-` + (variantIndex + 1),
					color: [
						parseInt(variantColor._r),
						parseInt(variantColor._g),
						parseInt(variantColor._b),
					],
					parent: slug,
				})
			)
		);
	});
	return colorVariants;
};

// make sure the slugs are properly formatter
const normalizePalette = (colorPalette) => {
	const result = [];

	colorPalette.forEach(({ color }, index) => {
		result.push({
			color,
			slug: 'kubio-color-' + (index + 1),
		});
	});

	return result;
};

const useGlobalDataColors = () => {
	const { getPathValue, setMultiplePathsValues } = useGlobalDataEntity();
	const ownerDocument = useBlocksOwnerDocument();

	const getEditorSettings = useSelect(
		(select) => select('core/block-editor').getSettings,
		[]
	);
	const updateEditorSettings = useDispatch('core/block-editor')
		.updateSettings;

	const getPalette = () => getPathValue('colors', []);

	const getPaletteVariants = () => {
		let colorVariants = getPathValue('colorVariants', null);

		if (colorVariants === null) {
			colorVariants = generateVariants(getPathValue('colors'));
		}

		return colorVariants;
	};

	const updateEditorPalette = (colorPalette) => {
		const normalPalette = normalizePalette(colorPalette);

		const editorColors = normalPalette.map((color) => {
			return {
				slug: color.slug,
				color: 'rgb(' + color.color.join() + ')',
			};
		});

		updateEditorSettings({
			...getEditorSettings(),
			colors: editorColors,
		});
	};

	const renderPalette = useCallback(
		({ colorPalette, colorVariants }) =>
			renderGlobalColorsPalette({
				colorPalette,
				colorVariants,
				ownerDocument,
			}),
		[ownerDocument]
	);

	const setPalette = (colorPalette) => {
		const normalPalette = normalizePalette(colorPalette);
		const colorVariants = generateVariants(normalPalette);

		setMultiplePathsValues({
			colors: colorPalette,
			colorVariants,
		});

		renderPalette({
			colorPalette,
			colorVariants,
		});

		updateEditorPalette(colorPalette);
	};

	// set the kubio color pallete as the default color palette
	//const initialized = useRef(false);
	//const palette = getPalette();
	// performance issue
	// useEffect(() => {
	// 	if (palette.length && !initialized.current) {
	// 		updateEditorPalette(palette);
	// 		initialized.current = true;
	// 	}
	// }, [palette]);

	const parseVariableColor = (
		value,
		{ colorPalette = null, colorPaletteVariants = null } = {}
	) => {
		if (!isString(value) || isEmpty(value)) {
			return value;
		}

		if (value.indexOf('var(') === -1) {
			return value;
		}

		// remove extra spaces
		value = value.replace(/\s\s+/, '');
		// get vars
		const matches = value.match(/var\(--(.*?)\)/gim) || [];

		if (!colorPalette) {
			colorPalette = getPalette();
		}
		// replace vars with r,g,b,
		if (!colorPaletteVariants) {
			colorPaletteVariants = generateVariants(colorPalette);
		}
		matches.forEach((match) => {
			const slug = match.replace(/var\(--(.*?)\)(.*)/, '$1');
			const color = find([].concat(colorPalette, colorPaletteVariants), {
				slug,
			})?.color;
			value = value.replace(match, color);
		});

		const rgbaParts =
			value.match(
				/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/gim
			) || [];

		// look for possible hex values ( rgba with alpha =1 )
		rgbaParts.forEach((rgbaPart) => {
			const color = tinycolor(rgbaPart);
			const alpha = color?.getAlpha();

			if (alpha === 1) {
				value = value.replace(rgbaPart, color.toHexString());
			}
		});

		return value;
	};

	const getColorVariableFromValue = (value) => {
		const color = tinycolor(value);
		const allColors = [].concat(getPalette(), getPaletteVariants());

		return allColors.find(({ color: itemColor }) => {
			return (
				itemColor[0] === color._r &&
				itemColor[1] === color._g &&
				itemColor[2] === color._b
			);
		})?.slug;
	};

	const computedColorToVariable = (value) => {
		const colorVar = getColorVariableFromValue(value);
		if (!colorVar) {
			return value;
		}

		const color = tinycolor(value);
		return `rgba(var(--${colorVar}),${color.getAlpha()})`;
	};

	const renderColors = (doc) => {
		renderPalette({
			colorPalette: getPalette(),
			colorVariants: getPaletteVariants(),
			ownerDocument: doc || ownerDocument,
		});
	};

	const initColors = once(renderColors);

	// A helper to convert hex to rgb string.
	const toRgbString = (hex) => {
		const tinyColor = tinycolor(hex);
		return tinyColor.toRgbString().replace(/\s/g, '');
	};

	return {
		getPalette,
		setPalette,
		getPaletteVariants,
		parseVariableColor,
		computedColorToVariable,
		getColorVariableFromValue,
		initColors,
		renderColors,
		toRgbString,
	};
};

export default useGlobalDataColors;

export { normalizePalette, generateVariants };
