import { __ } from '@wordpress/i18n';
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
} from '@kubio/controls';
import _ from 'lodash';

import { BaseControl, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import defaultValues from '../../block.json';
import { useGlobalDataStyle } from '@kubio/global-data';
import {
	WithDataPathTypes,
	withComputedData,
	useTransformStyle,
	useDataHelperPathForStyle,
} from '@kubio/core';
import { ElementsEnum } from '../../elements';
import {
	widthOptions,
	notices,
	verticalAlignOptionsTopBottom,
	optionsContentToggle,
	optionsEffectActive,
	VerticalAlignValues,
	getEffectOptions,
	effectValues,
} from '../../config';

const currentNoticeMapperToStyledElements = notices.items;

const Panel = ( { computed, ...rest } ) => {
	const {
		popupType,
		playEffectStart,
		currentNoticeState,
		currentNoticeOptions,
		containerOptions,
		horizontalOffset,
		verticalOffset,
		isPlaying,
		setIsPlaying,
		vSpacingDefault,
		resetTemplateWidth,
		popupVAlign,
		heightProps,
		chosenEffect,
		variation,
		animationDuration,
	} = computed;

	const sleep = ( ms ) => new Promise( ( r ) => setTimeout( r, ms ) );
	const playToDefault = async () => {
		await sleep( animationDuration.value.value * 1000 + 300 );
		setIsPlaying( false );
	};
	if ( isPlaying ) {
		playToDefault();
	}

	const effectVariationOptions = getEffectOptions(
		chosenEffect.value,
		currentNoticeOptions
	);
	return (
		<>
			<KubioPanelBody title={ __( 'Popup layout', 'iconvert-promoter' ) }>
				{ popupType === 'floating-bar' ? (
					<>
						<ToggleGroupWithPath
							path="align"
							allowReset={ false }
							label={ __(
								'Popup vertical position',
								'iconvert-promoter'
							) }
							media="auto"
							options={ verticalAlignOptionsTopBottom }
							type={ WithDataPathTypes.ATTRIBUTE }
						/>
						{ popupVAlign === VerticalAlignValues.TOP && (
							<ToggleGroupWithPath
								options={ optionsContentToggle }
								path="contentPosition"
								type={ WithDataPathTypes.ATTRIBUTE }
								label={ __(
									'Content position',
									'iconvert-promoter'
								) }
							/>
						) }
					</>
				) : (
					<>
						{ ! [
							'inline-promotion-bar',
							'fullscreen-mat',
						].includes( popupType ) && (
							<VerticalAlignControlWithPath
								path="align"
								label={ __(
									'Popup vertical position',
									'iconvert-promoter'
								) }
								media="auto"
								type={ WithDataPathTypes.ATTRIBUTE }
							/>
						) }
					</>
				) }

				{ popupType !== 'inline-promotion-bar' && (
					<>
						<HorizontalAlignControlWithPath
							path="alignH"
							label={ __(
								'Popup horizontal position',
								'iconvert-promoter'
							) }
							media="auto"
							type={ WithDataPathTypes.ATTRIBUTE }
						/>

						<SeparatorHorizontalLine fit={ false } />
						<RangeWithUnitControl
							label={ __(
								'Horizontal offset',
								'iconvert-promoter'
							) }
							min={ -300 }
							max={ 300 }
							step={ 1 }
							capMin={ false }
							{ ...horizontalOffset }
						/>
						<RangeWithUnitControl
							label={ __(
								'Vertical offset',
								'iconvert-promoter'
							) }
							min={ -300 }
							max={ 300 }
							step={ 1 }
							capMin={ false }
							{ ...verticalOffset }
						/>
						<SeparatorHorizontalLine fit={ false } />
					</>
				) }

				<RangeWithUnitWithPath
					label={ __( 'Width', 'iconvert-promoter' ) }
					path={ 'width' }
					type={ WithDataPathTypes.STYLE }
					{ ...resetTemplateWidth }
					{ ...widthOptions }
					{ ...containerOptions }
				/>

				<CustomHeightControl
					label={ __( 'Min height', 'iconvert-promoter' ) }
					{ ...heightProps }
				/>
			</KubioPanelBody>

			<KubioPanelBody
				title={ __( 'Content layout', 'iconvert-promoter' ) }
			>
				<VerticalAlignControlWithPath
					path="justifyContent"
					type={ WithDataPathTypes.STYLE }
					style={ ElementsEnum.CONTAINER }
					label={ __(
						'Content vertical position',
						'iconvert-promoter'
					) }
				/>

				<HorizontalAlignControlWithPath
					path="alignItems"
					type={ WithDataPathTypes.STYLE }
					label={ __(
						'Content horizontal position',
						'iconvert-promoter'
					) }
					style={ ElementsEnum.CONTAINER }
				/>

				<RangeWithUnitWithPath
					label={ __( 'Content max width', 'iconvert-promoter' ) }
					path={ 'maxWidth' }
					type={ WithDataPathTypes.STYLE }
					style={ ElementsEnum.CONTENT_WIDTH }
					{ ...widthOptions }
				/>

				<RangeWithUnitWithPath
					label={ __(
						'Content elements vertical spacing',
						'iconvert-promoter'
					) }
					type={ WithDataPathTypes.PROP }
					defaultValue={ vSpacingDefault }
					path="vSpace"
					media="auto"
				/>
			</KubioPanelBody>

			<KubioPanelBody
				title={ __( 'Appearance Effects', 'iconvert-promoter' ) }
				initialOpen={ true }
			>
				<ToggleGroup
					options={ notices.options }
					value={ currentNoticeState.value }
					onChange={ currentNoticeState.onChange }
					disabledOptions={
						popupType === 'inline-promotion-bar' ? [ 'show' ] : []
					}
				/>

				<SelectControlWithPath
					label="Chosen effect"
					options={ optionsEffectActive() }
					type={ WithDataPathTypes.ATTRIBUTE }
					path={ `${ currentNoticeOptions }.effectActive` }
					value={ chosenEffect.value }
					onChange={ chosenEffect.onChange }
					disabled={ isPlaying }
				/>
				{ chosenEffect.value !== effectValues.none && (
					<SelectControlWithPath
						label="Variation"
						options={ effectVariationOptions }
						type={ WithDataPathTypes.ATTRIBUTE }
						path={ `${ currentNoticeOptions }.${ chosenEffect.value }` }
						disabled={ isPlaying }
						{ ...variation }
					/>
				) }

				<SeparatorHorizontalLine fit={ false } />

				<RangeWithUnitControl
					label={ __( 'Animation duration', 'iconvert-promoter' ) }
					path={ 'animation.duration' }
					{ ...animationDuration }
					min={ 0 }
					max={ 5 }
					step={ 0.1 }
					defaultUnit={ 's' }
				/>

				{
					<BaseControl>
						<Button
							isPrimary
							onClick={ playEffectStart.onChange }
							isBusy={ isPlaying }
							disabled={ isPlaying }
							className={
								'kubio-button-group-button sortable-collapse__add-button'
							}
						>
							{ ! isPlaying &&
								__( 'Play effect', 'iconvert-promoter' ) }
							{ isPlaying &&
								__( 'Playing…', 'iconvert-promoter' ) }
						</Button>
					</BaseControl>
				}
			</KubioPanelBody>
		</>
	);
};

const useComputed = ( dataHelper ) => {
	const [ isPlaying, setIsPlaying ] = useState( false );

	const popupType = dataHelper.getAttribute( 'popup_type', '' );
	const popupVAlign = dataHelper.getAttribute( 'align' );

	const containerOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.CONTAINER,
	};

	const currentNoticeState = {
		value: dataHelper.getContextProp( 'curentNotice', 'show' ),
		onChange: ( event ) => {
			dataHelper.setContextProp( 'curentNotice', event );
		},
	};

	const currentNoticeOptions =
		currentNoticeMapperToStyledElements[ currentNoticeState.value ];
	const effectActive = dataHelper.getAttribute(
		`${ currentNoticeOptions }.effectActive`
	);

	const playEffectStart = {
		onChange: () => {
			dataHelper.setContextProp( 'refreshAnimationKey', Math.random() );
			setIsPlaying( true );
		},
	};

	/**
	 ** The vertical and horizontal offset values
	 */
	const transformDataHelper = useTransformStyle( dataHelper );

	// Transform X
	let unsetValue = getDefaultValue(
		'wrapperContainer.transform.translate[0].value'
	);
	const horizontalOffset = transformDataHelper.useStylePath(
		'transform.translate.x',
		{
			local: true,
			unsetValue,
			styledComponent: ElementsEnum.WRAPPER_CONTAINER,
		},
		unsetValue
	);

	// Transform Y
	unsetValue = getDefaultValue(
		'wrapperContainer.transform.translate[1].value'
	);
	const verticalOffset = transformDataHelper.useStylePath(
		'transform.translate.y',
		{
			local: true,
			unsetValue,
			styledComponent: ElementsEnum.WRAPPER_CONTAINER,
		},
		unsetValue
	);

	function getDefaultValue( path ) {
		const returnValue = _.cloneDeep(
			_.get(
				defaultValues.supports.kubio.default,
				`style.descendants.${ path }`
			)
		);
		if (
			'next' === dataHelper.getAttribute( 'direction' ) &&
			path === 'container.transform.translate[0].value'
		) {
			let currentValue = _.get( returnValue, 'value' );
			if ( currentValue && ! isNaN( currentValue ) ) {
				currentValue = parseFloat( currentValue ) * -1;
				returnValue.value = currentValue;
			}
		}

		return returnValue;
	}

	const defaultTemplateWidth = dataHelper.getAttribute(
		'defaultTemplateWidth'
	);
	const defaultTemplateHeight = dataHelper.getAttribute(
		'defaultTemplateHeight'
	);

	const resetTemplateWidth = {
		onReset: () => {
			dataHelper.setStyle( 'width', defaultTemplateWidth, {
				styledComponent: ElementsEnum.CONTAINER,
			} );
		},
	};
	const resetTemplateHeight = {
		onReset: () => {
			dataHelper.setStyle( 'minHeight', defaultTemplateHeight, {
				styledComponent: ElementsEnum.CONTAINER,
			} );
		},
	};

	const heightProps = useDataHelperPathForStyle(
		dataHelper,
		'customHeight',
		{
			styledComponent: ElementsEnum.CONTAINER,
		},
		{}
	);

	const { globalStyle } = useGlobalDataStyle();
	const vSpacingDefault = globalStyle.getPropInMedia( 'vSpace' );

	const chosenEffect = {
		value: dataHelper.getAttribute(
			`${ currentNoticeOptions }.effectActive`
		),
		onChange: ( newValue ) => {
			const newOption = getEffectOptions(
				newValue,
				currentNoticeOptions
			);
			const newVariationValue = newOption?.[ 0 ]?.value;
			if ( newVariationValue ) {
				dataHelper.setAttribute(
					`${ currentNoticeOptions }.${ newValue }`,
					newVariationValue
				);
			}

			dataHelper.setAttribute(
				`${ currentNoticeOptions }.effectActive`,
				newValue
			);

			if ( newValue ) {
				setTimeout( () => {
					playEffectStart.onChange();
				}, 250 );
			}
		},
	};

	const variation = {
		value: dataHelper.getAttribute(
			`${ currentNoticeOptions }.${ chosenEffect.value }`
		),
		onChange: ( newValue ) => {
			dataHelper.setAttribute(
				`${ currentNoticeOptions }.${ chosenEffect.value }`,
				newValue
			);

			setTimeout( () => {
				playEffectStart.onChange();
			}, 250 );
		},
	};

	const animationDuration = {
		value: dataHelper.getStyle(
			'animation.duration',
			{ value: 1, unit: 's' },
			{
				styledComponent: ElementsEnum.CONTAINER,
				media: 'desktop',
			}
		),
		onChange: ( newValue ) => {
			dataHelper.setStyle( 'animation.duration', newValue, {
				styledComponent: ElementsEnum.CONTAINER,
				media: 'desktop',
			} );
		},
	};

	return {
		popupType,
		isPlaying,
		setIsPlaying,
		currentNoticeState,
		currentNoticeOptions,
		containerOptions,
		effectActive,
		playEffectStart,
		horizontalOffset,
		verticalOffset,
		resetTemplateWidth,
		resetTemplateHeight,
		popupVAlign,
		heightProps,
		vSpacingDefault,
		chosenEffect,
		variation,
		animationDuration,
	};
};

const PanelWithData = withComputedData( useComputed )( Panel );
export default PanelWithData;
