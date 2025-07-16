import { isEmpty } from 'lodash';
import { useGlobalDataColors } from '@kubio/global-data';
import { useMemo, useState, useEffect } from '@wordpress/element';
import { BaseControl, ColorPalette } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

const GutentagColorPalette = ( { onChange, value, returnRawValue } ) => {
	const {
		getPalette,
		getPaletteVariants,
		parseVariableColor,
		computedColorToVariable,
		getColorVariableFromValue,
		toRgbString,
	} = useGlobalDataColors();

	const colors = getPalette();
	const colorVariants = getPaletteVariants();

	const colorValue = parseVariableColor( value );

	const [ currentColor, setCurrentColor ] = useState( colorValue );

	useEffect( () => {
		setCurrentColor( colorValue );
	}, [ colorValue ] );

	const currentColorVariable = useMemo( () => {
		if ( ! currentColor ) {
			return '';
		}

		return getColorVariableFromValue( currentColor );
	}, [ currentColor ] );

	const [ showVariants, setShowVariants ] = useState(
		!! currentColorVariable?.indexOf( 'kubio-' ) >= 0
	);

	const [ variantCurrentColor, setVariantCurrentColor ] =
		useState( colorValue );

	const computedColors = useMemo( () => {
		return colors.map( ( color ) => ( {
			...color,
			color: 'rgb(' + color.color.join( ',' ) + ')',
		} ) );
	}, [ colors ] );

	const computedColorVariants = useMemo( () => {
		return colorVariants
			.map( ( color ) => ( {
				...color,
				color: 'rgb(' + color.color.join( ',' ) + ')',
			} ) )
			.filter( ( color ) => {
				// sometimes the currentColorVariable may also hold the variant, and then we need to extract by parent.
				if ( currentColorVariable?.indexOf( '-variant-' ) > 0 ) {
					return (
						color.parent ===
						currentColorVariable.split( '-variant-' )[ 0 ]
					);
				}

				return color.parent === currentColorVariable;
			} );
	}, [ colorVariants, currentColor ] );

	const onChangeMainColor = ( newColor ) => {
		if ( newColor ) {
			setShowVariants( true );
			setCurrentColor( newColor );
			setVariantCurrentColor( newColor );

			if ( returnRawValue ) {
				onChange( newColor );
			} else {
				onChange( computedColorToVariable( newColor ) );
			}
		}
	};

	const onChangeVariantColor = ( newColor ) => {
		if ( newColor ) {
			setVariantCurrentColor( newColor );

			if ( returnRawValue ) {
				onChange( newColor );
			} else {
				onChange( computedColorToVariable( newColor ) );
			}
		}
	};

	// we need the rbg value of the color in order to keep the ColorPalette check on the right color.
	const selectedColor = computedColors.find( ( i ) => {
		if ( currentColorVariable === i.slug ) {
			return i.color;
		}

		// When the color is a variation, extract the main color from the variable because sometimes the converted
		// rgb value doesn't match the value from the ColorPalette and there will be no default selection for it.
		if ( currentColorVariable?.indexOf( '-variant-' ) > 0 ) {
			return currentColorVariable.split( '-variant-' )[ 0 ] === i.slug;
		}

		return false;
	} );

	const rgbCurrentColorVariation = toRgbString( variantCurrentColor );

	// Make sure the variants ColorPalette is open(if it has a preset color) even after closing the popup.
	useEffect( () => {
		if ( currentColorVariable?.indexOf( 'kubio-' ) >= 0 ) {
			setShowVariants( true );
		} else {
			setShowVariants( false );
		}
	}, [ showVariants, setShowVariants ] );

	return (
		// eslint-disable-next-line @wordpress/no-base-control-with-label-without-id
		<BaseControl
			label={ __( 'Current color scheme', 'kubio' ) }
			className={ classNames(
				'kubio-color-palette-wrapper',
				'kubio-control'
			) }
		>
			<ColorPalette
				className={ 'kubio-color-palette-picker' }
				disableCustomColors={ true }
				value={
					! isEmpty( selectedColor )
						? selectedColor?.color
						: selectedColor
				}
				onChange={ onChangeMainColor }
				colors={ computedColors }
				clearable={ false }
			/>

			{ showVariants && (
				<ColorPalette
					className={ 'kubio-color-palette-variants-picker' }
					disableCustomColors={ true }
					value={ rgbCurrentColorVariation }
					onChange={ onChangeVariantColor }
					colors={ computedColorVariants }
					clearable={ false }
				/>
			) }
		</BaseControl>
	);
};

export default GutentagColorPalette;
