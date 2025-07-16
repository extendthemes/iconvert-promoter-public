import { addAction, removeAction } from '@wordpress/hooks';
import { generate as generateShortId } from 'shortid';

const onBlockVariationRegistered = ( blockName, callback ) => {
	const key = `${ generateShortId() }.${ generateShortId() }`.replace(
		/\W/g,
		''
	);
	addAction(
		'kubio.variation-added',
		`kubio.variation-added.${ key }`,
		( currentBlock, variation, addRefreshedBLockVariation ) => {
			if ( currentBlock === blockName ) {
				// remove action after variation  added ( reduces unnecessary calls )
				if ( callback( variation, addRefreshedBLockVariation ) ) {
					removeAction(
						'kubio.variation-added',
						`kubio.variation-added.${ key }`
					);
				}
			}
		}
	);
};

export { onBlockVariationRegistered };
