import {
	HorizontalTextAlignControlWithPath,
	IconPickerWithPath,
	InlineLabeledControl,
	InputControlWithPath,
	KubioPanelBody,
	RangeWithUnitControl,
	RangeWithUnitWithPath,
	SelectControlWithPath,
	SeparatorHorizontalLine,
	TinymceControlWithPath,
	ToggleControl,
	ToggleControlWithPath,
} from '@kubio/controls';
import {
	applyMultipleStyles,
	withColibriDataAutoSave,
	WithDataPathTypes,
} from '@kubio/core';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { iconPosition } from '../../config';
import { ElementsEnum } from '../../elements';

import apiFetch from '@wordpress/api-fetch';
import OnSuccessActions from './on-success';

import { getBlocksMap } from '@kubio/block-library';

const editorSettings = {
	link_assume_external_targets: true,
	link_default_protocol: 'https',
	link_title: false,
	toolbar1: 'bold,italic,link,kubioTags',
	statusbar: false,
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

const Panel = ( { computed, dataHelper } ) => {
	const {
		formId,
		formFields,
		formConsent,
		nameLabelDisplay,
		emailLabelDisplay,
		submitIconEnabled,
		submitIconPosition,
		submitIconSpace,
		formLayout,
		termsCheckboxSpacer,
		termsCheckboxSize,
	} = computed;

	const IconPicker = ( props ) => {
		if ( props.iconEnabled.value ) {
			return (
				<IconPickerWithPath
					path="submitIcon"
					type={ WithDataPathTypes.ATTRIBUTE }
				/>
			);
		}
		return '';
	};

	const { myFormsData } = useOnRemoteData();

	const formOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.CONTAINER,
	};

	const gapSpacer = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.GAPSPACER,
	};
	const gapUnitsOptions = [ { label: 'PX', value: 'px' } ];
	const gapUnitsConfig = {
		px: {
			min: 0,
			max: 30,
			step: 1,
		},
	};
	const gapOptions = {
		units: gapUnitsOptions,
		optionsByUnit: gapUnitsConfig,
	};
	const termsOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.TERMSCONTAINER,
	};
	const noticesOptions = {
		type: WithDataPathTypes.STYLE,
		style: [
			ElementsEnum.SUCCESS_NOTICE,
			ElementsEnum.INFO_NOTICE,
			ElementsEnum.ERROR_NOTICE,
		],
	};

	const buttonSizeComputed = useMemo( () => {
		const buttonComponent = ElementsEnum.SUBMITBUTTON;
		const buttonIconComponent = ElementsEnum.SUBMITICON;

		const buttonSizeProp = 'submitButtonSize';
		const buttonWidthProp = 'submitButtonWidth';
		const customButtonWidthProp = 'submitButtonCustomWidth';

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

		const buttonSizeValue = dataHelper.getPropInMedia(
			buttonSizeProp,
			buttonSizeConfig.values.CUSTOM
		);

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
			value: dataHelper.getPropInMedia(
				buttonWidthProp,
				buttonWidthConfig.values.FIT_TO_CONTENT
			),
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
	}, [ dataHelper ] );

	return (
		<>
			<KubioPanelBody
				title={ __( 'Subscribe form', 'iconvert-promoter' ) }
				initialOpen={ true }
			>
				<SelectControlWithPath
					label="Email list"
					value={ formId.value }
					options={ myFormsData }
					onChange={ formId.onChange }
				/>
				<SelectControlWithPath
					label={ __( 'Form fields', 'iconvert-promoter' ) }
					options={ [
						{ label: 'Name and email', value: 'name-email' },
						{ label: 'Email only', value: 'email' },
					] }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="formFields"
					value={ formFields.value }
					onChange={ formFields.onChange }
				/>
				<SelectControlWithPath
					label={ __( 'Form layout', 'iconvert-promoter' ) }
					options={ [
						{ label: 'Vertical', value: 'vertical' },
						{ label: 'Horizontal', value: 'horizontal' },
					] }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="formLayout"
					value={ formLayout.value }
					onChange={ formLayout.onChange }
				/>

				{ formLayout.value === 'horizontal' && (
					<>
						<SeparatorHorizontalLine />
						<ToggleControlWithPath
							label={ __(
								'Stack form fields on mobile',
								'iconvert-promoter'
							) }
							type={ WithDataPathTypes.ATTRIBUTE }
							path="stackOnMobile"
						/>
						{ computed.isStackOnMobile && (
							<HorizontalTextAlignControlWithPath
								label={ __(
									'Mobile align',
									'iconvert-promoter'
								) }
								path="textAlign"
								media="mobile"
								type={ WithDataPathTypes.STYLE }
								style={ ElementsEnum.MOBILE_STACK_CONTAINER }
							/>
						) }
					</>
				) }

				{ formLayout.value === 'vertical' && (
					<HorizontalTextAlignControlWithPath
						label={ __( 'Align', 'iconvert-promoter' ) }
						path="textAlign"
						{ ...formOptions }
					/>
				) }

				<SeparatorHorizontalLine />

				<RangeWithUnitWithPath
					label={ __( 'Space between fields', 'iconvert-promoter' ) }
					path={ 'gap' }
					{ ...gapOptions }
					{ ...gapSpacer }
				/>
			</KubioPanelBody>

			<OnSuccessActions />

			{ formFields.value === 'name-email' && (
				<KubioPanelBody
					title={ __( 'Name Field', 'iconvert-promoter' ) }
					initialOpen={ false }
				>
					<ToggleControlWithPath
						label={ __( 'Display label', 'iconvert-promoter' ) }
						type={ WithDataPathTypes.ATTRIBUTE }
						path="nameLabelDisplay"
					/>
					{ nameLabelDisplay === true && (
						<InputControlWithPath
							label={ __( 'Label', 'iconvert-promoter' ) }
							type={ WithDataPathTypes.ATTRIBUTE }
							path="nameLabel"
						/>
					) }
					<InputControlWithPath
						label={ __( 'Placeholder', 'iconvert-promoter' ) }
						type={ WithDataPathTypes.ATTRIBUTE }
						path="nameFieldPlaceholder"
					/>
				</KubioPanelBody>
			) }
			<KubioPanelBody
				title={ __( 'Email Field', 'iconvert-promoter' ) }
				initialOpen={ false }
			>
				<ToggleControlWithPath
					label={ __( 'Display label', 'iconvert-promoter' ) }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="emailLabelDisplay"
				/>
				{ emailLabelDisplay === true && (
					<InputControlWithPath
						label={ __( 'Label', 'iconvert-promoter' ) }
						type={ WithDataPathTypes.ATTRIBUTE }
						path="emailLabel"
					/>
				) }
				<InputControlWithPath
					label={ __( 'Placeholder', 'iconvert-promoter' ) }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="emailFieldPlaceholder"
				/>
			</KubioPanelBody>
			<KubioPanelBody
				title={ __( 'Terms Field', 'iconvert-promoter' ) }
				initialOpen={ false }
			>
				<ToggleControlWithPath
					label={ __( 'Enabled consent field', 'iconvert-promoter' ) }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="formConsent"
				/>
				{ formConsent === true && (
					<>
						<InputControlWithPath
							label={ __( 'Text', 'iconvert-promoter' ) }
							type={ WithDataPathTypes.ATTRIBUTE }
							path="termsLabel"
						/>
						<TinymceControlWithPath
							label={ __( 'Information', 'iconvert-promoter' ) }
							type={ WithDataPathTypes.ATTRIBUTE }
							path="termsDescription"
							editorSettings={ editorSettings }
						/>
						<RangeWithUnitControl
							label={ __( 'Checkbox size', 'iconvert-promoter' ) }
							min={ 13 }
							max={ 30 }
							capMax={ false }
							capMin={ true }
							{ ...termsCheckboxSize }
						/>
						<RangeWithUnitControl
							label={ __(
								'Checkbox distance',
								'iconvert-promoter'
							) }
							max={ 50 }
							capMax={ false }
							capMin={ true }
							{ ...termsCheckboxSpacer }
						/>
						<HorizontalTextAlignControlWithPath
							label={ __( 'Align', 'iconvert-promoter' ) }
							path="justifyContent"
							{ ...termsOptions }
						/>
					</>
				) }
			</KubioPanelBody>

			<KubioPanelBody
				title={ __( 'Submit Button', 'iconvert-promoter' ) }
				initialOpen={ false }
			>
				<InputControlWithPath
					label={ __( 'Text', 'iconvert-promoter' ) }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="submitText"
				/>

				<SeparatorHorizontalLine />

				<InlineLabeledControl
					label={ __( 'Display icon', 'iconvert-promoter' ) }
					className={ '' }
				>
					<ToggleControl
						value={ submitIconEnabled.value }
						onChange={ submitIconEnabled.onChange }
					/>
				</InlineLabeledControl>
				<IconPicker iconEnabled={ submitIconEnabled } />
				{ submitIconEnabled.value === true && (
					<>
						<SelectControlWithPath
							label={ __( 'Icon position', 'iconvert-promoter' ) }
							options={ iconPosition.options }
							{ ...submitIconPosition }
						/>
						<RangeWithUnitControl
							label={ __( 'Icon spacing', 'iconvert-promoter' ) }
							capMax={ false }
							max={ 50 }
							{ ...submitIconSpace }
						/>
					</>
				) }

				<ButtonSizeBase
					computed={ buttonSizeComputed }
					showHorizontalSeparator={ false }
				/>
			</KubioPanelBody>

			<KubioPanelBody
				title={ __( 'Notices', 'iconvert-promoter' ) }
				initialOpen={ false }
			>
				<TinymceControlWithPath
					label={ __( 'Success message', 'iconvert-promoter' ) }
					type={ WithDataPathTypes.ATTRIBUTE }
					path={ `successNotice.label` }
					editorSettings={ editorSettings }
				/>
				<TinymceControlWithPath
					label={ __( 'Existing email', 'iconvert-promoter' ) }
					type={ WithDataPathTypes.ATTRIBUTE }
					path={ `infoNotice.label` }
					editorSettings={ editorSettings }
				/>
				<TinymceControlWithPath
					label={ __( 'Error message', 'iconvert-promoter' ) }
					type={ WithDataPathTypes.ATTRIBUTE }
					path={ `errorNotice.label` }
					editorSettings={ editorSettings }
				/>
				<HorizontalTextAlignControlWithPath
					label={ __( 'Text align', 'iconvert-promoter' ) }
					path="textAlign"
					{ ...noticesOptions }
				/>
			</KubioPanelBody>
		</>
	);
};
let promoRemoteList = null;
const useOnRemoteData = () => {
	const [ myFormsData, setMyFormsData ] = useState( [] );

	const onFetchData = async () => {
		try {
			const result = await apiFetch( { path: 'promo/v1/lists' } );
			let defaultList; // = { label: 'Default list', value: 0 };
			const formsDataReconstructed = [];
			result.records.forEach( myFunction );

			function myFunction( item ) {
				if ( parseInt( item.listtype ) === 1 ) {
					defaultList = {
						label: item.name,
						value: parseInt( item.id ),
					};
				} else {
					formsDataReconstructed.push( {
						label: item.name,
						value: parseInt( item.id ),
					} );
				}
			}
			// add the default list as the first option (we cannot set an empty list)
			if ( defaultList ) {
				formsDataReconstructed.unshift( defaultList );
			}
			promoRemoteList = formsDataReconstructed;
			setMyFormsData( formsDataReconstructed );
		} catch ( e ) {
			console.error( e );
		}
	};
	useEffect( () => {
		if ( promoRemoteList === null ) {
			onFetchData();
		} else {
			setMyFormsData( promoRemoteList );
		}
	}, [] );

	return {
		myFormsData,
	};
};

