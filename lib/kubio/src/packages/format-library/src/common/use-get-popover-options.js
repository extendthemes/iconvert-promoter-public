import { useAnchor, useAnchorRef } from '@wordpress/rich-text';

import { getPopoverAnchorRef } from './get-popover-anchor-ref';
import { wpVersionCompare } from '@kubio/utils';

// eslint-disable-next-line camelcase
const wpLessThen6_4 = wpVersionCompare( '6.4', '<' );

const useGetPopoverOptions = ( { contentRef, settings, value } ) => {
	const popoverOptions = {};
	// eslint-disable-next-line camelcase
	if ( wpLessThen6_4 ) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const anchorRef = useAnchorRef( {
			ref: contentRef,
			value,
			settings,
		} );

		popoverOptions.anchorRef = getPopoverAnchorRef( anchorRef, contentRef );
	} else {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const popoverAnchor = useAnchor( {
			editableContentElement: contentRef.current,
			value,
			settings,
		} );
		popoverOptions.anchor = popoverAnchor;
	}

	return { popoverOptions };
};
export { useGetPopoverOptions };
