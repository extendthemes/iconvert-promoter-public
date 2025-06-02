import { StyleInspectorControls } from '@kubio/inspectors';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { __ } from '@wordpress/i18n';
import { ElementsEnum } from '../../elements';
import { useInheritedTypographyValue } from '@kubio/global-data';

import {
	KubioPanelBody,
	RangeWithUnitWithPath,
	VerticalAlignControlWithPath,
	HorizontalAlignControlWithPath,
	SeparatorHorizontalLine,
	SelectControlWithPath,
	ToggleGroup,
	RangeWithUnitControl,
	ToggleGroupWithPath,
	CustomHeightControl,
	TinymceControlWithPath,
	ToggleControlWithPath,
	IconPickerWithPath,
	GradientColorPickerWithPath,
	ColorWithPath,
	TypographyControlPopupWithPath,
	BordersAndRadiusWithPath,
	BoxShadowWithPath,
	GutentagSelectControl,
} from '@kubio/controls';
import { useMemo, useState } from '@wordpress/element';

const pickerStateValues = {
	NORMAL: 'normal',
	HOVER: 'hover',
};

const pickerStateOptions = [
	{
		value: pickerStateValues.NORMAL,
		label: __( 'Normal', 'iconvert-promoter' ),
	},
	{
		value: pickerStateValues.HOVER,
		label: __( 'Hover', 'iconvert-promoter' ),
	},
];

const iconPositionValues = {
	AFTER: 'after',
	BEFORE: 'before',
};

const iconPositionOptions = [
	{
		label: __( 'After', 'iconvert-promoter' ),
		value: iconPositionValues.AFTER,
	},
	{
		label: __( 'Before', 'iconvert-promoter' ),
		value: iconPositionValues.BEFORE,
	},
];

const ButtonLinkStyle = ( { buttonType, dataHelper, ...props } ) => {
	const [ pickersState, setPickersState ] = useState(
		pickerStateValues.NORMAL
	);

	const buttonStyledComponent =
		buttonType === 'yes' ? ElementsEnum.YES_BUTTON : ElementsEnum.NO_BUTTON;

	const defaultTextColors = {
		normal: useInheritedTypographyValue( 'a', 'color' ),
		hover: useInheritedTypographyValue( 'a', 'states.hover.color' ),
	};

	const componentStatedStyleOptions = useMemo(
		() => ( {
			style: buttonStyledComponent,
			state: pickersState,
			type: WithDataPathTypes.STYLE,
		} ),
		[ buttonStyledComponent, pickersState ]
	);

	return (
		<>
			<ToggleGroup
				options={ pickerStateOptions }
				value={ pickersState }
				onChange={ ( nextState ) => setPickersState( nextState ) }
			/>
			<GradientColorPickerWithPath
				label={ __( 'Background', 'iconvert-promoter' ) }
				path={ 'background' }
				{ ...componentStatedStyleOptions }
			/>
			<ColorWithPath
				label={ __( 'Text color', 'iconvert-promoter' ) }
				path={ 'typography.color' }
				defaultValue={ defaultTextColors[ pickersState ] }
				{ ...componentStatedStyleOptions }
			/>
			<ColorWithPath
				label={ __( 'Border color', 'iconvert-promoter' ) }
				path={ [
					'border.top.color',
					'border.bottom.color',
					'border.left.color',
					'border.right.color',
				] }
				{ ...componentStatedStyleOptions }
			/>
			<SeparatorHorizontalLine />
			<TypographyControlPopupWithPath
				path={ 'typography' }
				type={ WithDataPathTypes.STYLE }
				style={ buttonStyledComponent }
			/>
			<SeparatorHorizontalLine />
			<BordersAndRadiusWithPath
				path={ 'border' }
				type={ WithDataPathTypes.STYLE }
				style={ buttonStyledComponent }
				withColor={ false }
			/>
			<SeparatorHorizontalLine />
			<BoxShadowWithPath
				path={ 'boxShadow' }
				type={ WithDataPathTypes.STYLE }
				style={ buttonStyledComponent }
			/>
		</>
	);
};

