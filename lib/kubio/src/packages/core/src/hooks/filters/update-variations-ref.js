import { useGlobalSessionProp } from '@kubio/editor-data';
import { queueCall } from '@kubio/utils';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useRegistry, useSelect } from '@wordpress/data';
import { useLayoutEffect } from '@wordpress/element';
import _, { find, get, isArray, set } from 'lodash';
import generateShortID from 'shortid';
import { isKubioEditor } from '../..';
import { hasKubioSupport } from '@kubio/utils';

const walkTemplateInnerBlocks = ( blocks, callback ) => {
	blocks = ! isArray( blocks ) ? [ blocks ] : blocks;

	blocks.forEach( ( block ) => {
		if ( ! block ) {
			return;
		}
		callback( block );
		walkTemplateInnerBlocks( block[ 2 ] || [], callback );
	} );
};

const updateBlocksDefaultVariations = ( blockName, registry ) =>
	window.requestIdleCallback( () => {
		const state = registry.stores[ 'core/blocks' ]?.store.getState();

		if ( ! state ) {
			return;
		}

		if ( blockName.startsWith( 'kubio/' ) ) {
			//Clone deep is used for this bug: https://mantis.iconvert.pro/view.php?id=51057
			const variations = _.cloneDeep(
				state.blockVariations[ blockName ] || []
			);
			const defaultVariation = find( variations, { isDefault: true } );

			if ( defaultVariation ) {
				set(
					defaultVariation,
					`attributes.kubio.styleRef`,
					generateShortID()
				);
				set(
					defaultVariation,
					`attributes.kubio.hash`,
					generateShortID()
				);

				const refsMap = {};
				walkTemplateInnerBlocks(
					defaultVariation.innerBlocks,
					( block ) => {
						const currentRef = get(
							block,
							`1.kubio.styleRef`,
							generateShortID()
						);

						if ( currentRef ) {
							refsMap[ currentRef ] =
								refsMap[ currentRef ] || generateShortID();
							set(
								block,
								`1.kubio.styleRef`,
								refsMap[ currentRef ]
							);
						} else {
							set( block, `1.kubio.styleRef`, generateShortID() );
						}
						set( block, `1.kubio.hash`, generateShortID() );
					}
				);
			}
			state.blockVariations[ blockName ] = variations;
		}
	} );

const updateBlocksVariationsQueue = queueCall( ( queue ) => {
	const processed = [];

	for ( const pair of queue ) {
		if ( processed.includes( pair[ 0 ] ) ) {
			continue;
		}

		processed.push( pair[ 0 ] );

		updateBlocksDefaultVariations( ...pair );
	}
}, 100 );

const KubioUpdateVariationsRef = ( { BlockListBlock, ...props } ) => {
	const { wasBlockJustInserted } = useSelect( ( select ) =>
		select( 'core/block-editor' )
	);

	const registry = useRegistry();
	const justInserted = wasBlockJustInserted?.( props.clientId );
	const [ variationsLoaded ] = useGlobalSessionProp( 'variations-loaded' );
	useLayoutEffect( () => {
		if ( justInserted && variationsLoaded && isKubioEditor() ) {
			updateBlocksVariationsQueue( props.name, registry );
		}
	}, [ justInserted, props.name, registry, variationsLoaded ] );

	return <BlockListBlock { ...props } />;
};

const withUpdateVariationsRef = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			if ( ! hasKubioSupport( props.name ) ) {
				return <BlockListBlock { ...props } />;
			}

			return (
				<KubioUpdateVariationsRef
					BlockListBlock={ BlockListBlock }
					{ ...props }
				/>
			);
		};
	},
	'withLocalId'
);

export { withUpdateVariationsRef };
