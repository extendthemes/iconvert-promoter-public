import { initAdmin } from '@kubio/admin-panel';
import { STORE_KEY } from '@kubio/constants'; 
import {
	AncestorNotice,
	ControlNotice,
	GutentagSelectControl,
	LinkedNotice,
} from '@kubio/controls';
import {
	DataHelperDefaultOptionsContext,
	KubioBlockContext,
	getBlockAncestor,
	getBlockDefaultElement,
	getBlockElements,
	useAncestorContext,
	useDataHelperDefaultOptionsContext,
	useKubioDataHelper,
} from '@kubio/core';
import {
	AdvancedInspectorControls,
	BlockInspectorTopControls,
} from '@kubio/inspectors';
import { StylesEnum } from '@kubio/style-manager';
import { PanelBody } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { select as storeSelect, useSelect } from '@wordpress/data';
import { useEffect, useMemo, useReducer, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { Log } from '@kubio/log';

import { AvailableStyles, AvailableStylesOrder } from './available-styles';
import { StatesControl, getAvailableElementStates } from './states-control';
import { hasBlockSupport } from '@wordpress/blocks';

import {
	ProModalTextContext,
	useProModal,
	isFreeVersion,
	ProBadge,
	UpgradeToProOverlay,
} from '@kubio/pro';

const ElementStyles = ( props ) => {
	const { styles, selectedStyledElement, dataHelper, showContent } = props;
	const orderedStyles = AvailableStylesOrder.filter( ( item ) => {
		return styles.includes( item );
	} ).filter( Boolean );
	return orderedStyles.map( ( style ) => (
		<AdvancedStyleSection
			key={ style }
			style={ style }
			selectedStyledElement={ selectedStyledElement }
			dataHelper={ dataHelper }
			showContent={ showContent }
		/>
	) );
};

const AdvancedStyleSection = ( {
	style,
	selectedStyledElement,
	dataHelper,
	showContent = true,
} ) => {
	const { defaultOptions } = useDataHelperDefaultOptionsContext();
	const availableStyle = AvailableStyles[ style ];
	if ( ! availableStyle ) {
		// eslint-disable-next-line no-console
		// Log.error( `Advanced panel: "${ style }" does not exists` );
		return <></>;
	}
	

	const {
		control: StyleControl,
		mapsToStyle = true,
		shouldRender = () => true,
		options = {},
	} = availableStyle;
	const pathProps = mapsToStyle
		? dataHelper.useStylePath(
				style,
				{
					...defaultOptions,
					...options,
				},
				{}
		  )
		: { dataHelper };

	const filters = _.get(
		selectedStyledElement,
		[ 'supports', 'filters', style ],
		{}
	);
	let title = '';
	if ( typeof AvailableStyles[ style ].title === 'function' ) {
		title = AvailableStyles[ style ].title( { filters } );
	} else {
		title = AvailableStyles[ style ].title;
	}

	const state = _.get( defaultOptions, 'state' );

	const controlProps = {
		dataHelper,
		property: style,
		state,
		...pathProps,
		filters,
		styledElement: selectedStyledElement.name,
	};

	return (
		shouldRender( controlProps ) && (
			<PanelBody
				key={ `panel-${ style }` }
				classname={ 'kubio-advanced-panel-panelbody' }
				title={ title }
				initialOpen={ false }
			>
				{ showContent && <StyleControl { ...controlProps } /> }
			</PanelBody>
		)
	);
};

let canShowAdvanced = false;



const AdvancedPanelControls = ( props ) => {
	const { name, clientId } = props;

	const { blockDefinition, getBlock } = useSelect( ( select ) => ( {
		blockDefinition: select( 'core/blocks' ).getBlockType( name ),
		getBlock: select( 'core/block-editor' ).getBlock,
	} ) );

	const { displayAdvancedPanelFor } = blockDefinition;
	const displayFor = displayAdvancedPanelFor
		? displayAdvancedPanelFor( clientId, storeSelect )
		: null;

	const usedBlockName = displayFor ? getBlock( displayFor ).name : name;

	const elements = getBlockElements( usedBlockName, false, true );

	const defaultElement =
		getBlockDefaultElement( usedBlockName ) || elements[ 0 ];
	const [ activeState, setActiveState ] = useState( '' );
	const [ selectedElement, setSelectedElement ] = useState( defaultElement );

	const elementStyles = _.get( selectedElement, 'supports.styles', [] );

	const elementsItems = useMemo(
		() =>
			elements.reduce( ( result, element ) => {
				const { items } = element;
				if ( items ) {
					result = [ ...result, ...items ];
				} else {
					result = [ ...result, element ];
				}
				return result;
			}, [] ),
		[ elements ]
	);
	const styledComponent = selectedElement?.name;

	// ensure recreating data helper when displayFor exists
	const block = useSelect(
		( select ) =>
			select( 'core/block-editor' ).getBlock(
				displayFor ? displayFor : clientId
			),
		[ displayFor, clientId ]
	);

	const { dataHelper } = useKubioDataHelper( block );

	const selectedBlockName = dataHelper?.blockName;
	
	const defaultOptions = {
		state: activeState,
		styledComponent,
	};

	const defaultsValue = useDataHelperDefaultOptionsContext( {
		defaultOptions,
	} );

	if ( ! elementStyles.length ) {
		return (
			<div className="kubio-editing-header">
				<ControlNotice
					content={ __(
						'Current block does not support advanced styling',
						'kubio'
					) }
				/>
			</div>
		);
	}

	const visibleElementsStyleNumber = elementsItems.filter(
		( elementItem ) => ! elementItem.internal
	).length;

	if (
		dataHelper.kubioSupports( 'advanced.responsive', true ) &&
		( selectedElement.wrapper || visibleElementsStyleNumber <= 1 )
	) {
		elementStyles.push( StylesEnum.RESPONSIVE );
	}

	if (
		dataHelper.kubioSupports( 'advanced.misc', true ) &&
		( selectedElement.wrapper || visibleElementsStyleNumber <= 1 )
	) {
		elementStyles.push( StylesEnum.MISC );
	}
	if (
		hasBlockSupport(
			dataHelper?.blockName,
			'kubio.appearanceEffect',
			false
		)
	) {
		elementStyles.push( StylesEnum.APPEARANCE );
	}
	const availableStates = getAvailableElementStates( { selectedElement } );

	return (
		<div style={ { position: 'relative' } }>
			<DataHelperDefaultOptionsContext.Provider value={ defaultsValue }>
				<UpgradeToProOverlay
					show={ ! canShowAdvanced }
					urlArgs={ {
						source: 'sidebar-advanced/' + selectedBlockName,
						content: selectedBlockName,
					} }
				/>
				<KubioBlockContext.Provider value={ { dataHelper } }>
					{ ( elements.length > 1 || availableStates.length > 1 ) && (
						<div className="kubio-editing-header">
							{ elements.length > 1 && (
								<GutentagSelectControl
									className="kubio-editing-select"
									label={ __( 'Editing', 'kubio' ) }
									value={ selectedElement?.name }
									onChange={ ( value ) => {
										setSelectedElement(
											elementsItems.find(
												( item ) => item.name === value
											)
										);
										// reset state to normal to fix the case when the current styled element does not support current state
										setActiveState( '' );
									} }
									options={ elements }
								/>
							) }
							<StatesControl
								label={ __( 'State', 'kubio' ) }
								activeState={ activeState }
								setActiveState={ ( value ) => {
									setActiveState(
										value === 'normal' ? '' : value
									);
								} }
								selectedElement={ selectedElement }
								availableStates={ availableStates }
							/>
						</div>
					) }

					<ElementStyles
						{ ...props }
						styles={ elementStyles }
						selectedStyledElement={ selectedElement }
						dataHelper={ dataHelper }
						showContent={ true }
						showContent={ canShowAdvanced }
					/>
				</KubioBlockContext.Provider>
			</DataHelperDefaultOptionsContext.Provider>
		</div>
	);
};

const AdvancedInspectorPanel = ( props ) => {
	const isGutentagDebug = useSelect(
		( select ) =>
			select( STORE_KEY ) ? select( STORE_KEY ).isGutentagDebug() : false,
		[]
	);

	return (
		<AdvancedInspectorControls clientId={ props.clientId }>
			<AdvancedPanelControls { ...props } />
		</AdvancedInspectorControls>
	);
};

const withInspectorControlsAdvancedPanel = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const blockSupportsAncestor = getBlockAncestor( props?.name );
			const { ancestor } = useAncestorContext();

			let defaultOptions = {};
			if ( blockSupportsAncestor && ancestor === blockSupportsAncestor ) {
				defaultOptions = {
					ancestor,
				};
			}

			if ( blockSupportsAncestor ) {
				defaultOptions.inheritedAncestor = blockSupportsAncestor;
			}

			const overwrite = {
				defaultOptions,
			};

			const defaultsValue =
				useDataHelperDefaultOptionsContext( overwrite );

			// console.error('defaultsValue ->', defaultsValue);
			return (
				<DataHelperDefaultOptionsContext.Provider
					value={ defaultsValue }
				>
					<BlockEdit { ...props } />
					{ props.isSelected && (
						<>
							<AdvancedInspectorPanel { ...props } />
							<BlockInspectorTopControls>
								<LinkedNotice { ...props } />
								<AncestorNotice />
							</BlockInspectorTopControls>
						</>
					) }
				</DataHelperDefaultOptionsContext.Provider>
			);
		};
	},
	'withInspectorControlsAdvancedPanel'
);

export {
	AdvancedInspectorPanel,
	StatesControl,
	withInspectorControlsAdvancedPanel,
};
