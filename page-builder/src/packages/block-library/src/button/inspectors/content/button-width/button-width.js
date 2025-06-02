import {
	buttonWidth as buttonWidthConfig,
	widthOptions,
	buttonTextAlignOptions,
} from './config';
import {
	useOwnerDocumentContext,
	withColibriDataAutoSave,
	WithDataPathTypes,
} from '@kubio/core';
import { __ } from '@wordpress/i18n';
import { properties } from '../../../config';

import {
	RangeWithUnitControl,
	GutentagSelectControl,
	HorizontalFlexAlignControlWithPath,
} from '@kubio/controls';
import { getPreviewElementByModelId, toFixedNoRounding } from '@kubio/utils';
import { useBlockEditContext } from '@wordpress/block-editor';
import { ElementsEnum } from '../../../elements';
import { compose } from '@wordpress/compose';

const ButtonWidth_ = ( { computed } ) => {
	const {
		buttonWidth,
		width,
		buttonWidthIs,
		horizontalPadding,
		verticalPadding,
	} = computed;
	return (
		<>
			<GutentagSelectControl
				label={ __( 'Button width', 'iconvert-promoter' ) }
				{ ...buttonWidth }
				options={ buttonWidthConfig.options }
			/>
			{ buttonWidthIs.custom && (
				<RangeWithUnitControl
					{ ...widthOptions }
					{ ...width }
					label={ __( 'Width', 'iconvert-promoter' ) }
					allowReset={ false }
				/>
			) }

			{ buttonWidthIs.fit && (
				<RangeWithUnitControl
					label={ __( 'Horizontal padding', 'iconvert-promoter' ) }
					{ ...properties.horizontalPaddingOptions }
					{ ...horizontalPadding }
					allowReset={ false }
				/>
			) }

			<RangeWithUnitControl
				label={ __( 'Vertical padding', 'iconvert-promoter' ) }
				{ ...properties.verticalPaddingOptions }
				{ ...verticalPadding }
				allowReset={ false }
			/>
			{ buttonWidthIs.custom && (
				<>
					<HorizontalFlexAlignControlWithPath
						label={ __( 'Text align', 'iconvert-promoter' ) }
						path="justifyContent"
						options={ buttonTextAlignOptions }
						type={ WithDataPathTypes.STYLE }
						style={ ElementsEnum.LINK }
					/>
				</>
			) }
		</>
	);
};

const useComputed = ( dataHelper ) => {
	const buttonWidthValues = buttonWidthConfig.values;
	const { clientId } = useBlockEditContext();
	const setStyleButton = ( event ) => {
		if ( event === buttonWidthValues.CUSTOM ) {
			dataHelper.setStyle( 'padding.left', null, { unset: true } );
			dataHelper.setStyle( 'padding.right', null, { unset: true } );
		} else {
			const savedHorizontalPadding = dataHelper.getPropInMedia(
				'customWidth.lastHorizontalPadding'
			);
			dataHelper.setStyle( 'padding', savedHorizontalPadding );
			dataHelper.setStyle( 'textAlign', null, { unset: true } );
		}
	};
	const { ownerDocument } = useOwnerDocumentContext();
	const getButtonWidth = () => {
		const node = getPreviewElementByModelId( clientId, ownerDocument );
		if ( ! node ) {
			return 0;
		}
		const style = window.getComputedStyle( node );
		return toFixedNoRounding(
			parseFloat( style.getPropertyValue( 'width' ) ),
			2
		);
	};
	const buttonWidth = {
		value: dataHelper.getPropInMedia( 'buttonWidth' ),
		onChange: ( type ) => {
			if ( type === buttonWidthValues.CUSTOM ) {
				const currentWidth = getButtonWidth();
				dataHelper.setStyle(
					'width',
					{ unit: 'px', value: currentWidth },
					{ styledComponent: 'outer' }
				);
				const currentPadding = dataHelper.getStyle( 'padding' );
				const horizontalPadding = {
					left: currentPadding?.left,
					right: currentPadding?.right,
				};
				dataHelper.setPropInMedia(
					'customWidth.lastHorizontalPadding',
					horizontalPadding
				);
			} else {
				dataHelper.setStyle( 'width', null, {
					styledComponent: 'outer',
					unset: true,
				} );
			}
			dataHelper.setPropInMedia( 'buttonWidth', type );
			setStyleButton( type );
		},
	};

	const buttonWidthIs = {
		fit: buttonWidthValues.FIT_TO_CONTENT === buttonWidth.value,
		custom: buttonWidthValues.CUSTOM === buttonWidth.value,
	};

	const horizontalPadding = {
		value: dataHelper.getStyle( 'padding.left' ),
		onChange: ( event ) => {
			const data = {
				left: event,
				right: event,
			};
			dataHelper.setStyle( 'padding', data );
		},
	};
	const verticalPadding = {
		value: dataHelper.getStyle( 'padding.top' ),
		onChange: ( event ) => {
			const data = {
				top: event,
				bottom: event,
			};
			dataHelper.setStyle( 'padding', data );
		},
	};
	return {
		buttonWidthIs,
		buttonWidth,
		horizontalPadding,
		verticalPadding,
		width: dataHelper.useStylePath( 'width', { styledComponent: 'outer' } ),
	};
};

const ButtonWidth = compose( withColibriDataAutoSave( useComputed ) )(
	ButtonWidth_
);
export { ButtonWidth };
