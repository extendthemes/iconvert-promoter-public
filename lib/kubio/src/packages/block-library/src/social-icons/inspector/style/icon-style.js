import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { ElementsEnum } from '../../blocks/social-icon/elements';
import { ElementsEnum as parentElementsEnum } from '../../elements';
import { UNSET_VALUE } from '@kubio/constants';
import {
	SeparatorHorizontalLine,
	ColorIndicatorPopover,
	BordersAndRadiusWithPath,
	ToggleGroup,
	GradientColorPickerWithPath,
	GutentagSelectControl,
	KubioPanelBody,
	ControlNotice,
	ColorWithPath,
	RangeWithUnitWithPath,
} from '@kubio/controls';

import { properties } from './config';

const commonOptions = {
	type: WithDataPathTypes.STYLE,
	style: ElementsEnum.ICON,
};

const ComponentPanel = ( props ) => {
	const { computed } = props;

	const {
		iconSpacing,
		iconPadding,
		styleType,
		fillColor,
		iconSize,
		currentState,
		setCurrentState,
		showOptions,
	} = computed;

	return (
		<>
			<KubioPanelBody
				title={ __( 'Icons', 'kubio' ) }
				initialOpen={ true }
			>
				<GutentagSelectControl
					label={ __( 'Style type', 'kubio' ) }
					options={ properties.styleTypeOptions }
					{ ...styleType }
				/>

				{ showOptions && (
					<>
						<SeparatorHorizontalLine fit={ false } />

						<ToggleGroup
							label={ __( 'State', 'kubio' ) }
							options={ properties.stateToggle.options }
							value={ currentState }
							onChange={ setCurrentState }
						/>

						{ styleType.value === 'shared' && (
							<ColorIndicatorPopover
								label={ __( 'Icon color', 'kubio' ) }
								showReset={ true }
								state={ currentState }
								{ ...fillColor }
							/>
						) }

						<GradientColorPickerWithPath
							label={ __( 'Icon background', 'kubio' ) }
							showReset={ true }
							path={ 'background' }
							state={ currentState }
							{ ...commonOptions }
						/>

						<ColorWithPath
							label={ __( 'Border color', 'kubio' ) }
							showReset={ true }
							path={ [
								'border.top.color',
								'border.bottom.color',
								'border.left.color',
								'border.right.color',
							] }
							{ ...commonOptions }
							state={ currentState }
						/>

						<SeparatorHorizontalLine fit={ false } />

						<RangeWithUnitWithPath
							label={ __( 'Icon size', 'kubio' ) }
							capMin={ true }
							path={ 'size' }
							style={ ElementsEnum.ICON }
							{ ...iconSize }
						/>

						<RangeWithUnitWithPath
							label={ __( 'Icon spacing', 'kubio' ) }
							max={ 50 }
							path={ 'margin.right' }
							style={ ElementsEnum.ICON }
							{ ...iconSpacing }
						/>

						<RangeWithUnitWithPath
							label={ __( 'Icon padding', 'kubio' ) }
							capMin={ true }
							path={ [
								'padding.top',
								'padding.bottom',
								'padding.left',
								'padding.right',
							] }
							max={ 50 }
							style={ ElementsEnum.ICON }
							{ ...iconPadding }
						/>

						<SeparatorHorizontalLine fit={ false } />

						<BordersAndRadiusWithPath
							type="style"
							style={ ElementsEnum.ICON }
							path={ 'border' }
							withColor={ false }
						/>
					</>
				) }

				{ ! showOptions && (
					<ControlNotice
						label={ __( 'Info', 'kubio' ) }
						content={ __(
							'Please select an icon to style it',
							'kubio'
						) }
					/>
				) }
			</KubioPanelBody>
		</>
	);
};

const useComputed = ( dataHelper ) => {
	const kids = dataHelper.withChildren();

	const [ currentState, setCurrentState ] = useState(
		properties.stateToggle.values.NORMAL
	);

	const commonStoreOptions = {
		styledComponent: parentElementsEnum.ICON,
		state: 'normal',
	};

	// use this options object for color settings since they are affected by state.
	const colorStoreOptions = {
		styledComponent: parentElementsEnum.ICON,
		state: currentState,
	};

	const setFillInBothStates = function ( color, store ) {
		store.setStyle( 'fill', color, {
			styledComponent: parentElementsEnum.ICON,
			state: 'normal',
		} );
		store.setStyle( 'fill', color, {
			styledComponent: parentElementsEnum.ICON,
			state: 'hover',
		} );
	};

	const setOfficialColors = () => {
		setFillInBothStates( UNSET_VALUE, dataHelper );

		kids.forEach( ( child ) => {
			const tmp = child.getAttribute( 'icon' );
			const iconName = tmp.name.split( '/' ).pop();
			const colorProp = properties.objectColorIcons.find( ( elem ) =>
				iconName.startsWith( elem.name )
			); 
			
			if ( typeof colorProp?.color === 'undefined' ) {
				return;
			}

			child.setProp( 'styleType', 'official' );
			setFillInBothStates( colorProp.color, child );
		} );
	};

	const styleType = {
		value: dataHelper.getProp( 'styleType' ),
		onChange: ( newColorType ) => {
			const { icon } = dataHelper.sharedData.style.descendants;

			dataHelper.setProp( 'styleType', newColorType );

			switch ( newColorType ) {
				case 'official':
					setOfficialColors();
					break;
				case 'individual':
					// iterate through child components and copy the style from component.
					// also, update the styleType the same as the parent.
					kids.forEach( ( child ) => {
						child.setStyle( '', icon, commonStoreOptions );
						child.setProp( 'styleType', 'individual' );
					} );
					dataHelper.unsetStyle( '', null, commonStoreOptions );
					break;

				case 'shared':
					const currentStyle =
						kids[ 0 ].sharedData.style?.descendants?.icon;
					kids.forEach( ( child ) => {
						child.setProp( 'styleType', 'individual' );
						child.setStyle( '', null, commonStoreOptions );
					} );
					dataHelper.setStyle( '', currentStyle, commonStoreOptions );
					break;

				default:
					break;
			}
		},
	};

	const fillColor = {
		value: dataHelper.getStyle( 'fill', null, colorStoreOptions ),
		onChange: ( newColor ) => {
			dataHelper.setStyle( 'fill', newColor, colorStoreOptions );
		},
	};

	const iconSize = {
		value: dataHelper.getStyle( 'size', null, commonStoreOptions ),
	};

	const iconSpacing = {
		value: dataHelper.getStyle( 'margin.right', null, commonStoreOptions ),
	};

	const iconPadding = {
		value: dataHelper.getStyle( 'padding.right', null, commonStoreOptions ),
	};

	const showOptions = styleType.value !== 'individual';

	return {
		iconSpacing,
		iconPadding,
		styleType,
		iconSize,
		fillColor,
		currentState,
		setCurrentState,
		showOptions,
	};
}; //-useComputed()

const Component = withComputedData( useComputed )( ComponentPanel );
export default Component;
