import { __, sprintf } from '@wordpress/i18n';

import {
	HorizontalAlignControlWithPath,
	IconPickerWithPath,
	KubioPanelBody,
	RangeWithUnitWithPath,
	SelectControlWithPath,
	TinymceControlWithPath,
	ToggleControlWithPath,
	ToggleGroup,
	LinkControlWithData,
	SeparatorHorizontalLine,
	ToggleControl,
} from '@kubio/controls';
import {
	WithDataPathTypes,
	applyMultipleStyles,
	withColibriDataAutoSave,
} from '@kubio/core';
import { ElementsEnum } from '../../elements';

import { ContentInspectorControls } from '@kubio/inspectors';

import { getBlocksMap } from '@kubio/block-library';
import { useMemo } from '@wordpress/element';
import { BaseControl, Button } from '@wordpress/components';
import { useContentViewState } from '../../toolbar';

const buttonPositionOptions = [
	{ label: __( 'Horizontal', 'iconvert-promoter' ), value: 'row' },
	{
		label: __( 'Vertical', 'iconvert-promoter' ),
		value: 'column',
	},
];

const ButtonsGroupPanel = ( props ) => {
	const {
		buttonsPosition,
		buttonsAlignProp,
		onButtonsPositionChange,
		isOrderReversed,
		onReverseButtonsOrder,
	} = props.computed;

	return (
		<KubioPanelBody
			title={ __( 'Buttons', 'iconvert-promoter' ) }
			initialOpen={ true }
		>
			<ToggleGroup
				options={ buttonPositionOptions }
				label={ __( 'Buttons position', 'iconvert-promoter' ) }
				value={ buttonsPosition }
				onChange={ onButtonsPositionChange }
			/>

			<ToggleControl
				label={ __( 'Reverse buttons order', 'iconvert-promoter' ) }
				value={ isOrderReversed }
				onChange={ onReverseButtonsOrder }
			/>

			<HorizontalAlignControlWithPath
				path={ buttonsAlignProp }
				type={ WithDataPathTypes.STYLE }
				label={ __( 'Buttons align', 'iconvert-promoter' ) }
				style={ ElementsEnum.BUTTONS_CONTAINER }
			/>
			<RangeWithUnitWithPath
				label={ __( 'Space between buttons', 'iconvert-promoter' ) }
				type={ WithDataPathTypes.STYLE }
				style={ ElementsEnum.BUTTONS_CONTAINER }
				path="gap"
				min={ 0 }
				max={ 100 }
			/>
		</KubioPanelBody>
	);
};

const editorSettings = {
	toolbar1: 'bold,italic',
};

const BlocksMap = getBlocksMap();
const button = BlocksMap?.button;
const buttonComponents = button?.Components || {};
const {
	ButtonSizeBase,
	buttonSizesDefaults,
	buttonSizeConfig,
	buttonWidthConfig,
} = buttonComponents;

