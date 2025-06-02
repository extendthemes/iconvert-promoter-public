import { BaseControl, Button } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { Grid } from 'react-virtualized';
import { serializeGradient, ucwords } from '@kubio/utils';
import { chunk, isArray, map } from 'lodash';
import Fuse from 'fuse.js';
import tinycolor from 'tinycolor2';
import { useGradientParser } from '../custom-gradient-picker/utils';
import webGradients from './webgradients';
import CustomGradientPicker from '../custom-gradient-picker';
import CircularOptionPicker from '../circular-option-picker';
import {
	closeSmall,
	Icon,
	moreHorizontal,
	search as searchIcon,
} from '@wordpress/icons';
import { useInstanceId } from '@wordpress/compose';
import SeparatorHorizontalLine from '../separator-horizontal-line';
import { addProTagToItem, ProItem } from '@kubio/pro';
import classnames from 'classnames';
import { KubioPopup } from '../kubio-popup';

const getGradientList = () => {
	return Object.keys( webGradients ).map( ( itemValue, index ) => {
		const item = {
			key: itemValue,
			label: ucwords( itemValue.replace( /\_/gi, ' ' ) ),
			gradient: webGradients[ itemValue ],
		};

		if ( index > 5 ) addProTagToItem( item );

		return item;
	} );
};

const gradientList = getGradientList();

const filterGradients = ( search ) => {
	const gradients = gradientList;

	if ( ! search ) {
		return gradients;
	}

	const fuse = new Fuse( gradients, {
		threshold: 0.2,
		location: 0,
		ignoreLocation: true,
		distance: 20,
		keys: [ 'label' ],
	} );

	return fuse.search( search ).map( ( found ) => found.item );
};

const GradientPickerPopover = ( {
	value,
	onChange,
	presetsNumber = 6,
	withPreviewer = true,
} ) => {
	const [ search, setSearchValue ] = useState( '' );
	const moreGradientsRef = useRef();
	const perRow = 4;
	const visibleRows = 3;
	const itemWidth = 134;
	const itemHeight = 116;

	const filteredGradients = filterGradients( search );
	const filteredGradientsToGrid = chunk( filteredGradients, perRow );
	const gradientPickerRef = useRef();
	const outerRef = useRef();

	const { isSameGradient } = useGradientParser();
	const searchInput = useRef();
	const kubioPopupRef = useRef();
	const instanceId = useInstanceId( GradientControlWithPresets );

	const updateGradientValue = useCallback(
		( gradient ) => {
			kubioPopupRef?.current?.close();
			onChange( gradient );
		},
		[ onChange, kubioPopupRef.current ]
	);

	const cellRender = ( { columnIndex, key, rowIndex, style } ) => {
		const gradient = filteredGradientsToGrid[ rowIndex ][ columnIndex ];
		if ( ! gradient ) {
			return <Fragment />;
		}

		return (
			<div
				className={ classnames(
					'kubio-gradient-popover__gradient-wrapper',
					'kubio-control'
				) }
				style={ style }
				key={ key }
			>
				{ /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */ }
				<ProItem
					item={ gradient }
					tag={ 'div' }
					className={ 'kubio-gradient-data-container' }
					onClick={ () => updateGradientValue( gradient.gradient ) }
					role={ 'button' }
					tabIndex={ 0 }
					urlArgs={ {
						source: 'gradient',
						content: key,
					} }
				>
					<div
						className={ 'kubio-gradient-popover__gradient' }
						style={ { backgroundImage: gradient.gradient } }
					/>
					<div className={ 'kubio-gradient-popover__label' }>
						{ gradient.label }
					</div>
				</ProItem>
			</div>
		);
	};

	const previewGradients = gradientList.slice( 0, presetsNumber );

	const gradientOptions = useMemo( () => {
		return map( previewGradients, ( { key, gradient, label } ) => (
			<CircularOptionPicker.Option
				key={ key }
				value={ gradient }
				isSelected={ isSameGradient( value, gradient ) }
				tooltipText={
					label ||
					// translators: %s: gradient code e.g: "linear-gradient(90deg, rgba(98,16,153,1) 0%, rgba(172,110,22,1) 100%);".
					sprintf( __( 'Gradient code: %s', 'kubio' ), gradient )
				}
				style={ { color: 'rgba( 0,0,0,0 )', background: gradient } }
				onClick={ () => updateGradientValue( gradient ) }
				aria-label={
					label
						? // translators: %s: The name of the gradient e.g: "Angular red to blue".
						  sprintf( __( 'Gradient: %s', 'kubio' ), label )
						: sprintf(
								// translators: %s: gradient code e.g: "linear-gradient(90deg, rgba(98,16,153,1) 0%, rgba(172,110,22,1) 100%);".
								__( 'Gradient code: %s', 'kubio' ),
								gradient
						  )
				}
			/>
		) );
	}, [ filteredGradients, value, updateGradientValue ] );

	let wrapperStyle = {};

	if ( ! withPreviewer ) {
		wrapperStyle = {
			padding: 0,
			border: 0,
		};
	}

	return (
		<BaseControl>
			{ /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */ }
			<div ref={ outerRef } className="kubio-gradient-select-container">
				<CircularOptionPicker options={ gradientOptions } />
				<CircularOptionPicker.Option
					ref={ moreGradientsRef }
					className={ 'kubio-more-gradients-circle' }
					key={ 'more-gradients' }
					value={ value }
					tooltipText={ __( 'See more gradient presets', 'kubio' ) }
					style={ {
						color: 'white',
						border: '1px solid black',
					} }
					aria-label={ __( 'See more gradient presets', 'kubio' ) }
				>
					<Icon icon={ moreHorizontal } fill={ '#1e1e1e' } />
				</CircularOptionPicker.Option>
			</div>

			<SeparatorHorizontalLine />

			{ /* eslint-disable-next-line @wordpress/no-base-control-with-label-without-id */ }
			<BaseControl label={ __( 'Custom gradient', 'kubio' ) }>
				<div
					className={ 'kubio-gradient-picker-container' }
					role="button"
					tabIndex="0"
					ref={ gradientPickerRef }
					style={ wrapperStyle }
				>
					<div
						className={ 'kubio-gradient-picker-preview' }
						style={ { backgroundImage: value } }
					/>

					<div className={ 'kubio-gradient-popover-ref' }>
						<KubioPopup
							position="middle left"
							ref={ kubioPopupRef }
							className={ 'kubio-gradient-popover' }
							buttonRef={ moreGradientsRef }
							anchorRef={ outerRef }
						>
							<div
								className={
									'kubio-gradient-popover__input-wrapper'
								}
							>
								<input
									ref={ searchInput }
									id={ `block-editor-kubio-inserter__search-${ instanceId }` }
									className="block-editor-kubio-inserter__search-input kubio-gradient-search-input"
									/* eslint-disable-next-line jsx-a11y/no-autofocus */
									autoFocus
									placeholder={ __(
										'Search gradient',
										'kubio'
									) }
									onChange={ ( event ) =>
										setSearchValue( event.target.value )
									}
									autoComplete="off"
									value={ search || '' }
								/>
								<div className="block-editor-kubio-inserter__search-icon">
									{ !! search && (
										<Button
											className={
												'kubio-gradient-reset-button'
											}
											size={ 20 }
											icon={ closeSmall }
											label={ __(
												'Reset search',
												'kubio'
											) }
											onClick={ () => {
												setSearchValue( '' );
												searchInput.current.focus();
											} }
										/>
									) }
									{ ! search && (
										<Icon size={ 20 } icon={ searchIcon } />
									) }
								</div>
							</div>
							<Grid
								rowCount={ filteredGradientsToGrid.length }
								columnCount={ perRow }
								columnWidth={ itemWidth }
								width={ itemWidth * perRow }
								rowHeight={ itemHeight }
								height={ visibleRows * itemWidth }
								cellRenderer={ cellRender }
								scrollLeft={ 30 }
							/>
						</KubioPopup>
					</div>
				</div>
			</BaseControl>
		</BaseControl>
	);
};

