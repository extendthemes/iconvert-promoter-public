import {
	regenerateStyleRef,
	useGetAllBlocksWithStyleRef,
	flattenBlockTree,
} from '@kubio/core';
import { refreshBlockStyleRefs } from '@kubio/utils';
import {
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	PanelBody,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useRef } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { sprintf, _n, __ } from '@wordpress/i18n';
import _, { cloneDeep } from 'lodash';

const LinkedNotice = ( props ) => {
	// START - Filter for which block we take syleRef.
	const { hooks, unlinkChildren } = useSelect( ( select ) => {
		return {
			hooks: {
				getBlockOrder: select( 'core/block-editor' ).getBlockOrder,
				getBlock: select( 'core/block-editor' ).getBlock,
			},
			unlinkChildren: select( 'core/blocks' ).getBlockType( props.name )
				?.supports?.kubio?.unlinkStyleIncludesChildren,
		};
	} );
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );
	const defaultValue = {
		name: props.name,
		clientId: props.clientId,
		attributes: props.attributes,
	};
	const filteredProps = applyFilters(
		'kubio.get-linked-block',
		defaultValue,
		hooks
	);
	// END - Filter for which block we take syleRef.

	const { attributes } = filteredProps;

	const styleRef = attributes.kubio?.styleRef;
	const sameRefBlocks = useGetAllBlocksWithStyleRef( styleRef );
	const noOfStyles = sameRefBlocks ? sameRefBlocks.length : 0;

	const shouldAllowUnlink = useRef(
		applyFilters( 'kubio.should-allow-unlink', true, filteredProps )
	);

	const unlink = () => {
		// eslint-disable-next-line no-shadow
		const defaultValue = {
			name: props.name,
			clientId: props.clientId,
			attributes: props.attributes,
		};
		// eslint-disable-next-line no-shadow
		const filteredProps = applyFilters(
			'kubio.get-linked-block',
			defaultValue,
			hooks
		);

		// eslint-disable-next-line no-shadow
		const { clientId, attributes } = filteredProps;

		if ( unlinkChildren ) {
			const block = refreshBlockStyleRefs(
				cloneDeep( hooks.getBlock( clientId ) )
			);
			const blocks = flattenBlockTree( block );
			updateBlockAttributes( blocks.keys(), blocks, true );
		} else {
			updateBlockAttributes( clientId, regenerateStyleRef( attributes ) );
		}
	};

	if ( ! shouldAllowUnlink.current ) {
		return <></>;
	}
	return (
		<>
			{ noOfStyles > 1 && (
				<PanelBody title={ '' }>
					<Flex>
						<FlexBlock>
							<span style={ { marginRight: '6px' } }>
								{ sprintf(
									// translators: %s is the number of blocks
									_n(
										'Style shared with %s other block',
										'Style shared with %s other blocks',
										noOfStyles - 1,
										'kubio'
									),
									noOfStyles - 1
								) }
							</span>
						</FlexBlock>
						<FlexItem>
							<Button onClick={ unlink } isLink>
								{ __( 'Unlink', 'kubio' ) }
							</Button>
						</FlexItem>
					</Flex>
				</PanelBody>
			) }
		</>
	);
};

export { LinkedNotice };
