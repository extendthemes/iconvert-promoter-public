import { UNSET_VALUE } from '@kubio/constants';
import { useGlobalDataColors } from '@kubio/global-data';
import { ResetIcon } from '@kubio/icons';
import { BaseControl, Button } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { isEqual } from 'lodash';
import { KubioPopup } from '../kubio-popup';
import { GutentagColorPickerWithPalette } from './gutentag-color-picker-with-palette';

const ColorIndicator = ( { value } ) => {
	const { parseVariableColor } = useGlobalDataColors();

	return (
		<span
			className={ classnames(
				'component-color-indicator',
				'kubio-color-popover-indicator'
			) }
		>
			<div
				className={ 'kubio-color-popover-indicator-preview' }
				style={ { background: parseVariableColor( value ) } }
			/>
		</span>
	);
};

const IndicatorPopover = ( {
	color,
	onChange,
	alpha = true,
	showReset,
	onReset,
	showPalette = true,
	returnRawValue,
	hasButton,
	buttonIcon,
	buttonText,
} ) => {
	const [ currentColor, setCurrentColor ] = useState( color );

	const setColor = ( nextValue ) => {
		setCurrentColor( nextValue );
		onChange( nextValue );
	};

	useEffect( () => {
		if ( ! isEqual( color, currentColor ) ) {
			setCurrentColor( color );
		}
	}, [ color ] );

	const buttonRef = useRef();

	return (
		<div className={ 'kubio-color-popover-wrapper' }>
			<Button
				ref={ buttonRef }
				className={ 'kubio-color-popover-button' }
			>
				<ColorIndicator value={ currentColor } />
			</Button>

			<KubioPopup
				className={ classnames(
					'kubio-color-popover',
					'kubio-control'
				) }
				buttonRef={ buttonRef }
				anchorRef={ buttonRef }
			>
				<GutentagColorPickerWithPalette
					alpha={ alpha }
					value={ currentColor }
					onChange={ setColor }
					onLiveChange={ setCurrentColor }
					showPalette={ showPalette }
					onButtonClick={ onReset }
					returnRawValue={ returnRawValue }
					hasButton={ hasButton }
					buttonIcon={ buttonIcon }
					buttonText={ buttonText }
				/>
			</KubioPopup>

			{ showReset && (
				<Button
					isSmall
					icon={ ResetIcon }
					label={ __( 'Reset', 'kubio' ) }
					className={
						'kubio-popover-options-icon kubio-color-indicator-popover-reset-icon'
					}
					onClick={ onReset }
				/>
			) }
		</div>
	);
};

const ColorIndicatorPopover = ( {
	color,
	value,
	onChange,
	alpha = true,
	label = null,
	showReset = false,
	onReset,
	showPalette = true,
	returnRawValue = false,
	disabled = false,
	hasButton = false,
	buttonText = null,
	buttonIcon,
} ) => {
	const onResetDefault = () => {
		onChange( UNSET_VALUE );
	};
	value = value || color;
	onReset = onReset || onResetDefault;

	return (
		<>
			{ label && (
				<BaseControl
					className={ classnames(
						'kubio-color-popover-control',
						'kubio-control'
					) }
				>
					<div className={ 'kubio-color-popover-labeled' }>
						<div
							className={ 'kubio-color-popover-label' }
							title={ label }
						>
							{ label }
						</div>
						<IndicatorPopover
							alpha={ alpha }
							onChange={ onChange }
							color={ value }
							showReset={ showReset }
							onReset={ onReset }
							showPalette={ showPalette }
							returnRawValue={ returnRawValue }
							disabled={ disabled }
							hasButton={ hasButton }
							buttonIcon={ buttonIcon }
							buttonText={ buttonText }
						/>
					</div>
				</BaseControl>
			) }
			{ ! label && (
				<IndicatorPopover
					alpha={ alpha }
					onChange={ onChange }
					color={ value }
					showReset={ showReset }
					onReset={ onReset }
					showPalette={ showPalette }
					returnRawValue={ returnRawValue }
					disabled={ disabled }
					hasButton={ hasButton }
					buttonIcon={ buttonIcon }
					buttonText={ buttonText }
				/>
			) }
		</>
	);
};

export default ColorIndicatorPopover;
export { ColorIndicator };
