import { withColibriPathWithOptions } from '@kubio/core';
import { BoxShadowPopup } from '../box-shadow';

const BoxShadowPopupWithPath = withColibriPathWithOptions({
	mergeArrays: true,
})(BoxShadowPopup);

export { BoxShadowPopupWithPath };
