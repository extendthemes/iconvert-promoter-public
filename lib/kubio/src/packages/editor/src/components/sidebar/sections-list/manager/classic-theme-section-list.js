import { select as storeSelect, useSelect } from '@wordpress/data';
import { useGlobalSessionProp } from '@kubio/editor-data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SectionsListArea } from '../index';
import { PlaceholderSectionListArea } from './placeholder-section-list-area';
import _ from 'lodash';
import { STORE_KEY as KUBIO_STORE_KEY } from '@kubio/constants';
function ClassicThemeSectionList(props) {
	const { templateParts, selectBlock, removeBlocks, reorderBlocks } = props;
	const { blockTypes, getBlocks, isPage } = useSelect((select) => {
		const { getPage } = select(KUBIO_STORE_KEY);
		const siteData = storeSelect('core').getEditedEntityRecord(
			'root',
			'site'
		);

		let currentPage;
		if (getPage) {
			currentPage = getPage();
		}

		const context = _.get(currentPage, 'context', {});
		const { postType, postId } = context;
		const showPageOnFront = siteData?.show_on_front === 'page';
		const isBlogPage =
			showPageOnFront &&
			parseInt(siteData?.page_for_posts) === parseInt(postId);
		const isPage_ = postType === 'page' && !isBlogPage;

		return {
			isPage: isPage_,
			blockTypes: select('core/blocks').getBlockTypes(),
			getBlocks: select('core/block-editor').getBlocks,
		};
	});

	const [currentPageHasBlockContent] = useGlobalSessionProp(
		'currentPageHasBlocksContent',
		true,
		[]
	);

	const classicThemeZone = useMemo(() => {
		const sectionsListAreaProps = {
			selectBlock,
			removeBlocks,
			reorderBlocks,
			innerBlocks: getBlocks(),
			templatePart: {},
			blockTypes,
			label: __('Content', 'kubio'),
		};

		return (
			currentPageHasBlockContent && (
				<SectionsListArea {...sectionsListAreaProps} />
			)
		);
	}, [templateParts, currentPageHasBlockContent]);
	return (
		<>
			{isPage && <PlaceholderSectionListArea area={'header'} />}
			{classicThemeZone}
			{isPage && <PlaceholderSectionListArea area={'footer'} />}
		</>
	);
}

export { ClassicThemeSectionList };
