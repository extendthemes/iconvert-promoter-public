import { addFilter } from '@wordpress/hooks';
import NamesOfBlocks from '../blocks-list';

// the button block doesn't have a text align option, it should allow the parent block to set text align.
addFilter(
	'kubio.useInheritTextAlign',
	NamesOfBlocks.BUTTON,
	(blockName, use = true) => {
		if (blockName === 'cspromo/button') {
			return false;
		}

		return use;
	}
);
