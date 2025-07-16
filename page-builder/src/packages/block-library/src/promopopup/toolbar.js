import { __ } from '@wordpress/i18n';
import {
	BlockVerticalAlignmentToolbar,
	BlockAlignmentToolbar,
	BlockControls,
} from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';

const ContainerToolbar = ( { computed } ) => {
	const { align, alignH } = computed;

	return (
		<BlockControls>
			<ToolbarGroup>
				<BlockVerticalAlignmentToolbar
					value={ align.value }
					onChange={ align.onChange }
				/>
				<BlockAlignmentToolbar
					value={ alignH.value }
					onChange={ alignH.onChange }
				/>
			</ToolbarGroup>
		</BlockControls>
	);
};
export { ContainerToolbar };
