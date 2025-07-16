import _ from 'lodash';
import { __ } from '@wordpress/i18n';

const proBadgeClasses = {
	proItem: 'kubio-pro-item',
	badgeClass: 'kubio-pro-item__badge',
};
const PRO_ON_FREE_FLAG = 'isProOnFree';

/**
 *
 * @param {*} items
 * @param {*} direction - > false: free first, pro after ; true: pro first, free after
 * @return array
 */
function sortItemsByPro( items, direction = false ) {
	return _.sortBy(
		items,
		[
			function ( o ) {
				return o?.[ PRO_ON_FREE_FLAG ] === true;
			},
		],
		[ direction ]
	);
}

function addProTagToItem( item ) {
	_.set( item, PRO_ON_FREE_FLAG, true );
	return item;
}

function addProTagToItems( items, freeValues = [] ) {
	const itemsCopy = _.cloneDeep( items );
	_.each( itemsCopy, ( item, key ) => {
		if ( _.isFunction( freeValues ) ) {
			if ( ! freeValues( item, key ) ) {
				_.set( item, PRO_ON_FREE_FLAG, true );
			}
		}
		if ( _.isArray( freeValues ) ) {
			if ( ! freeValues.includes( _.get( item, 'value' ) ) ) {
				_.set( item, PRO_ON_FREE_FLAG, true );
			}
		}
	} );
	items = itemsCopy;
	return items;
}

const proItemOnFree = ( item ) => {
	return item === true || item?.[ PRO_ON_FREE_FLAG ];
};

const proItemOnFreeClass = ( item ) => {
	const classes = [];
	if ( proItemOnFree( item ) ) {
		classes.push( proBadgeClasses.proItem );
	}
	return classes;
};

const ProBadge = ( { item } ) => {
	return proItemOnFree( item ) ? (
		<div className={ proBadgeClasses.badgeClass }>
			{ __( 'PRO', 'kubio' ) }
		</div>
	) : null;
};

const isFreeVersion = () => {
	return KUBIO_ENV.IS_FREE;
};

export {
	PRO_ON_FREE_FLAG,
	proBadgeClasses,
	ProBadge,
	proItemOnFree,
	proItemOnFreeClass,
	sortItemsByPro,
	addProTagToItems,
	isFreeVersion,
	addProTagToItem,
};
