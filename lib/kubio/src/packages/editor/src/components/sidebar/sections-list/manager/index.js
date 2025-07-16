import { STORE_KEY as KUBIO_STORE_KEY } from '@kubio/constants';
import { useDeepMemo } from '@kubio/core';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import _ from 'lodash';
import { TEMPLATE_PARTS_AREAS, TEMPLATE_PARTS_AREAS_ORDER } from '../index';
import { ClassicThemeSectionList } from './classic-theme-section-list';
import { KubioSectionList } from './kubio-section-list';

function SectionListManager({ templateParts, ...props }) {
	const pageHasFSETemplate = useSelect((select) => {
		const { currentPageHasFSETemplate } = select(KUBIO_STORE_KEY);
		return currentPageHasFSETemplate();
	}, []);

	const allTemplateParts = useSelect((select) => {
		return (
			select('core').getEntityRecords('postType', 'wp_template_part', {
				per_page: -1,
			}) || []
		);
	}, []);

	const templatePartsWithArea = useDeepMemo(() => {
		return templateParts.map((part) => {
			const templateData = allTemplateParts.find(
				(item) => item?.slug === part?.attributes?.slug
			);
			let area = templateData?.area;

			return { ...part, area };
		});
	}, [templateParts, allTemplateParts]);

	const orderedTemplatePartsWithArea = useDeepMemo(() => {
		return _.orderBy(templatePartsWithArea, (templatePart) =>
			_.findIndex(TEMPLATE_PARTS_AREAS_ORDER, (areaName) => {
				const templatePartArea = _.get(
					templatePart,
					'area',
					TEMPLATE_PARTS_AREAS.CONTENT
				);
				return areaName === templatePartArea;
			})
		);
	}, [templatePartsWithArea]);

	let Component = null;

	if (!pageHasFSETemplate) {
		Component = ClassicThemeSectionList;
	} else {
		Component = KubioSectionList;
	}

	return (
		<Component {...props} templateParts={orderedTemplatePartsWithArea} />
	);
}

export { SectionListManager };
