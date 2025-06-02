import { __ } from '@wordpress/i18n';

import {
	BordersAndRadiusWithPath,
	GradientColorPickerWithPath,
	SeparatorHorizontalLine,
	BoxShadowWithPath,
	BoxUnitValueControlWithPath,
	BackgroundControlWithPath,
	KubioPanelBody,
} from '@kubio/controls';

import { withComputedData, WithDataPathTypes } from '@kubio/core';

import { ElementsEnum } from '../../elements';
import { VerticalAlignValues } from '../../config';

const Panel_ = ( { computed } ) => {
	const { popupType, contentPosition, showPopupOverlayOptions } = computed;
	const containerOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.CONTAINER,
	};
	const outerOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.OUTER,
	};
	return (
		<>
			<KubioPanelBody
				title={ __( 'Popup Container', 'iconvert-promoter' ) }
				initialOpen={ true }
			>
				<BackgroundControlWithPath
					type={ WithDataPathTypes.STYLE }
					path={ 'background' }
					filters={ {
						showOverlayOptions: true,
					} }
					{ ...containerOptions }
				/>
				<SeparatorHorizontalLine />
				<BoxUnitValueControlWithPath
					label={ __( 'Padding', 'iconvert-promoter' ) }
					path={ 'padding' }
					capMin={ true }
					min={ 0 }
					{ ...containerOptions }
				/>
				<BordersAndRadiusWithPath
					path={ 'border' }
					{ ...containerOptions }
				/>
				<BoxShadowWithPath
					path={ 'boxShadow' }
					{ ...containerOptions }
				/>
			</KubioPanelBody>
			{ showPopupOverlayOptions && (
				<KubioPanelBody
					title={ __( 'Popup Overlay', 'iconvert-promoter' ) }
					initialOpen={ false }
				>
					<BackgroundControlWithPath
						type={ WithDataPathTypes.STYLE }
						path={ 'background' }
						{ ...outerOptions }
					/>
				</KubioPanelBody>
			) }
		</>
	);
};

const computed = ( dataHelper ) => {
	const popupType = dataHelper.getAttribute( 'popup_type' );
	const contentPosition = dataHelper.getAttribute( 'contentPosition' );
	const contentAlign = dataHelper.getAttribute( 'align' );

	const showPopupOverlayOptions =
		popupType !== 'inline-promotion-bar' &&
		( popupType === 'floating-bar'
			? contentPosition !== 'above-content' ||
			  contentAlign === VerticalAlignValues.BOTTOM
			: true );

	return {
		popupType,
		contentPosition,
		showPopupOverlayOptions,
	};
};
const Panel = withComputedData( computed )( Panel_ );
export default Panel;
