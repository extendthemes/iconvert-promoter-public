import { TEMPLATE_OVERRIDES } from './constants';

export function isTemplateSuperseded(slug, existingSlugs, showOnFront) {
	if (!TEMPLATE_OVERRIDES[slug]) {
		return false;
	}

	// `home` template is unused if it is superseded by `front-page`
	// or "show on front" is set to show a page rather than blog posts.
	if (slug === 'home' && showOnFront !== 'posts') {
		return true;
	}

	return TEMPLATE_OVERRIDES[slug].every(
		(overrideSlug) =>
			existingSlugs.includes(overrideSlug) ||
			isTemplateSuperseded(overrideSlug, existingSlugs, showOnFront)
	);
}
