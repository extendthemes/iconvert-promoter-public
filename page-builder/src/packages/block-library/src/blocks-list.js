import { name as promopopup } from './promopopup/block.json';
import { name as promopopupclose } from './promopopup/blocks/promopopup-close/block.json';
import { name as promopopupoverflow } from './promopopup/blocks/promopopup-overflow-container/block.json';

import { name as buttongroupExtended } from './button-group/block.json';
import { name as buttonExtended } from './button/block.json';
import { name as countdown } from './countdown/block.json';
import { name as countdownitem } from './countdown/blocks/countdown-item/block.json';
import { name as countdownseparator } from './countdown/blocks/countdown-separator/block.json';
import { name as subscribe } from './subscribe/block.json';
import { name as yesNo } from './yes-no/block.json';
import { name as yesNoInner } from './yes-no/blocks/yes-no-inner/block.json';

import { replaceKubioBlockName } from '@cspromo/utils';
import { addFilter } from '@wordpress/hooks';
import _ from 'lodash';

const NamesOfBlocks = {
	PROMOPOPUPOVERFLOW: promopopupoverflow,
	PROMOPOPUPCLOSE: promopopupclose,
	promopopup,
	COUNTDOWNSEPARATOR: countdownseparator,
	COUNTDOWNITEM: countdownitem,
	countdown,
	subscribe,
	BUTTON_EXTENDED: buttonExtended,
	BUTTON_GROUP_EXTENDED: buttongroupExtended,
	YESNO: yesNo,
	YESNO_INNER: yesNoInner,
};

//VERY IMPORTANT. The object received must be modified we can't create a new object because the kubio logic runs before
//The kubio child logic so it means that the object already is loaded in different parts of the kubio aplication. So if
//we want to update those block names we must modify the original object
addFilter(
	'kubio.block-library.NamesOfBlocks',
	'kubio-child',
	( kubioNamesOfBlocks ) => {
		_.each( kubioNamesOfBlocks, ( blockValue, blockKey ) => {
			kubioNamesOfBlocks[ blockKey ] =
				replaceKubioBlockName( blockValue );
		} );
		_.each( NamesOfBlocks, ( blockValue, blockKey ) => {
			kubioNamesOfBlocks[ blockKey ] = blockValue;
		} );

		return kubioNamesOfBlocks;
	}
);

// make core/post-content not visible in inserter

const hidePostContentFromInserter = ( blockSettings ) => {
	if ( blockSettings.name === 'core/post-content' ) {
		blockSettings = {
			...blockSettings,
			supports: {
				...( blockSettings.supports || {} ),
				inserter: false,
			},
		};
	}

	return blockSettings;
};

addFilter(
	'blocks.registerBlockType',
	'optrix/hide-post-content-from-inserter',
	hidePostContentFromInserter
);

export default NamesOfBlocks;
