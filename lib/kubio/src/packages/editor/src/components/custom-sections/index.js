import { registerPattern } from '@kubio/block-patterns';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const KubioCustomSection = () => {
	const [ids, setIds] = useState([]);
	const savedSections = useSelect((select) => {
		const { getEntityRecords } = select('core');
		return getEntityRecords('postType', 'kubio_section', {
			per_page: -1,
		});
	}, []);

	const customCategoryValue = 'kubio-content/custom';

	useEffect(() => {
		let currentIds = ids;

		savedSections?.forEach((section) => {
			if (ids.includes(section.id)) {
				return;
			}

			const customPattern = {
				name: `${customCategoryValue}/custom-section/${section.id}`,
				title: section.title.rendered,
				categories: [customCategoryValue],
				description: __('Custom section', 'kubio'),
				screenshot: false,
				fromColibri: true,
				fromFirebase: true,
				isCustomSection: true,
				isProOnFree: false,
				isGutentagPattern: true,
				content: JSON.parse(section.content.raw),
			};

			registerPattern(customPattern);
			currentIds = [...currentIds, section.id];
		});

		setIds(currentIds);
	}, [savedSections, ids]);

	return null;
};

export { KubioCustomSection };
