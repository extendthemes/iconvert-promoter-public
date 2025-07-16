import { useQueryLayout } from '@kubio/block-library';
import { SelectWithIconControl } from '@kubio/controls';
import { useKubioDataHelper } from '@kubio/core';
import { findBlockByName } from '@kubio/utils';
import { PanelBody } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { useSelect, withSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
// import { QueryLayoutCheck } from './query-layout-check';
import _ from 'lodash';

function QueryLayoutContent({ layoutBlock }) {
	const { dataHelper } = useKubioDataHelper(layoutBlock);
	const layout = useQueryLayout(dataHelper);

	return <SelectWithIconControl label={__('Layout', 'kubio')} {...layout} />;
}

function QueryLayout(props) {
	const { currentPage } = props;
	const { getBlocks } = useSelect('core/block-editor');

	const postId = _.get(currentPage, ['context', 'postId']);
	const [layoutBlock, setLayoutBlock] = useState();
	useEffect(() => {
		const blocks = getBlocks();
		const block = findBlockByName(blocks, 'kubio/query-layout');
		setLayoutBlock(block);
	}, [postId]);

	if (!layoutBlock) {
		return null;
	}
	return (
		<PanelBody title={__('Blog layout', 'kubio')} initialOpen={true}>
			<QueryLayoutContent {...props} layoutBlock={layoutBlock} />
		</PanelBody>
	);
}

export default compose([
	withSelect((select) => {
		const { getPage = _.noop } = select('kubio/edit-site') || {};
		const currentPage = getPage();
		return {
			currentPage,
		};
	}),
])(QueryLayout);
