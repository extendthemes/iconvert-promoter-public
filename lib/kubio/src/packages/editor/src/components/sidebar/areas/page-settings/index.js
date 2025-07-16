import { STORE_KEY as KUBIO_STORE_KEY, STORE_KEY } from '@kubio/constants';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import SubSidebarArea from '../../subsidebar-area';
import DiscussionPanel from './discussion-panel';
import FeaturedImage from './featured-image';
import PageAttributes from './page-attributes';
import PostExcerpt from './post-excerpt';
import PostLink from './post-link';
import PostTaxonomies from './post-taxonomies';
import QueryLayout from './query-layout';
import Template from './template';

const supportedPostTypes = ['page', 'post', 'product'];

const PageSettingsWrapper = ({ areaIdentifier }) => {
	const { currentSidebar, isInnerPage, isWooPage } = useSelect((select) => {
		return {
			isWooPage: select(STORE_KEY).getIsWooCommercePage(),
			currentSidebar: select(STORE_KEY).getEditorOpenedSidebar(),
			isInnerPage: select(STORE_KEY).getIsInnerPage(),
		};
	}, []);

	const shouldRender = currentSidebar?.endsWith(areaIdentifier);
	const showTemplate = isInnerPage && !isWooPage;
	return (
		<span className={'kubio-page-settings'}>
			{shouldRender && (
				<>
					<QueryLayout />
					{showTemplate && <Template />}
					<PostLink />
					<PostTaxonomies />
					<FeaturedImage />
					<PostExcerpt />
					<DiscussionPanel />
					<PageAttributes />
				</>
			)}
		</span>
	);
};

export default function PageSettingsArea({ parentAreaIdentifier }) {
	const AREA_IDENTIFIER = `${parentAreaIdentifier}/page-settings`;
	const { postType } = useSelect((select) => {
		const { getCurrentPostType } = select(KUBIO_STORE_KEY);
		return {
			postType: getCurrentPostType(),
		};
	}, []);
	const supportsPageSettings = supportedPostTypes.includes(postType);
	if (!supportsPageSettings) {
		return null;
	}
	return (
		<>
			<SubSidebarArea
				title={__('Page Settings', 'kubio')}
				areaIdentifier={AREA_IDENTIFIER}
			>
				<PageSettingsWrapper areaIdentifier={AREA_IDENTIFIER} />
			</SubSidebarArea>
		</>
	);
}
