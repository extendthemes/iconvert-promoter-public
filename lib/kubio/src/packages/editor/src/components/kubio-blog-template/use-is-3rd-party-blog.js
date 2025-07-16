import { STORE_KEY } from '@kubio/constants';
import {
	useGetGlobalSessionProp,
	useSetGlobalSessionProp,
} from '@kubio/editor-data';
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { BLOG_BLOCK_TEMPLATES } from './const';

const useIsThirdPartyBlog = () => {
	const isReady = useGetGlobalSessionProp('ready', false);
	const urlTemplatesMap = useGetGlobalSessionProp('urlBasedTemplatesMap', {});
	const setUrlTemplatesMap = useSetGlobalSessionProp(
		'urlBasedTemplatesMap',
		{}
	);
	const [isThirdPartyBlog, setIsThirdPartyBlog] = useState(false);

	const { getEntity, page, templateType, templateId } = useSelect(
		(select) => {
			const { getEditedEntityRecord } = select('core');
			const { getPage, getEditedPostType, getEditedPostId } = select(
				STORE_KEY
			);

			return {
				getEntity: getEditedEntityRecord,
				page: getPage(),
				templateType: getEditedPostType(),
				templateId: getEditedPostId(),
			};
		},
		[]
	);

	useEffect(() => {
		if (!isReady) {
			setIsThirdPartyBlog(false);
		}
	}, [isReady]);

	const handleBlockTemplateBlogArea = useCallback(() => {
		const template = getEntity('postType', templateType, templateId);
		const templateSource = template?.kubio_template_source;
		setIsThirdPartyBlog(
			!['kubio', 'kubio-custom'].includes(templateSource)
		);
	}, [templateId, templateType]);

	const handleClassicThemeBlogArea = useCallback(async () => {
		if (!page?.path) {
			return;
		}

		let templateSlug = urlTemplatesMap[page?.path];
		let success = true;

		if (!templateSlug && templateSlug !== null) {
			const response = await window
				.fetch(
					addQueryArgs(page?.path, {
						'__kubio-classic-page-template-slug': 1,
					})
				)
				.then((res) => res.json());

			templateSlug = response.data || null;

			setUrlTemplatesMap({
				...urlTemplatesMap,
				[page?.path]: templateSlug,
			});
			success = response.success;
		}
		setIsThirdPartyBlog(
			success && BLOG_BLOCK_TEMPLATES.includes(templateSlug)
		);
	}, [page, urlTemplatesMap]);

	const onReady = useCallback((currentTemplateId, currentTemplateType) => {
		if (currentTemplateId && currentTemplateType) {
			const templateSlug = currentTemplateId?.split('//')?.pop();

			if (BLOG_BLOCK_TEMPLATES.includes(templateSlug)) {
				handleBlockTemplateBlogArea();
			} else {
				setIsThirdPartyBlog(false);
			}
		} else {
			handleClassicThemeBlogArea();
		}
	}, []);

	useEffect(() => {
		if (isReady) {
			onReady(templateId, templateType);
		}
	}, [isReady, templateId, templateType]);

	return isThirdPartyBlog;
};

export { useIsThirdPartyBlog };