const useComputed = ( dataHelper ) => {
	const currentNoticeState = {
		value: dataHelper.getContextProp( 'curentNotice' ),
		onChange: ( event ) => {
			dataHelper.setContextProp( 'curentNotice', event );
		},
	};
	const formId = {
		value: dataHelper.getAttribute( 'formId' ),
		onChange: ( event ) => {
			dataHelper.setAttribute( 'formId', parseInt( event ) );
		},
	};

	function restructureLayoutOnFields() {
		dataHelper.group( () => {
			const formFields = dataHelper.getAttribute( 'formFields' );
			const formLayout = dataHelper.getAttribute( 'formLayout' );
			if ( formLayout === 'vertical' ) {
				dataHelper.setStyle( 'display', 'grid', {
					styledComponent: ElementsEnum.CONTAINERFIELDS,
					media: 'desktop',
				} );

				dataHelper.setStyle(
					`width`,
					{ unit: '%', value: 100 },
					{
						styledComponent: ElementsEnum.NAMECONTAINER,
						media: 'desktop',
					}
				);
				dataHelper.setStyle(
					`margin.right`,
					{ unit: '%', value: 0 },
					{
						styledComponent: ElementsEnum.NAMECONTAINER,
						media: 'desktop',
					}
				);
				//Email
				dataHelper.setStyle(
					`width`,
					{ unit: '%', value: 100 },
					{
						styledComponent: ElementsEnum.EMAILCONTAINER,
						media: 'desktop',
					}
				);
				dataHelper.setStyle(
					`margin.right`,
					{ unit: '%', value: 0 },
					{
						styledComponent: ElementsEnum.EMAILCONTAINER,
						media: 'desktop',
					}
				);
				//Submit
				dataHelper.setStyle(
					`width`,
					{ unit: '%', value: 100 },
					{
						styledComponent: ElementsEnum.SUBMITCONTAINER,
						media: 'desktop',
					}
				);
				dataHelper.setStyle(
					`width`,
					{ value: 100, unit: '%' },
					{
						styledComponent: ElementsEnum.SUBMITBUTTON,
						media: 'desktop',
					}
				);

				dataHelper.setPropInMedia( 'submitButtonWidth', 'custom', {} );
			} else if ( formLayout === 'horizontal' ) {
				dataHelper.setStyle( 'textAlign', 'left', {
					styledComponent: ElementsEnum.CONTAINER,
					media: 'desktop',
				} );
				dataHelper.setStyle( 'display', 'flex', {
					styledComponent: ElementsEnum.CONTAINERFIELDS,
					media: 'desktop',
				} );
				dataHelper.setStyle(
					`width`,
					{ unit: '%', value: '100' },
					{
						styledComponent: ElementsEnum.NAMECONTAINER,
						media: 'desktop',
					}
				);
				dataHelper.setStyle(
					`width`,
					{},
					{
						styledComponent: ElementsEnum.SUBMITBUTTON,
						media: 'desktop',
					}
				);
				dataHelper.setStyle( `width`, null, {
					styledComponent: ElementsEnum.SUBMITCONTAINER,
					media: 'desktop',
				} );

				dataHelper.setPropInMedia(
					'submitButtonWidth',
					'fitToContent',
					{}
				);

				if ( formFields === 'name-email' ) {
					dataHelper.setStyle( `flex`, '1 1 auto', {
						styledComponent: ElementsEnum.NAMECONTAINER,
						media: 'desktop',
					} );
					dataHelper.setStyle( `flex`, '1 1 auto', {
						styledComponent: ElementsEnum.EMAILCONTAINER,
						media: 'desktop',
					} );
					dataHelper.setStyle( `flex`, '1 1 auto', {
						styledComponent: ElementsEnum.SUBMITCONTAINER,
						media: 'desktop',
					} );
				} else if ( formFields === 'email' ) {
					dataHelper.setStyle( `flex`, '1 auto', {
						styledComponent: ElementsEnum.EMAILCONTAINER,
						media: 'desktop',
					} );
					dataHelper.setStyle( `flex`, '1 auto', {
						styledComponent: ElementsEnum.SUBMITCONTAINER,
						media: 'desktop',
					} );
				}
			}
		} );
	}

	const formFields = {
		value: dataHelper.getAttribute( 'formFields' ),
		onChange: ( event ) => {
			dataHelper.setAttribute( 'formFields', event );
			// restructureLayoutOnFields();
		},
	};

	const formLayout = {
		value: dataHelper.getAttribute( 'formLayout' ),
		onChange: ( event ) => {
			dataHelper.setAttribute( 'formLayout', event );

			if ( event === 'horizontal' ) {
				dataHelper.setAttribute( 'stackOnMobile', false );
			}
			restructureLayoutOnFields();
		},
	};

	const iconGetter = () => {
		return false;
	};

	const titleGetter = ( itemDataHelper ) => {
		const fieldLabel = itemDataHelper.getAttribute( 'fieldLabel' );
		if ( fieldLabel ) {
			return fieldLabel;
		}

		const fieldPlaceholder =
			itemDataHelper.getAttribute( 'fieldPlaceholder' );
		if ( fieldPlaceholder ) {
			return fieldPlaceholder;
		}

		const fieldName = itemDataHelper.getAttribute( 'fieldName' );
		if ( fieldName ) {
			return fieldName;
		}

		return 'item';
	};

	const formConsent = dataHelper.getAttribute( 'formConsent' );
	const nameLabelDisplay = dataHelper.getAttribute( 'nameLabelDisplay' );
	const emailLabelDisplay = dataHelper.getAttribute( 'emailLabelDisplay' );
	const termsLabelDisplay = dataHelper.getAttribute( 'termsLabelDisplay' );

	const submitIconEnabled = {
		value: dataHelper.getAttribute( 'submitIconEnabled' ),
		onChange: ( event ) => {
			dataHelper.setAttribute( 'submitIconEnabled', event );
		},
	};
	const submitIconSpace = {
		value: dataHelper.getAttribute( 'submitIconSpace' ),
		onChange: ( event ) => {
			dataHelper.setAttribute( 'submitIconSpace', event );

			const none = { value: 0, unit: 'px' };
			const iconSpace = event;
			const submitIconPositionOption =
				dataHelper.getAttribute( 'submitIconPosition' );
			const left =
				submitIconPositionOption === 'after' ? iconSpace : none;
			const right =
				submitIconPositionOption === 'before' ? iconSpace : none;
			dataHelper.setStyle( 'margin.left', left, {
				styledComponent: ElementsEnum.SUBMITICON,
			} );
			dataHelper.setStyle( 'margin.right', right, {
				styledComponent: ElementsEnum.SUBMITICON,
			} );
		},
	};

	const submitIconPosition = {
		value: dataHelper.getAttribute( 'submitIconPosition' ),
		onChange: ( event ) => {
			const none = { value: 0, unit: 'px' };
			const iconSpace = dataHelper.getAttribute( 'submitIconSpace' );
			const left = event === 'after' ? iconSpace : none;
			const right = event === 'before' ? iconSpace : none;
			dataHelper.setStyle( 'margin.left', left, {
				styledComponent: ElementsEnum.SUBMITICON,
			} );
			dataHelper.setStyle( 'margin.right', right, {
				styledComponent: ElementsEnum.SUBMITICON,
			} );
			dataHelper.setAttribute( 'submitIconPosition', event );
		},
	};

	const termsCheckboxSpacer = {
		value: dataHelper.getStyle( 'margin.right', null, {
			styledComponent: ElementsEnum.TERMSCHECKBOX,
		} ),
		onChange: ( event ) => {
			dataHelper.setStyle( 'margin.right', event, {
				styledComponent: ElementsEnum.TERMSCHECKBOX,
			} );
		},
	};
	const termBoxObj = {
		13: { size: 13, iconSize: 9, iconPosition: 2 },
		14: { size: 14, iconSize: 10, iconPosition: 2 },
		15: { size: 15, iconSize: 12, iconPosition: 2 },
		16: { size: 16, iconSize: 13, iconPosition: 2 },
		17: { size: 17, iconSize: 13, iconPosition: 2 },
		18: { size: 18, iconSize: 14, iconPosition: 2 },
		19: { size: 19, iconSize: 15, iconPosition: 3 },
		20: { size: 20, iconSize: 16, iconPosition: 3 },
		21: { size: 21, iconSize: 16, iconPosition: 3 },
		22: { size: 22, iconSize: 16, iconPosition: 3 },
		23: { size: 23, iconSize: 17, iconPosition: 3 },
		24: { size: 24, iconSize: 18, iconPosition: 4 },
		25: { size: 25, iconSize: 19, iconPosition: 3 },
		26: { size: 26, iconSize: 20, iconPosition: 4 },
		27: { size: 27, iconSize: 21, iconPosition: 3 },
		28: { size: 28, iconSize: 22, iconPosition: 3 },
		29: { size: 29, iconSize: 23, iconPosition: 3 },
		30: { size: 30, iconSize: 23, iconPosition: 4 },
	};
	function valueToUnitPx( value ) {
		return {
			unit: 'px',
			value,
		};
	}

	const termsCheckboxSize = {
		value: dataHelper.getStyle( 'height', null, {
			styledComponent: ElementsEnum.TERMSFIELD,
		} ),
		onChange: ( event ) => {
			const targetEvent = event.value;
			dataHelper.setStyle(
				'height',
				valueToUnitPx( termBoxObj[ targetEvent ].size ),
				{ styledComponent: ElementsEnum.TERMSFIELD }
			);
			dataHelper.setStyle(
				'width',
				valueToUnitPx( termBoxObj[ targetEvent ].size ),
				{ styledComponent: ElementsEnum.TERMSFIELD }
			);
			dataHelper.setStyle(
				'height',
				valueToUnitPx( termBoxObj[ targetEvent ].iconSize ),
				{ styledComponent: ElementsEnum.TERMSICON }
			);
			dataHelper.setStyle(
				'width',
				valueToUnitPx( termBoxObj[ targetEvent ].iconSize ),
				{ styledComponent: ElementsEnum.TERMSICON }
			);
			dataHelper.setStyle(
				'top',
				valueToUnitPx( termBoxObj[ targetEvent ].iconPosition ),
				{ styledComponent: ElementsEnum.TERMSICON }
			);
			dataHelper.setStyle(
				'left',
				valueToUnitPx( termBoxObj[ targetEvent ].iconPosition ),
				{ styledComponent: ElementsEnum.TERMSICON }
			);
		},
		onReset: () => {
			dataHelper.setStyle( 'height', null, {
				unset: true,
				styledComponent: ElementsEnum.TERMSFIELD,
			} );
			dataHelper.setStyle( 'width', null, {
				unset: true,
				styledComponent: ElementsEnum.TERMSFIELD,
			} );
			dataHelper.setStyle( 'height', null, {
				unset: true,
				styledComponent: ElementsEnum.TERMSICON,
			} );
			dataHelper.setStyle( 'width', null, {
				unset: true,
				styledComponent: ElementsEnum.TERMSICON,
			} );
			dataHelper.setStyle( 'top', null, {
				unset: true,
				styledComponent: ElementsEnum.TERMSICON,
			} );
			dataHelper.setStyle( 'left', null, {
				unset: true,
				styledComponent: ElementsEnum.TERMSICON,
			} );
		},
	};

	return {
		currentNoticeState,
		formId,
		iconGetter,
		titleGetter,
		formFields,
		formConsent,
		nameLabelDisplay,
		emailLabelDisplay,
		termsLabelDisplay,
		submitIconEnabled,
		submitIconPosition,
		submitIconSpace,
		formLayout,
		termsCheckboxSpacer,
		termsCheckboxSize,
		isStackOnMobile: dataHelper.getAttribute( 'stackOnMobile' ),
	};
};

const PanelWithData = withColibriDataAutoSave( useComputed )( Panel );
export default PanelWithData;
