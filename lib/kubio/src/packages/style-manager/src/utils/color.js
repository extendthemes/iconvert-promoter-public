import tinycolor from 'tinycolor2';

const nrColorVariants = 5;
const changeColorHsv = function ( color, filter ) {
	const nrColorVariants = nrColorVariants;
	const tinyColorsVariants = getMonochromaticColors( color );
	const colorVariant = tinyColorsVariants.find(
		( variantTinyColor, index ) => {
			return index === filter.position;
		}
	);
	if ( ! colorVariant ) {
		return color;
	}
	const rgbColor = colorVariant.toRgbString();
	return rgbColor;
};

const hsvFilters = [
	{
		label: 'variant0',
		position: 0,
	},
	{
		label: 'variant1',
		position: 1,
	},
	{
		label: 'variant2',
		position: 2,
	},

	{
		label: 'variant3',
		position: 3,
	},
	{
		label: 'variant4',
		position: 4,
	},
];

function isShadeOfGrey( color ) {
	const tColor = tinycolor( color );
	const hsvColor = tColor.toHsv();
	const { h, s } = hsvColor;
	if ( h === 0 && s === 0 ) {
		return true;
	}

	return false;
}

function getHsvFilterOnColor( position ) {
	return _.find( hsvFilters, ( obj ) => {
		return obj.position === position;
	} );
}

const pipes = {};
hsvFilters.forEach( ( hsvFilter ) => {
	pipes[ hsvFilter.label ] = ( value ) => changeColorHsv( value, hsvFilter );
} );

function getMonochromaticColors( color ) {
	const tColor = tinycolor( color );
	return monochromatic( tColor, nrColorVariants ).sort( function ( a, b ) {
		return a.toHsl().l < b.toHsl().l ? 1 : -1;
	} );
}

function monochromatic( baseColor, variations ) {
	variations = variations % 2 ? variations : variations + 1;

	const baseColorTC = tinycolor( baseColor );
	const baseColorHSV = baseColorTC.toHsv();
	const result = [ baseColorTC ];

	if ( isShadeOfGrey( baseColorTC ) ) {
		const shadesVariations = variations - 1;
		const shadeStep = 1 / variations;

		for ( let i = 0; i < shadesVariations; i++ ) {
			const distance = shadeStep * ( i + 1 );
			result.push(
				tinycolor( {
					...baseColorHSV,
					v: ( baseColorHSV.v + distance ) % 1,
				} )
			);
		}

		return result;
	}

	const saturationVariations = ( variations - 1 ) / 2;
	const valueVariations = ( variations - 1 ) / 2;
	const step = 2 / ( variations + 1 ); // ( 1 / ( (variations+1) / 2 ) )

	for ( let i = 0; i < saturationVariations; i++ ) {
		const distance = step * ( i + 1 );
		result.push(
			tinycolor( {
				...baseColorHSV,
				s: ( baseColorHSV.s + distance ) % 1,
			} )
		);
	}

	for ( let i = 0; i < valueVariations; i++ ) {
		const distance = step * ( i + 1 );
		result.push(
			tinycolor( {
				...baseColorHSV,
				v: ( baseColorHSV.v + distance ) % 1,
			} )
		);
	}

	return result;
}

export {
	nrColorVariants,
	hsvFilters,
	pipes,
	getMonochromaticColors,
	getHsvFilterOnColor,
};
