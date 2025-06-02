import { useGlobalDataColors } from '@kubio/global-data';
import { DeleteItemIcon } from '@kubio/icons';
import {
	BaseControl,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	Tooltip,
} from '@wordpress/components';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { noop } from 'lodash';
import { AlphaPicker, ChromePicker } from 'react-color';
import tinycolor from 'tinycolor2';
import { InputNumber } from '../range-control/styled-components/input-number';
import { ColorIndicator } from './color-indicator-popover';
import isEqual from 'react-fast-compare';

const CustomAlphaPicker = ( { color, onChange, onChangeComplete } ) => {
	return (
		<Flex align={ 'center' } gap={ 0 }>
			<FlexBlock>
				<AlphaPicker
					height={ '8px' }
					width={ '100%' }
					color={ color }
					onChange={ onChange }
					onChangeComplete={ onChangeComplete }
				/>
			</FlexBlock>
			<FlexItem>
				<InputNumber
					className="components-range-control__number"
					inputMode="decimal"
					min={ 0 }
					max={ 1 }
					step={ 0.01 }
					value={ tinycolor( color ).getAlpha() }
					onChange={ ( nextValue ) => {
						onChangeComplete( {
							rgb: tinycolor( color )
								.setAlpha( nextValue )
								.toRgb(),
						} );
					} }
				/>
			</FlexItem>
		</Flex>
	);
};

const normalizeNextColor = ( nextColor, alpha, forcedAlpha = false ) => {
	if ( nextColor === '' ) {
		return '';
	}

	nextColor = tinycolor( nextColor?.rgb || nextColor );

	if ( ! nextColor.isValid() ) {
		return null;
	}

	if ( forcedAlpha !== false ) {
		nextColor.setAlpha( forcedAlpha );
	}

	return alpha && nextColor.getAlpha() < 1
		? nextColor.toRgbString()
		: nextColor.toHexString();
};

const GutentagColorPicker = ( {
	value,
	onChange,
	onLiveChange,
	label = __( 'Color', 'kubio' ),
	alpha = true,
	returnRawValue = false,
	hasButton = true,
	onButtonClick = noop,
	buttonIcon = DeleteItemIcon,
	buttonText = null,
} ) => {
	const { parseVariableColor, computedColorToVariable } =
		useGlobalDataColors();

	//if the value we sent to tinyColor is null it will crash the component
	if ( value === null || value === undefined ) {
		value = '';
	}
	const colorValue = parseVariableColor( value );
	const [ currentColor, setCurrentColor ] = useState( colorValue );

	const currentColorTinyColor = useMemo(
		() => tinycolor( currentColor ),
		[ currentColor ]
	);

	useEffect( () => {
		const nextValue = normalizeNextColor(
			parseVariableColor( value ),
			alpha
		);
		if ( nextValue && ! isEqual( nextValue, currentColor ) ) {
			setCurrentColor( nextValue );
		}
	}, [ value, alpha ] );

	const onColorChange = ( nextColor, keepOldAlpha = false ) => {
		nextColor = normalizeNextColor(
			nextColor,
			alpha,
			keepOldAlpha ? currentColorTinyColor.getAlpha() : false
		);

		if ( nextColor === null ) {
			return;
		}

		setCurrentColor( nextColor );
		onLiveChange( nextColor );
	};

	const onColorComplete = ( nextColor, keepOldAlpha = false ) => {
		nextColor = normalizeNextColor(
			nextColor,
			alpha,
			keepOldAlpha ? currentColorTinyColor.getAlpha() : false
		);

		if ( nextColor === null ) {
			return;
		}

		const finalColor = returnRawValue
			? nextColor
			: computedColorToVariable( nextColor );

		onColorChange( finalColor );
		onChange( finalColor );
	};

	const containerClassName = classnames(
		'kubio-color-picker-control',
		'kubio-control',
		{
			'kubio-color-picker-control__has_button': hasButton,
		}
	);

	const classNames = [
		'kubio-popover-options-icon ',
		'kubio-color-popover-additional-button',
	];
	if ( buttonText === null ) {
		classNames.push( 'is-small' );
	}

	return (
		<>
			{ /* eslint-disable-next-line @wordpress/no-base-control-with-label-without-id */ }
			<BaseControl label={ label } className={ containerClassName }>
				<ChromePicker
					color={ currentColorTinyColor.toHexString() }
					disableAlpha={ true }
					onChange={ ( nextValue ) =>
						onColorChange( nextValue, true )
					}
					onChangeComplete={ ( nextValue ) =>
						onColorComplete( nextValue, true )
					}
					styles={ {
						default: {
							picker: {
								boxShadow: 'none',
								border: 'none',
								width: 228,
								fontFamily: 'inherit',
							},
						},
					} }
				/>

				<Flex align={ 'center' } justify={ 'center' }>
					{ alpha && (
						<>
							<FlexItem className={ 'kubio-preview-indicator' }>
								<ColorIndicator
									value={ currentColorTinyColor.toRgbString() }
								/>
							</FlexItem>

							<FlexBlock>
								<CustomAlphaPicker
									color={ currentColor }
									onChange={ ( nextValue ) =>
										onColorChange( nextValue, false )
									}
									onChangeComplete={ ( nextValue ) =>
										onColorComplete( nextValue, false )
									}
								/>
							</FlexBlock>
						</>
					) }
					{ hasButton && (
						<Tooltip
							text={ __( 'Reset', 'kubio' ) }
							position={ __( 'top left', 'kubio' ) }
						>
							<FlexItem>
								<Button
									className={ classNames }
									icon={ buttonIcon }
									text={ buttonText }
									onClick={ onButtonClick }
								/>
							</FlexItem>
						</Tooltip>
					) }
				</Flex>
			</BaseControl>
		</>
	);
};

export default GutentagColorPicker;
