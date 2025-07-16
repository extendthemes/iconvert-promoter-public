import { PanelBody } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	BordersAndRadiusWithPath,
	BoxUnitValueControlWithPath,
	ColorWithPath,
	RangeWithUnitControl,
	SeparatorHorizontalLine,
	ToggleGroup,
	TypographyControlPopupWithPath,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { notices, noticesValues, terms } from '../../config';
import { ElementsEnum } from '../../elements';

const Panel = ( { computed } ) => {
	const {
		currentTermsState,
		currentNoticeState,
		submitIconSize,
		submitIconEnabled,
		formConsent,
		onResetBorder,
	} = computed;

	const termsOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.TERMSFIELD,
	};

	const formOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.CONTAINER,
	};

	const groupLabelsOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.GROUPLABELS,
	};
	const groupFieldsOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.GROUPFIELDS,
	};
	const submitOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.SUBMITBUTTON,
	};

	const termsCheckedOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.TERMSICON,
	};
	const termsLabelOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.TERMSLABEL,
	};

	const termsDescriptionOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.TERMSDESCRIPTION,
	};

	const termsDescriptionLinksOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.TERMSDESCRIPTIONLINKS,
	};

	const pickerValues = {
		NORMAL: 'normal',
		HOVER: 'hover',
		FOCUS: 'focus',
		CHECKED: 'checked',
	};

	const fieldPickerOptions = [
		{
			value: pickerValues.NORMAL,
			label: __( 'Normal', 'iconvert-promoter' ),
		},
		{
			value: pickerValues.HOVER,
			label: __( 'Hover', 'iconvert-promoter' ),
		},
		{
			value: pickerValues.FOCUS,
			label: __( 'Focus', 'iconvert-promoter' ),
		},
	];
	const submitPickerOptions = [
		{
			value: pickerValues.NORMAL,
			label: __( 'Normal', 'iconvert-promoter' ),
		},
		{
			value: pickerValues.HOVER,
			label: __( 'Hover', 'iconvert-promoter' ),
		},
	];
	const termsPickerOptions = [
		{
			value: pickerValues.NORMAL,
			label: __( 'Unchecked', 'iconvert-promoter' ),
		},
		{
			value: pickerValues.CHECKED,
			label: __( 'Checked', 'iconvert-promoter' ),
		},
	];

	//const [termsState, setTermsState] = useState(pickerValues.NORMAL);
	const [ fieldState, setFieldState ] = useState( pickerValues.NORMAL );
	const [ submitState, setSubmitState ] = useState( pickerValues.NORMAL );

	const currentNoticeMapperToStyledElements = {
		[ noticesValues.ERROR ]: 'errorNotice',
		[ noticesValues.SUCCESS ]: 'successNotice',
		[ noticesValues.INFO ]: 'infoNotice',
	};

	const commonNoticeOptions = {
		type: WithDataPathTypes.STYLE,
		style: currentNoticeMapperToStyledElements[ currentNoticeState.value ],
	};

	return (
		<>
			<PanelBody title={ 'Form' } initialOpen={ true }>
				<ColorWithPath
					label={ __( 'Background color', 'iconvert-promoter' ) }
					path={ 'background.color' }
					{ ...formOptions }
				/>
				<BoxUnitValueControlWithPath
					label={ __( 'Padding', 'iconvert-promoter' ) }
					path={ 'padding' }
					capMin={ true }
					min={ 0 }
					{ ...formOptions }
				/>
				<BordersAndRadiusWithPath
					path={ 'border' }
					withColor={ true }
					{ ...formOptions }
				/>
			</PanelBody>
			<PanelBody title={ 'Labels' } initialOpen={ false }>
				<ColorWithPath
					label={ __( 'Text Color', 'iconvert-promoter' ) }
					path={ 'typography.color' }
					{ ...groupLabelsOptions }
				/>
				<TypographyControlPopupWithPath
					path={ 'typography' }
					{ ...groupLabelsOptions }
				/>
			</PanelBody>
			<PanelBody title={ 'Fields' } initialOpen={ false }>
				<ToggleGroup
					options={ fieldPickerOptions }
					value={ fieldState }
					onChange={ ( nextState ) => setFieldState( nextState ) }
				/>
				<ColorWithPath
					label={ __( 'Background', 'iconvert-promoter' ) }
					path={ 'background.color' }
					state={ fieldState }
					{ ...groupFieldsOptions }
				/>
				<ColorWithPath
					label={ __( 'Text Color', 'iconvert-promoter' ) }
					path={ 'typography.color' }
					state={ fieldState }
					{ ...groupFieldsOptions }
				/>
				<ColorWithPath
					label={ __( 'Border color', 'iconvert-promoter' ) }
					path={ [
						'border.top.color',
						'border.bottom.color',
						'border.left.color',
						'border.right.color',
					] }
					state={ fieldState }
					{ ...groupFieldsOptions }
				/>
				<SeparatorHorizontalLine />
				<TypographyControlPopupWithPath
					path={ 'typography' }
					{ ...groupFieldsOptions }
				/>
				<SeparatorHorizontalLine />
				<BoxUnitValueControlWithPath
					label={ __( 'Padding', 'iconvert-promoter' ) }
					path={ 'padding' }
					capMin={ true }
					{ ...groupFieldsOptions }
				/>
				<BoxUnitValueControlWithPath
					label={ __( 'Margin', 'iconvert-promoter' ) }
					path={ 'margin' }
					capMin={ true }
					{ ...groupFieldsOptions }
				/>
				<SeparatorHorizontalLine />
				<BordersAndRadiusWithPath
					path={ 'border' }
					withColor={ false }
					{ ...groupFieldsOptions }
				/>
			</PanelBody>
			{ formConsent === true && (
				<PanelBody title={ 'Terms' } initialOpen={ false }>
					<ToggleGroup
						options={ terms.options }
						value={ currentTermsState.value }
						onChange={ currentTermsState.onChange }
					/>

					<ColorWithPath
						label={ __(
							'Checkbox background color',
							'iconvert-promoter'
						) }
						path={ 'background.color' }
						state={ currentTermsState.value }
						{ ...termsOptions }
					/>
					{ currentTermsState.value === 'checked' && (
						<ColorWithPath
							label={ __(
								'Checkbox mark color',
								'iconvert-promoter'
							) }
							path={ 'typography.color' }
							{ ...termsCheckedOptions }
						/>
					) }
					<ColorWithPath
						label={ __(
							'Checkbox border color',
							'iconvert-promoter'
						) }
						path={ [
							'border.top.color',
							'border.bottom.color',
							'border.left.color',
							'border.right.color',
						] }
						state={ currentTermsState.value }
						{ ...termsOptions }
					/>
					<SeparatorHorizontalLine />

					<BordersAndRadiusWithPath
						label={ __( 'Checkbox border', 'iconvert-promoter' ) }
						labelRadius={ __(
							'Checkbox radius',
							'iconvert-promoter'
						) }
						path={ 'border' }
						withColor={ false }
						onReset={ onResetBorder }
						{ ...termsOptions }
					/>

					<SeparatorHorizontalLine />
					<ColorWithPath
						label={ __( 'Terms label color', 'iconvert-promoter' ) }
						path={ 'typography.color' }
						{ ...termsLabelOptions }
					/>
					<TypographyControlPopupWithPath
						label={ __(
							'Terms label typography',
							'iconvert-promoter'
						) }
						path={ 'typography' }
						{ ...termsLabelOptions }
					/>

					<SeparatorHorizontalLine />
					<ColorWithPath
						label={ __( 'Description Color', 'iconvert-promoter' ) }
						path={ 'typography.color' }
						{ ...termsDescriptionOptions }
					/>
					<TypographyControlPopupWithPath
						label={ __(
							'Description Typography',
							'iconvert-promoter'
						) }
						path={ 'typography' }
						{ ...termsDescriptionOptions }
					/>

					<SeparatorHorizontalLine />
					<ColorWithPath
						label={ __(
							'Description Links Color',
							'iconvert-promoter'
						) }
						path={ 'typography.color' }
						{ ...termsDescriptionLinksOptions }
					/>
					<TypographyControlPopupWithPath
						label={ __(
							'Description Links Typography',
							'iconvert-promoter'
						) }
						path={ 'typography' }
						{ ...termsDescriptionLinksOptions }
					/>
				</PanelBody>
			) }
			<PanelBody title={ 'Submit button' } initialOpen={ false }>
				<ToggleGroup
					options={ submitPickerOptions }
					value={ submitState }
					onChange={ ( nextState ) => setSubmitState( nextState ) }
				/>
				<ColorWithPath
					label={ __( 'Background', 'iconvert-promoter' ) }
					path={ 'background.color' }
					state={ submitState }
					{ ...submitOptions }
				/>
				<ColorWithPath
					label={ __( 'Text Color', 'iconvert-promoter' ) }
					path={ 'typography.color' }
					state={ submitState }
					{ ...submitOptions }
				/>
				<ColorWithPath
					label={ __( 'Border color', 'iconvert-promoter' ) }
					path={ [
						'border.top.color',
						'border.bottom.color',
						'border.left.color',
						'border.right.color',
					] }
					state={ submitState }
					{ ...submitOptions }
				/>
				<SeparatorHorizontalLine />
				{ submitIconEnabled === true && (
					<RangeWithUnitControl
						label={ __( 'Icon size', 'iconvert-promoter' ) }
						max={ 30 }
						capMax={ false }
						capMin={ true }
						{ ...submitIconSize }
					/>
				) }
				<TypographyControlPopupWithPath
					path={ 'typography' }
					{ ...submitOptions }
				/>
				<SeparatorHorizontalLine />
				<BordersAndRadiusWithPath
					path={ 'border' }
					withColor={ false }
					{ ...submitOptions }
				/>
			</PanelBody>
			<PanelBody title={ 'Notices' } initialOpen={ false }>
				<ToggleGroup
					options={ notices.options }
					value={ currentNoticeState.value }
					onChange={ currentNoticeState.onChange }
				/>
				<ColorWithPath
					label={ __( 'Background Color', 'iconvert-promoter' ) }
					path={ 'background.color' }
					{ ...commonNoticeOptions }
				/>
				<ColorWithPath
					label={ __( 'Text Color', 'iconvert-promoter' ) }
					path={ 'typography.color' }
					{ ...commonNoticeOptions }
				/>
				<ColorWithPath
					label={ __( 'Border color', 'iconvert-promoter' ) }
					path={ [
						'border.top.color',
						'border.bottom.color',
						'border.left.color',
						'border.right.color',
					] }
					{ ...commonNoticeOptions }
				/>
				<SeparatorHorizontalLine />
				<TypographyControlPopupWithPath
					path={ 'typography' }
					{ ...commonNoticeOptions }
				/>
				<SeparatorHorizontalLine />
				<BoxUnitValueControlWithPath
					label={ __( 'Padding', 'iconvert-promoter' ) }
					path={ 'padding' }
					capMin={ true }
					min={ 0 }
					{ ...commonNoticeOptions }
				/>
				<BoxUnitValueControlWithPath
					label={ __( 'Margin', 'iconvert-promoter' ) }
					path={ 'margin' }
					capMin={ true }
					min={ 0 }
					{ ...commonNoticeOptions }
				/>
				<SeparatorHorizontalLine />
				<BordersAndRadiusWithPath
					path={ 'border' }
					withColor={ false }
					{ ...commonNoticeOptions }
				/>
			</PanelBody>
		</>
	);
};

