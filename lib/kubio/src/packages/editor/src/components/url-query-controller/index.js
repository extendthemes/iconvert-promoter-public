import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';
import { addQueryArgs, getQueryArg, removeQueryArgs } from '@wordpress/url';
import _ from 'lodash';
import isEqual from 'react-fast-compare';
import { STORE_KEY } from '../../store/constants';

export default function URLQueryController() {
	const { setTemplate, setTemplatePart, showHomepage, setPage } =
		useDispatch( STORE_KEY );

	const { siteUrl, state } = window.kubioEditSiteSettings;
	// Set correct entity on load.
	useEffect( () => {
		const url = window.location.href;
		let postId =
			getQueryArg( url, 'postId' ) || state?.entity?.context?.postId;

		postId = ! isNaN( parseInt( postId ) ) ? parseInt( postId ) : postId;

		const pageURL = getQueryArg( url, 'pageURL' );

		if ( ! postId && ! pageURL ) {
			showHomepage();
			return;
		}

		const postType =
			getQueryArg( url, 'postType' ) || state?.entity?.context?.postType;

		if ( pageURL ) {
			setPage( {
				path: pageURL,
			} );
		} else if ( 'wp_template' === postType ) {
			setTemplate( postId );
		} else if ( 'wp_template_part' === postType ) {
			setTemplatePart( postId );
		} else if ( postType ) {
			const path =
				state?.entity?.context?.postId === postId
					? state?.entity?.path
					: `${ siteUrl }?p=${ postId }`;
			setPage( {
				context: {
					postType,
					postId,
				},
				path,
			} ); // Resolves correct template based on ID.
		} else {
			showHomepage();
		}
		//this is needed to apply full width template on page load for new pages. Because we
		//for the full width logic we use setPage as here and if we dont run it after this logic ends
		//we will have a race condition. Sometimes will work sometimes it won't
		doAction( 'kubio.afterEntitySet' );
	}, [] );

	// Update page URL when context changes.
	const pageContext = useCurrentPageContext();
	useEffect( () => {
		const baseURL = removeQueryArgs(
			window.location.href,
			'postType',
			'postId',
			'pageURL'
		);
		const { page, ...restContext } = pageContext || {};
		if ( _.isEmpty( page?.context ) ) {
			return;
		}
		const newUrl = pageContext
			? addQueryArgs( baseURL, restContext )
			: baseURL;

		// if (restContext?.postType?.indexOf('wp_template') !== -1) {
		// 	debugger;
		// 	const postId = page?.context?.postId;
		// 	const postType = page?.context?.postType;
		//
		// 	if (postId && postType) {
		// 		newUrl = addQueryArgs(baseURL, { postType, postId });
		// 	} else if (page?.path) {
		// 		newUrl = addQueryArgs(baseURL, { pageURL: page.path });
		// 	}
		// }

		window.history.replaceState( {}, '', newUrl );
	}, [ pageContext ] );

	return null;
}

function useCurrentPageContext() {
	const ref = useRef();

	const value = useSelect( ( select ) => {
		const { getEditedPostType, getEditedPostId, getPage } =
			select( STORE_KEY );

		const page = getPage();
		let _postId = getEditedPostId(),
			_postType = getEditedPostType();
		if ( page?.context?.postId && page?.context?.postType ) {
			_postId = page.context.postId;
			_postType = page.context.postType;
		}

		if ( _postId && _postType ) {
			return { postId: _postId, postType: _postType, page };
		}

		return { page };
	} );

	if ( ! isEqual( ref.current, value ) ) {
		ref.current = value;
	}

	return ref.current;
}
