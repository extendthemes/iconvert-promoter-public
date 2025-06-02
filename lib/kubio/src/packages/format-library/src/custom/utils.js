import { getActiveFormat } from '@wordpress/rich-text';
import { KUBIO_BLOCK_PREFIX } from '../../../constants';

function getActivePropertyCssValue(propertyName, formatName, formatValue) {
	const formatted = getActiveFormat(formatValue, formatName);
	if (!formatted) {
		return;
	}

	const style = formatted.attributes.style;
	if (style) {
		const regex = new RegExp(`${propertyName}:(.*?)(;|$)`);
		const propertyValue = style.match(regex)?.[1]?.trim();

		return propertyValue;
	}
}

const isInsideKubioBlock = (contentRef) => {
	return (
		contentRef.current
			?.closest('[data-type]')
			?.getAttribute('data-type')
			?.startsWith(`${KUBIO_BLOCK_PREFIX}/`) || false
	);
};

export { getActivePropertyCssValue, isInsideKubioBlock };
