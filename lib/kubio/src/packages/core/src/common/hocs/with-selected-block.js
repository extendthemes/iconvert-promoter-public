import { withDispatch, withSelect } from '@wordpress/data';
import { getBlockType } from '@wordpress/blocks';
import { compose } from '@wordpress/compose';

const applyWithSelect = withSelect( ( select ) => {
	const {
		getSelectedBlockClientId,
		getSelectedBlockCount,
		getBlockName,
		getBlockAttributes,
	} = select( 'core/block-editor' );
	const { getBlockStyles } = select( 'core/blocks' );
	const clientId = getSelectedBlockClientId();
	const blockName = clientId && getBlockName( clientId );
	const blockType = clientId && getBlockType( blockName );
	const blockStyles = clientId && getBlockStyles( blockName );
	const attributes = getBlockAttributes( clientId ) || {};

	return {
		count: getSelectedBlockCount(),
		hasBlockStyles: blockStyles && blockStyles.length > 0,
		blockName,
		clientId,
		blockType,
		attributes,
	};
} );

const applyWithDispatch = withDispatch( ( dispatch, ownProps, { select } ) => {
	const { updateBlockAttributes } = dispatch( 'core/block-editor' );

	const setAttributes = ( newAttributes ) => {
		const { clientId, isFirstMultiSelected, multiSelectedClientIds } =
			ownProps;
		const clientIds = isFirstMultiSelected
			? multiSelectedClientIds
			: [ clientId ];

		updateBlockAttributes( clientIds, newAttributes );
	};

	return {
		setAttributes,
	};
} );

const withSelectedBlock = compose( applyWithDispatch, applyWithSelect );

export { withSelectedBlock };
