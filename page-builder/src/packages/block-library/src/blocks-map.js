import { addFilter } from '@wordpress/hooks';
import { allowedKubioBlocks } from './allowed-kubio-blocks';
import * as promopopupoverflow from './promopopup/blocks/promopopup-overflow-container';
import * as promopopupclose from './promopopup/blocks/promopopup-close';
import * as promopopup from './promopopup';

import * as countdownseparator from './countdown/blocks/countdown-separator';
import * as countdownitem from './countdown/blocks/countdown-item';
import * as countdown from './countdown';
import * as subscribe from './subscribe';
import * as buttonExtended from './button';
import * as buttongroupExtended from './button-group';
import * as yesNo from './yes-no';
import * as yesNoInner from './yes-no/blocks/yes-no-inner';
import _ from 'lodash';
import {
	replaceKubioBlockName,
	replaceKubioArrayBlockPrefix,
} from '@cspromo/utils';

let blocksMap = {
	promopopupoverflow,
	promopopupclose,
	promopopup,
	countdownseparator,
	countdownitem,
	countdown,
	subscribe,
	buttonExtended,
	buttongroupExtended,
	yesNo,
	yesNoInner,
};

//VERY IMPORTANT. The object received must be modified we can't create a new object because the kubio logic runs before
//The kubio child logic so it means that the object already is loaded in different parts of the kubio aplication. So if
//we want to update those block names we must modify the original object
addFilter(
	'kubio.block-library.blocksMap',
	'kubio-child',
	( kubioBlocksMap ) => {
		const filteredKubioBlocks = {};
		_.each( kubioBlocksMap, ( block, key ) => {
			const blockName = block?.metadata?.name;
			if ( allowedKubioBlocks.includes( blockName ) ) {
				block.metadata.name = replaceKubioBlockName(
					block.metadata.name
				);

				if ( block.settings.name ) {
					block.settings.name = replaceKubioBlockName(
						block.settings.name
					);
				}

				//replace parents block names
				if ( Array.isArray( block.metadata.parent ) ) {
					block.metadata.parent = block.metadata.parent.map(
						( name ) => replaceKubioBlockName( name )
					);
				}

				//replace variations blocks names;
				if ( Array.isArray( block.metadata?.variations ) ) {
					block.metadata.variations.forEach( ( variation ) => {
						const innerBlocks = variation?.innerBlocks || [];
						innerBlocks.forEach( ( innerBlock ) => {
							replaceKubioArrayBlockPrefix( innerBlock );
						} );
					} );
				}
				filteredKubioBlocks[ key ] = block;
			}
		} );

		_.each( kubioBlocksMap, ( blockValue, blockKey ) => {
			if ( ! filteredKubioBlocks[ blockKey ] ) {
				delete kubioBlocksMap[ blockKey ];
			} else {
				kubioBlocksMap[ blockKey ] = filteredKubioBlocks[ blockKey ];
			}
		} );

		_.each( blocksMap, ( blockValue, blockKey ) => {
			kubioBlocksMap[ blockKey ] = blockValue;
		} );
		blocksMap = {
			...filteredKubioBlocks,
			...blocksMap,
		};
		return blocksMap;
	}
);
export { blocksMap };