const useComputed = ( dataHelper ) => {
	const currentNoticeState = {
		value: dataHelper.getContextProp( 'curentNotice' ),
		onChange: ( event ) => {
			dataHelper.setContextProp( 'curentNotice', event );
		},
	};
	const currentTermsState = {
		value: dataHelper.getContextProp( 'curentTerms' ),
		onChange: ( event ) => {
			dataHelper.setContextProp( 'curentTerms', event );
		},
	};
	const currentCheckboxState = {
		value: dataHelper.getContextProp( 'curentCheckbox' ),
		onChange: ( event ) => {
			dataHelper.setContextProp( 'curentCheckbox', event );
		},
	};

	const submitIconSize = {
		value: dataHelper.getStyle( 'height', null, {
			styledComponent: ElementsEnum.SUBMITICON,
		} ),
		onChange: ( event ) => {
			dataHelper.setStyle( 'height', event, {
				styledComponent: ElementsEnum.SUBMITICON,
			} );
			dataHelper.setStyle( 'width', event, {
				styledComponent: ElementsEnum.SUBMITICON,
			} );
		},
	};

	// reset border without reseting the border color
	const onResetBorder = ( r ) => {
		if ( ! r.endsWith( '.color' ) ) {
			dataHelper.setStyle( `border.${ r }`, null, {
				unset: true,
				styledComponent: ElementsEnum.TERMSFIELD,
			} );
		}
	};

	const submitIconEnabled = dataHelper.getAttribute( 'submitIconEnabled' );
	const formConsent = dataHelper.getAttribute( 'formConsent' );
	return {
		currentNoticeState,
		currentTermsState,
		submitIconSize,
		submitIconEnabled,
		formConsent,
		onResetBorder,
	};
};
const Component = withComputedData( useComputed )( Panel );
export default Component;