const ButtonOptions = ( props ) => {
	const { buttonType, dataHelper } = props;

	const [ , setViewState ] = useContentViewState( dataHelper );

	const panelLabel =
		buttonType === 'yes'
			? __( 'Yes button', 'iconvert-promoter' )
			: __( 'No button', 'iconvert-promoter' );

	const textAttribute = buttonType === 'yes' ? 'yesText' : 'noText';
	const actionAttribute = buttonType === 'yes' ? 'yesAction' : 'noAction';
	const linkValueAttribute = buttonType === 'yes' ? 'yesLink' : 'noLink';

	const iconRootAttr = buttonType === 'yes' ? 'yesIcon' : 'noIcon';

	const showIconPath = `${ iconRootAttr }.show`;
	const showIcon = dataHelper.getAttribute( showIconPath, false );

	const buttonSizeComputed = useMemo( () => {
		const buttonComponent =
			buttonType === 'yes'
				? ElementsEnum.YES_BUTTON
				: ElementsEnum.NO_BUTTON;
		const buttonIconComponent =
			buttonType === 'yes' ? ElementsEnum.YES_ICON : ElementsEnum.NO_ICON;

		const buttonSizeProp =
			buttonType === 'yes' ? 'yesButtonSize' : 'noButtonSize';

		const buttonWidthProp = buttonType === 'yes' ? 'yesWidth' : 'noWidth';
		const customButtonWidthProp =
			buttonType === 'yes' ? 'yesCustomWidth' : 'noCustomWidth';

		const setButtonSize = ( size ) => {
			if ( buttonSizesDefaults[ size ] ) {
				const sizes = buttonSizesDefaults[ size ];
				applyMultipleStyles(
					{
						descendants: {
							[ buttonComponent ]: sizes.descendants.link,
							[ buttonIconComponent ]: sizes.descendants.icon,
						},
					},
					dataHelper
				);
			}
		};

		const resetStyle = ( size ) => {
			const options = {
				styledComponent: buttonComponent,
				unset: true,
			};
			if ( size !== 'custom' ) {
				dataHelper.setStyle( 'width', null, options );
				dataHelper.setPropInMedia(
					buttonWidthProp,
					'fitToContent',
					options
				);
			}
		};

		const onButtonSizeChange = ( size ) => {
			dataHelper.setPropInMedia( buttonSizeProp, size );
			resetStyle( size );
			setButtonSize( size );
		};

		const buttonSizeValue = dataHelper.getPropInMedia( buttonSizeProp );

		const showButtonWidth = buttonSizeValue === 'custom';

		const setStyleButton = ( event ) => {
			if ( event === buttonWidthConfig.values.CUSTOM ) {
				dataHelper.setStyle( 'padding.left', null, {
					unset: true,
					styledComponent: buttonComponent,
				} );
				dataHelper.setStyle( 'padding.right', null, {
					unset: true,
					styledComponent: buttonComponent,
				} );
			} else {
				const savedHorizontalPadding = dataHelper.getPropInMedia(
					`${ customButtonWidthProp }.lastHorizontalPadding`
				);
				dataHelper.setStyle( 'padding', savedHorizontalPadding, {
					styledComponent: buttonComponent,
				} );
				dataHelper.setStyle( 'textAlign', null, {
					unset: true,
					styledComponent: buttonComponent,
				} );
			}
		};

		const buttonWidth = {
			value: dataHelper.getPropInMedia( buttonWidthProp, 'custom' ),
			onChange: ( type ) => {
				if ( type === buttonWidthConfig.values.CUSTOM ) {
					dataHelper.setStyle(
						'width',
						{ unit: 'px', value: 200 },
						{ styledComponent: buttonComponent }
					);
					const currentPadding = dataHelper.getStyle(
						'padding',
						{},
						{
							styledComponent: buttonComponent,
						}
					);
					const horizontalPadding = {
						left: currentPadding?.left,
						right: currentPadding?.right,
					};

					dataHelper.setPropInMedia(
						`${ customButtonWidthProp }.lastHorizontalPadding`,
						horizontalPadding
					);
				} else {
					dataHelper.setStyle( 'width', null, {
						styledComponent: buttonComponent,
						unset: true,
					} );
				}
				dataHelper.setPropInMedia( buttonWidthProp, type );
				setStyleButton( type );
			},
		};

		const verticalPadding = {
			value: dataHelper.getStyle(
				'padding.top',
				{},
				{
					styledComponent: buttonComponent,
				}
			),
			onChange: ( event ) => {
				const data = {
					top: event,
					bottom: event,
				};
				dataHelper.setStyle( 'padding', data, {
					styledComponent: buttonComponent,
				} );
			},
		};

		const horizontalPadding = {
			value: dataHelper.getStyle(
				'padding.left',
				{},
				{
					styledComponent: buttonComponent,
				}
			),
			onChange: ( event ) => {
				const data = {
					left: event,
					right: event,
				};
				dataHelper.setStyle( 'padding', data, {
					styledComponent: buttonComponent,
				} );
			},
		};

		return {
			buttonSize: {
				value: buttonSizeValue,
				onChange: onButtonSizeChange,
				options: buttonSizeConfig.options,
			},
			showButtonWidth,
			buttonWidth: {
				buttonWidthIs: {
					fit:
						buttonWidthConfig.values.FIT_TO_CONTENT ===
						buttonWidth.value,
					custom:
						buttonWidthConfig.values.CUSTOM === buttonWidth.value,
				},
				buttonWidth,
				verticalPadding,
				horizontalPadding,
				width: dataHelper.useStylePath( 'width', {
					styledComponent: buttonComponent,
				} ),
				textAlign: dataHelper.useStylePath( 'justifyContent', {
					styledComponent: buttonComponent,
				} ),
			},
		};
	}, [ dataHelper, buttonType ] );

	const currentAction = dataHelper.getAttribute( actionAttribute, 'content' );

	return (
		<KubioPanelBody title={ panelLabel } initialOpen={ false }>
			<TinymceControlWithPath
				label={ __( 'Button text', 'iconvert-promoter' ) }
				path={ textAttribute }
				type={ WithDataPathTypes.ATTRIBUTE }
				editorSettings={ editorSettings }
			/>
			<SelectControlWithPath
				label={ __( 'Type', 'iconvert-promoter' ) }
				options={ [
					{ label: 'Custom content', value: 'content' },
					{ label: 'Close Popup', value: 'close' },
					{ label: 'Link', value: 'link' },
				] }
				type={ WithDataPathTypes.ATTRIBUTE }
				path={ actionAttribute }
			/>

			{ currentAction === 'content' && (
				<BaseControl>
					<Button
						isPrimary
						onClick={ () => setViewState( buttonType ) }
						className="kubio-button-100"
					>
						{ sprintf(
							// translators: %s is a placeholder 'Yes Button' or 'No Button'
							__( 'Edit "%s" content', 'iconvert-promoter' ),
							buttonType === 'yes' ? 'Yes Button' : 'No Button'
						) }
					</Button>
				</BaseControl>
			) }

			{ currentAction === 'link' && (
				<LinkControlWithData
					label={ __( 'Button link', 'iconvert-promoter' ) }
					__linkDataProp={ linkValueAttribute }
				/>
			) }
			<SeparatorHorizontalLine />

			<ToggleControlWithPath
				label={ __( 'Display icon', 'iconvert-promoter' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path={ showIconPath }
				isProOnly={ false }
				upgradeUrlArgs={ { source: 'button', content: 'icon' } }
			/>
			{ showIcon && (
				<IconPickerWithPath
					path={ `${ iconRootAttr }.name` }
					type={ WithDataPathTypes.ATTRIBUTE }
				/>
			) }

			<ButtonSizeBase computed={ buttonSizeComputed } />
		</KubioPanelBody>
	);
};

const Panel = ( props ) => {
	return (
		<>
			<ButtonsGroupPanel { ...props } />
			<ButtonOptions { ...props } buttonType="yes" />
			<ButtonOptions { ...props } buttonType="no" />
		</>
	);
};

const getButtonsAlignProp = ( position ) => {
	switch ( position ) {
		case 'row':
			return {
				set: 'justifyContent',
				reset: 'alignItems',
			};
		case 'column':
			return {
				set: 'alignItems',
				reset: 'justifyContent',
			};
	}
};

const useComputed = ( dataHelper ) => {
	let buttonsPosition = dataHelper.getStyle( 'flexDirection', 'row', {
		styledComponent: ElementsEnum.BUTTONS_CONTAINER,
	} );

	const isOrderReversed = buttonsPosition.includes( '-reverse' );

	buttonsPosition = buttonsPosition.replace( '-reverse', '' );

	return {
		buttonsPosition,
		buttonsAlignProp: getButtonsAlignProp( buttonsPosition ).set,
		onButtonsPositionChange: ( value ) => {
			dataHelper.group( () => {
				value = isOrderReversed ? `${ value }-reverse` : value;
				const alignProps = getButtonsAlignProp( value );

				dataHelper.setStyle( 'flexDirection', value, {
					styledComponent: ElementsEnum.BUTTONS_CONTAINER,
				} );

				dataHelper.setStyle( alignProps.set, 'start', {
					styledComponent: ElementsEnum.BUTTONS_CONTAINER,
				} );

				dataHelper.setStyle( alignProps.reset, '', {
					styledComponent: ElementsEnum.BUTTONS_CONTAINER,
					unset: true,
				} );
			} );
		},

		isOrderReversed,
		onReverseButtonsOrder: ( value ) => {
			const newValue = value
				? `${ buttonsPosition }-reverse`
				: buttonsPosition;
			dataHelper.setStyle( 'flexDirection', newValue, {
				styledComponent: ElementsEnum.BUTTONS_CONTAINER,
			} );
		},
	};
};

const ContentComponent = withColibriDataAutoSave( useComputed )( Panel );

export const ContentInspector = ( props ) => {
	return (
		<ContentInspectorControls>
			<ContentComponent { ...props } />
		</ContentInspectorControls>
	);
};
