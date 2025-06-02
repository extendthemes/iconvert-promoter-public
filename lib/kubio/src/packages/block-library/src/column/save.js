import { InnerBlocks } from '@wordpress/block-editor';

import { ColumnSave } from './component';
import blockType from './block.json';

export default function save(props) {
	return (
		// <ColumnSave blockType={blockType} {...props} save={true}>
		<InnerBlocks.Content />
		// </ColumnSave>
	);
}