const setGradientAlpha = ( gradient, alpha, parseGradient ) => {
	const parsedGradient = parseGradient( gradient );

	parsedGradient.colorStops.forEach( ( item ) => {
		if ( ! isArray( item.value ) ) {
			const color = tinycolor( item.value );
			item.type = 'rgba';
			item.value = [ color._r, color._g, color._b, alpha ];
		} else {
			item.type = 'rgba';
			item.value[ 3 ] = alpha;
		}
	} );
	gradient = serializeGradient( parsedGradient );

	return gradient;
};

const GradientControlWithPresets = ( {
	value,
	onChange,
	label = __( 'Gradient', 'kubio' ),
	forceAlpha = false,
	presetsNumber = 6,
	withPreviewer = true,
	forceAlphaForPreset = false,
	showExternalOpacityControl = false,
} ) => {
	const [ localValue, setLocalValue ] = useState( value );
	const {
		parseVariableColor,
		parseGradient,
		transformGradientColorsToVariables,
	} = useGradientParser();
	useEffect( () => {
		const valueToCompare = parseVariableColor( value );
		if ( valueToCompare !== localValue ) {
			setLocalValue( valueToCompare );
		}
	}, [ value ] );

	const setGradient = ( newValue ) => {
		if ( forceAlpha !== false ) {
			newValue = setGradientAlpha( newValue, forceAlpha, parseGradient );
		}
		setLocalValue( newValue );
		newValue = transformGradientColorsToVariables( newValue );
		onChange( newValue );
	};

	const setPresetGradient = ( newValue ) => {
		if ( forceAlphaForPreset !== false ) {
			newValue = setGradientAlpha(
				newValue,
				forceAlphaForPreset,
				parseGradient
			);
		}
		setGradient( newValue );
	};

	useEffect( () => {
		if ( forceAlpha !== false && localValue ) {
			const newValue = setGradientAlpha(
				localValue,
				forceAlpha,
				parseGradient
			);
			setLocalValue( newValue );
		}
	}, [ forceAlpha ] );

	const className = classnames(
		'kubio-gradient-picker-wrapper',
		'kubio-control',
		{
			'kubio-is-kubio-editor': window.isKubioBlockEditor,
			'kubio-is-default-editor': ! window.isKubioBlockEditor,
		}
	);

	return (
		<div className={ className }>
			<BaseControl className="kubio-gradient-picker__label">
				{ label }
			</BaseControl>
			<GradientPickerPopover
				value={ localValue }
				onChange={ setPresetGradient }
				presetsNumber={ presetsNumber }
				withPreviewer={ withPreviewer }
			/>
			<div className={ 'kubio-gradient-custom-picker' }>
				<CustomGradientPicker
					value={ localValue }
					onChange={ setGradient }
					alpha={ true }
					showExternalOpacityControl={ showExternalOpacityControl }
				/>
			</div>
		</div>
	);
};
export { GradientPickerPopover };
export default GradientControlWithPresets;
