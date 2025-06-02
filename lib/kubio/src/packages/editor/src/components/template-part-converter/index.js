/**
 * WordPress dependencies
 */
import { getNamesOfBlocks } from '@kubio/block-library';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import ConvertToRegularBlocks from './convert-to-regular';
import ConvertToTemplatePart from './convert-to-template-part';

export default function TemplatePartConverter() {
	const { clientIds, blocks } = useSelect((select) => {
		const { getSelectedBlockClientIds, getBlocksByClientId } = select(
			'core/block-editor'
		);
		const selectedBlockClientIds = getSelectedBlockClientIds();
		return {
			clientIds: selectedBlockClientIds,
			blocks: getBlocksByClientId(selectedBlockClientIds),
		};
	});

	// Allow converting a single template part to standard blocks.
	const { HEADER, FOOTER } = getNamesOfBlocks();
	const templatePartsBlocks = [
		'core/template-part',
		'core/post-content',
		HEADER,
		FOOTER,
	];

	if (blocks.length === 1 && blocks[0]?.name === 'core/template-part') {
		return <ConvertToRegularBlocks clientId={clientIds[0]} />;
	}

	if (
		blocks.length === 1 &&
		blocks[0]?.name &&
		templatePartsBlocks.indexOf(templatePartsBlocks) === -1
	) {
		return <ConvertToTemplatePart clientIds={clientIds} blocks={blocks} />;
	}

	return <></>;
}
