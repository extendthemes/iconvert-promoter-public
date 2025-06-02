import { addFilter } from '@wordpress/hooks';

addFilter(
	'kubio.block-library.post-content.showRenderedContent',
	'kubio-child',
	( showRenderedPostContent, postType ) => {
		if ( postType === 'cs-promo-popups' ) {
			return false;
		}
		return showRenderedPostContent;
	}
);
addFilter(
	'kubio.block-library.post-content.showLayoutPicker',
	'kubio-child',
	() => {
		return false;
	}
);
addFilter(
	'kubio.block-library.post-content.templateLock',
	'kubio-child',
	() => {
		return 'insert';
	}
);

addFilter(
	'kubio.block-library.addAppearanceEffectFilter',
	'kubio-child',
	() => {
		return false;
	}
);

const BLOCKS_WITH_HIDDEN_LOCK_OPTION = [
	'core/post-content',
	'cspromo/promopopup',
];
addFilter(
	'kubio.show-block-lock-options',
	'kubio.show-block-lock-options-popup-and-content',
	( value, clientId, blockName ) => {
		if ( BLOCKS_WITH_HIDDEN_LOCK_OPTION.includes( blockName ) ) {
			return false;
		}

		return value;
	}
);

addFilter(
	'kubio.can-remove-block',
	'kubio.can-remove-block-popup-and-content',
	( value, blocks ) => {
		for ( const block of blocks ) {
			if ( BLOCKS_WITH_HIDDEN_LOCK_OPTION.includes( block?.name ) ) {
				return false;
			}
		}

		return value;
	}
);
