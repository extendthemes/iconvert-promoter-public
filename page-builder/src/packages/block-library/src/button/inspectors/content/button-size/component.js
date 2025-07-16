import { withColibriDataAutoSave, applyMultipleStyles } from '@kubio/core';

import { ToggleGroup } from '@kubio/controls';
import { buttonSizesDefaults } from './sizes';
import { ButtonWidth } from '../button-width/button-width';
import { properties } from '../../../config';
import { ElementsEnum } from '../../../elements';
import { __ } from '@wordpress/i18n';

const ButtonSize_ = ( { computed } ) => {
	const { buttonSize, showButtonWidth } = computed;
	return (
		<>
			<ToggleGroup
				label={ __( 'Button size', 'iconvert-promoter' ) }
				{ ...buttonSize }
			/>
			{ showButtonWidth && <ButtonWidth /> }
		</>
	);
};
const computed = ( dataHelper ) => {
	const setButtonSize = ( size ) => {
		if ( buttonSizesDefaults[ size ] ) {
			applyMultipleStyles( buttonSizesDefaults[ size ], dataHelper );
		}
	};

	const onButtonSizeChange = ( size ) => {
		dataHelper.setPropInMedia( 'buttonSize', size );
		resetStyle( size );
		setButtonSize( size );
	};

	const resetStyle = ( size ) => {
		const outerOptions = {
			styledComponent: ElementsEnum.OUTER,
			unset: true,
		};
		if ( size !== 'custom' ) {
			dataHelper.setStyle( 'width', null, outerOptions );
			dataHelper.setPropInMedia( 'buttonWidth', 'fitToContent' );
		}
	};

	const buttonSizeValue = dataHelper.getPropInMedia( 'buttonSize' );
	const showButtonWidth =
		buttonSizeValue === properties.buttonSize.values.CUSTOM;
	const buttonSize = {
		value: buttonSizeValue,
		onChange: onButtonSizeChange,
		options: window.isKubioBlockEditor
			? properties.buttonSize.options
			: properties.buttonSize.optionsInitials,
	};
	return {
		buttonSize,
		showButtonWidth,
	};
};

const ButtonSize = withColibriDataAutoSave( computed )( ButtonSize_ );
export { ButtonSize };
