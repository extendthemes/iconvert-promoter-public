import { getBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

addFilter(
	'kubio.beforeInsertBlock',
	'kubio/pro/blocks',
	( item, hooks = {} ) => {
		const blockType = getBlockType( item?.name );

		item.isProOnFree = blockType.isPro;
		if ( item.isProOnFree ) {
			item.disabled = true;
			item.isDisabled = true;
		}

		return item;
	}
);
