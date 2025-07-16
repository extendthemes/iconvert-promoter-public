import { FontPicker, GutentagSelectControl } from '@kubio/controls';
import { useDeepMemo } from '@kubio/core';
import { useGlobalDataFonts } from '@kubio/global-data';
import { ResetIcon } from '@kubio/icons';
import { useOnClickOutside } from '@kubio/utils';

import {
	BaseControl,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	ToolbarButton,
	Popover,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalStyleProvider as StyleProvider,
} from '@wordpress/components';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { typography } from '@wordpress/icons';
import classnames from 'classnames';
import _ from 'lodash';
import { fontFamilyWeight } from './index';
import { useGetPopoverOptions } from '../../common/use-get-popover-options';

const weightOptions = [
	{ label: __( '100 (thin)', 'kubio' ), value: 100 },
	{ label: __( '200 (extra light)', 'kubio' ), value: 200 },
	{ label: __( '300 (light)', 'kubio' ), value: 300 },
	{ label: __( '400 (normal)', 'kubio' ), value: 400 },
	{ label: __( '500 (medium)', 'kubio' ), value: 500 },
	{ label: __( '600 (semi bold)', 'kubio' ), value: 600 },
	{ label: __( '700 (bold)', 'kubio' ), value: 700 },
	{ label: __( '800 (extra bold)', 'kubio' ), value: 800 },
	{ label: __( '900 (heavy)', 'kubio' ), value: 900 },
];

const InlineControl = ( {
	isActive,
	value,
	onChange,
	onReset,
	contentRef,
	formatValue,
} ) => {
	const { getFontWeights } = useGlobalDataFonts();
	const [ isPopoverVisible, setPopoverVisibility ] = useState( false );
	const popperRef = useRef();

	const fontFamilyValue = _.get( value, 'fontFamily' );
	const fontWeightValue = _.get( value, 'fontWeight' );
	const onFontWeightChange = ( newValue ) => {
		onChange( 'fontWeight', newValue );
		//onClose();
	};
	const onFontFamilyChange = ( newValue ) => {
		const newFontWeights = getFontWeights( newValue );
		// eslint-disable-next-line no-shadow
		const fontWeightIsSupported = newFontWeights.some( ( value ) => {
			return value === fontWeightValue;
		} );

		if ( ! fontWeightIsSupported ) {
			const data = {
				fontFamily: newValue,
				fontWeight: 400,
			};
			onChange( '', data );
		} else {
			onChange( 'fontFamily', newValue );
		}

		//onClose();
	};

	const currentWeights = getFontWeights( fontFamilyValue );

	const currentWeightsOptions = useDeepMemo( () => {
		return weightOptions.filter(
			// eslint-disable-next-line no-shadow
			( { value } ) => currentWeights.indexOf( value ) !== -1
		);
	}, [ currentWeights ] );

	const fontFamily = {
		value: fontFamilyValue,
		onChange: onFontFamilyChange,
	};

	const fontWeight = {
		value: fontWeightValue,
		onChange: onFontWeightChange,
		options: currentWeightsOptions,
		onReset,
	};

	const [ refreshKey, setRefreshKey ] = useState( Math.random() );
	const onTogglePopover = () => {
		setPopoverVisibility( ( visible ) => ! visible );
	};

	const onClickOutside = useCallback( ( event ) => {
		const target = event?.target;
		const clickedPopper =
			target &&
			target.closest(
				'.block-editor-rich-text__inline-font-family, .h-select-control__popover, .kubio-fontpicker-content'
			);
		const popperNode = popperRef.current;
		if ( popperNode?.contains( target ) || clickedPopper ) {
			return;
		}
		setPopoverVisibility( false );
	}, [] );

	useOnClickOutside( popperRef, onClickOutside );

	const elementTag = contentRef?.current?.tagName;

	useEffect( () => {
		if ( elementTag ) {
			setRefreshKey( Math.random() );
		}
	}, [ elementTag ] );

	return (
		<InlineInternalComponent
			key={ refreshKey }
			contentRef={ contentRef }
			fontFamilyWeight={ fontFamilyWeight }
			value={ value }
			isActive={ isActive }
			onTogglePopover={ onTogglePopover }
			isPopoverVisible={ isPopoverVisible }
			setPopoverVisibility={ setPopoverVisibility }
			fontFamily={ fontFamily }
			fontWeight={ fontWeight }
			onReset={ onReset }
			popperRef={ popperRef }
		/>
	);
};

const InlineInternalComponent = ( {
	contentRef,
	fontFamilyWeight,
	value,
	isActive,
	onTogglePopover,
	isPopoverVisible,
	setPopoverVisibility,
	fontFamily,
	fontWeight,
	onReset,
	popperRef,
} ) => {
	const { popoverOptions } = useGetPopoverOptions( {
		contentRef,
		settings: fontFamilyWeight,
		value,
	} );
	return (
		<>
			<ToolbarButton
				className={ classnames( { 'is-pressed': isActive } ) }
				icon={ typography }
				onClick={ onTogglePopover }
				label={ __( 'Typography', 'kubio' ) }
			/>

			{ isPopoverVisible && (
				<StyleProvider document={ document }>
					<Popover
						className="block-editor-rich-text__inline-font-family"
						onFocusOutside={ () => setPopoverVisibility( false ) }
						position={ 'bottom center' }
						placement="bottom"
						{ ...popoverOptions }
					>
						<div
							ref={ popperRef }
							className="block-editor-rich-text__inline-format-toolbar block-editor-rich-text__inline-font-family kubio-options-popover "
						>
							<div className="block-editor-rich-text__typography-toolbar__container">
								<BaseControl>
									<Flex className="kubio-font-family-container">
										<FlexBlock>
											<span
												className={
													'kubio-font-family-label'
												}
											>
												{ __( 'Font family', 'kubio' ) }
											</span>
										</FlexBlock>
										<FlexItem>
											<FontPicker
												label={ __(
													'Font family',
													'kubio'
												) }
												placeholder={ __(
													'Inherited',
													'kubio'
												) }
												allowReset={ false }
												{ ...fontFamily }
											/>
										</FlexItem>
										<FlexItem className="kubio-font-family__reset">
											<Button
												isSmall
												icon={ ResetIcon }
												label={ __( 'Reset', 'kubio' ) }
												className={
													'kubio-popover-options-icon'
												}
												// disabled={!isDirty}
												onClick={ onReset }
											/>
										</FlexItem>
									</Flex>
								</BaseControl>
								<BaseControl>
									<GutentagSelectControl
										label={ __( 'Font weight', 'kubio' ) }
										placeholder={ __(
											'Inherited',
											'kubio'
										) }
										allowReset={ true }
										{ ...fontWeight }
									/>
								</BaseControl>
							</div>
						</div>
					</Popover>
				</StyleProvider>
			) }
		</>
	);
};

export { InlineControl };
