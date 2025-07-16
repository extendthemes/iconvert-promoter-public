import { findBlockByName } from '@kubio/utils';
import {
	select as wordpressSelect,
	useDispatch,
	useSelect,
} from '@wordpress/data';
import _, { noop } from 'lodash';
import { coreTemplateOrder } from './config';
import { TEMPLATE_STORE_NAME } from './constants';

//the default select is not reactive, if you want the data to be reactive pass the select from a useSelect.
//We need to get some data when user makes an action so we don't refresh unecesary we get the data when needed.
//In some places the select provided is given by a useSelect making it reactive.
function getPostData( postType, select = wordpressSelect, query = {} ) {
	let initialPostData =
		select( 'core' ).getEntityRecords( 'postType', postType, {
			per_page: -1,
			...query,
		} ) || [];

	//remove links for optimization. If you let links the useMemo that has this as dependency recomputes
	initialPostData = initialPostData.map( ( item ) =>
		_.omit( item, [ '_links' ] )
	);
	return initialPostData;
}

function getPostListAndEditsByType( postType, select = wordpressSelect ) {
	const postsList = getPostData( postType, select );
	const editsById = {};
	postsList.forEach( ( postData ) => {
		const data = select( 'core' ).getEntityRecordEdits(
			'postType',
			postType,
			postData.id
		);
		const blocks = _.get( data, 'blocks' );
		const content = _.get( data, 'content' );

		if ( ! blocks && content ) {
			_.set( editsById, postData.id, content );
			return;
		}
		//the getEntityRecordEdits seem to only detect innerBlock changed but no attribute changes,
		//Because of this wee need to load a dataHelper object using the clientId of the block on the canvas
		if ( blocks ) {
			_.set( editsById, postData.id, blocks );
		}
	} );

	return [ postsList, editsById ];
}
const useTemplatePartLock = ( templatePartArea ) => {
	const isUnlocked = useSelect( ( select ) => {
		try {
			return select( TEMPLATE_STORE_NAME ).getIsEditableTemplatePartArea(
				templatePartArea
			);
		} catch ( e ) {
			return true;
		}
	} );
	const { lockTemplatePartArea = noop, unlockTemplatePartArea = noop } =
		useDispatch( TEMPLATE_STORE_NAME ) || {};

	const unlock = ( name = templatePartArea ) => {
		unlockTemplatePartArea( name );
	};
	const lock = ( name = templatePartArea ) => {
		lockTemplatePartArea( name );
	};
	const isLocked = ! isUnlocked;
	return { isUnlocked, isLocked, unlock, lock };
};

//header and footer do not need this and it adds lowers performance for them, we first search fast to see if the block
// is at the top level of the block list if it's not we search in all the blocks

const isCoreTemplate = ( templateSlug ) => {
	return coreTemplateOrder.includes( templateSlug );
};

export {
	getPostData,
	getPostListAndEditsByType,
	useTemplatePartLock,
	findBlockByName,
	isCoreTemplate,
};