const ButtonIconStyle = ( { buttonType, dataHelper } ) => {
	const buttonStyledComponent =
		buttonType === 'yes' ? ElementsEnum.YES_BUTTON : ElementsEnum.NO_BUTTON;

	const buttonStyledIconComponent =
		buttonType === 'yes' ? ElementsEnum.YES_ICON : ElementsEnum.NO_ICON;

	const iconRootAttr = buttonType === 'yes' ? 'yesIcon' : 'noIcon';

	const iconPositionPath = `${ iconRootAttr }.position`;

	const iconPosition = {
		value: dataHelper.getAttribute(
			iconPositionPath,
			iconPositionValues.AFTER
		),
		onChange: ( event ) => {
			dataHelper.setAttribute( iconPositionPath, event );

			const oldMargin = dataHelper.getStyle(
				'margin',
				{},
				{ styledComponent: buttonStyledIconComponent }
			);

			let left = {
				value: 0,
				unit: 'px',
			};

			let right = {
				value: 0,
				unit: 'px',
			};

			if ( event === iconPositionValues.AFTER ) {
				left = oldMargin?.right;
			}

			if ( event === iconPositionValues.BEFORE ) {
				right = oldMargin?.left;
			}

			dataHelper.setStyle(
				'margin',
				{
					left,
					right,
				},
				{
					styledComponent: buttonStyledIconComponent,
				}
			);
		},
	};

	let positionPath = null;
	if ( iconPosition.value === iconPositionValues.AFTER ) {
		positionPath = 'margin.left';
	} else {
		positionPath = 'margin.right';
	}

	const iconSpacing = {
		value: dataHelper.getStyle(
			positionPath,
			{},
			{
				styledComponent: buttonStyledIconComponent,
			}
		),
		onChange: ( event ) =>
			dataHelper.setStyle( positionPath, event, {
				styledComponent: buttonStyledIconComponent,
			} ),
	};

	const defaultColors = useInheritedTypographyValue( 'a' );
	const linkColor = dataHelper.getStyle( 'typography.color', null, {
		styledComponent: buttonStyledComponent,
	} );
	const linkHoverColor = dataHelper.getStyle( 'typography.color', null, {
		styledComponent: buttonStyledComponent,
		state: 'hover',
	} );

	const iconColor =
		dataHelper.getStyle( 'fill', null, {
			style: buttonStyledIconComponent,
		} ) ||
		linkColor ||
		defaultColors.color;
	const iconHoverColor =
		dataHelper.getStyle( 'fill', null, {
			state: 'hover',
			styledComponent: buttonStyledIconComponent,
		} ) ||
		linkHoverColor ||
		defaultColors.states.hover.color;

	return (
		<>
			<RangeWithUnitWithPath
				label={ __( 'Icon size', 'iconvert-promoter' ) }
				path={ 'size' }
				max={ 30 }
				capMax={ false }
				capMin={ true }
				type={ WithDataPathTypes.STYLE }
				style={ buttonStyledIconComponent }
			/>

			<ColorWithPath
				label={ __( 'Icon color', 'iconvert-promoter' ) }
				path={ 'fill' }
				type={ WithDataPathTypes.STYLE }
				style={ buttonStyledIconComponent }
				defaultValue={ iconColor }
			/>

			<ColorWithPath
				label={ __( 'Icon hover color', 'iconvert-promoter' ) }
				path={ 'fill' }
				state={ 'hover' }
				type={ WithDataPathTypes.STYLE }
				style={ buttonStyledIconComponent }
				defaultValue={ iconHoverColor }
			/>

			<GutentagSelectControl
				label={ __( 'Icon position', 'iconvert-promoter' ) }
				options={ iconPositionOptions }
				{ ...iconPosition }
			/>

			<RangeWithUnitControl
				label={ __( 'Icon spacing', 'iconvert-promoter' ) }
				capMax={ false }
				max={ 50 }
				{ ...iconSpacing }
			/>
		</>
	);
};

const ButtonStyle = ( { buttonType, dataHelper } ) => {
	const panelLabel =
		buttonType === 'yes'
			? __( 'Yes button style', 'iconvert-promoter' )
			: __( 'No button style', 'iconvert-promoter' );

	const iconRootAttr = buttonType === 'yes' ? 'yesIcon' : 'noIcon';
	const showIconPath = `${ iconRootAttr }.show`;
	const showIcon = dataHelper.getAttribute( showIconPath, false );

	return (
		<KubioPanelBody title={ panelLabel } initialOpen={ true }>
			<ButtonLinkStyle
				buttonType={ buttonType }
				dataHelper={ dataHelper }
			/>

			{ showIcon && (
				<ButtonIconStyle
					buttonType={ buttonType }
					dataHelper={ dataHelper }
				/>
			) }
		</KubioPanelBody>
	);
};

const Panel = ( props ) => {
	return (
		<>
			<ButtonStyle { ...props } buttonType="yes" />
			<ButtonStyle { ...props } buttonType="no" />
		</>
	);
};

const useComputed = ( dataHelper ) => {
	return {};
};

const StyleComponent = withComputedData( useComputed )( Panel );

export const StyleInspector = () => {
	return (
		<StyleInspectorControls>
			<StyleComponent />
		</StyleInspectorControls>
	);
};
