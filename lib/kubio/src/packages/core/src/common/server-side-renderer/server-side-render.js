import { useEffectAsync } from '@kubio/core-hooks';
import apiFetch from '@wordpress/api-fetch';
import { __experimentalSanitizeBlockAttributes } from '@wordpress/blocks';
import { Placeholder, Spinner } from '@wordpress/components';
import { useDebounce, usePrevious } from '@wordpress/compose';
import {
	RawHTML,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { noop } from 'lodash';
import fastDeepEqual from 'react-fast-compare';
import { useDeepCallback } from '../../hooks';

const EMPTY_OBJECT = {};

export function rendererPath( block, attributes = null, urlQueryArgs = {} ) {
	return addQueryArgs( `/wp/v2/block-renderer/${ block }`, {
		context: 'edit',
		...( null !== attributes ? { attributes } : {} ),
		...urlQueryArgs,
	} );
}

export function removeBlockSupportAttributes( attributes ) {
	const {
		backgroundColor,
		borderColor,
		fontFamily,
		fontSize,
		gradient,
		textColor,
		className,
		...restAttributes
	} = attributes;

	const { border, color, elements, spacing, typography, ...restStyles } =
		attributes?.style || EMPTY_OBJECT;

	return {
		...restAttributes,
		style: restStyles,
	};
}

function DefaultEmptyResponsePlaceholder( { className } ) {
	return (
		<Placeholder className={ className }>
			{ __( 'Block rendered as empty.', 'kubio' ) }
		</Placeholder>
	);
}

function DefaultErrorResponsePlaceholder( { response, className } ) {
	const errorMessage = sprintf(
		// translators: %s: error message describing the problem
		__( 'Error loading block: %s', 'kubio' ),
		response.errorMsg
	);
	return <Placeholder className={ className }>{ errorMessage }</Placeholder>;
}

function DefaultLoadingResponsePlaceholder( { children, showLoader } ) {
	return (
		<div style={ { position: 'relative' } }>
			{ showLoader && (
				<div
					style={ {
						position: 'absolute',
						top: '50%',
						left: '50%',
						marginTop: '-9px',
						marginLeft: '-9px',
					} }
				>
					<Spinner />
				</div>
			) }
			<div style={ { opacity: showLoader ? '0.3' : 1 } }>
				{ children }
			</div>
		</div>
	);
}

const baseFetchData = async ( {
	attributes,
	block,
	httpMethod,
	skipBlockSupportAttributes,
	urlQueryArgs,
} ) => {
	let sanitizedAttributes =
		attributes &&
		__experimentalSanitizeBlockAttributes( block, attributes );

	if ( skipBlockSupportAttributes ) {
		sanitizedAttributes =
			removeBlockSupportAttributes( sanitizedAttributes );
	}

	// If httpMethod is 'POST', send the attributes in the request body instead of the URL.
	// This allows sending a larger attributes object than in a GET request, where the attributes are in the URL.
	const isPostRequest = 'POST' === httpMethod;
	const urlAttributes = isPostRequest ? null : sanitizedAttributes ?? null;
	const path = rendererPath( block, urlAttributes, urlQueryArgs );
	const data = isPostRequest
		? { attributes: sanitizedAttributes ?? null }
		: null;

	// Store the latest fetch request so that when we process it, we can
	// check if it is the current request, to avoid race conditions on slow networks.
	let response = null;
	try {
		const fetchedData = await apiFetch( {
			path,
			data,
			method: isPostRequest ? 'POST' : 'GET',
		} );

		if ( fetchedData ) {
			response = fetchedData.rendered;
		}
	} catch ( error ) {
		response = {
			error: true,
			errorMsg: error.message,
		};
	}

	return response;
};

export default function ServerSideRender( props ) {
	const {
		attributes,
		block,
		className,
		httpMethod = 'POST',
		urlQueryArgs,
		skipBlockSupportAttributes = false,
		EmptyResponsePlaceholder = DefaultEmptyResponsePlaceholder,
		ErrorResponsePlaceholder = DefaultErrorResponsePlaceholder,
		LoadingResponsePlaceholder = DefaultLoadingResponsePlaceholder,
		onChange = noop, // triggered only when the HTML content is different
		onRefresh = noop, // triggered each time after shortcode reloads
	} = props;

	const [ showLoader, setShowLoader ] = useState( false );
	const [ response, setResponse ] = useState( null );
	const [ updateOn, setUpdateOn ] = useState( null );
	const prevProps = usePrevious( {
		attributes,
		block,
		httpMethod,
		skipBlockSupportAttributes,
		urlQueryArgs,
	} );
	const isMountedRef = useRef( false );
	const [ isLoading, setIsLoading ] = useState( false );
	const onChangeRef = useRef( onChange );
	const onRefreshRef = useRef( onRefresh );

	useEffect( () => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, [] );

	const fetchData = useDeepCallback(
		async ( isMounted ) => {
			if ( ! isMountedRef.current ) {
				return;
			}

			setIsLoading( true );
			const responseData = await baseFetchData( {
				attributes,
				block,
				httpMethod,
				skipBlockSupportAttributes,
				urlQueryArgs,
			} );

			setResponse( responseData );
			setUpdateOn( Date.now() );
			setIsLoading( false );
		},
		[
			attributes,
			block,
			httpMethod,
			onChange,
			skipBlockSupportAttributes,
			urlQueryArgs,
		]
	);

	const debouncedFetchData = useDebounce( fetchData, 500 );

	useEffectAsync(
		( isMounted ) => {
			// Don't debounce the first fetch. This ensures that the first render
			// shows data as soon as possible.
			if ( prevProps === undefined ) {
				fetchData( isMounted );
			} else if (
				! fastDeepEqual( prevProps, {
					attributes,
					block,
					httpMethod,
					skipBlockSupportAttributes,
					urlQueryArgs,
				} )
			) {
				debouncedFetchData( isMounted );
			}
		},
		[
			attributes,
			block,
			debouncedFetchData,
			fetchData,
			httpMethod,
			prevProps,
			skipBlockSupportAttributes,
			urlQueryArgs,
		]
	);

	/**
	 * Effect to handle showing the loading placeholder.
	 * Show it only if there is no previous response or
	 * the request takes more than one second.
	 */
	useEffect( () => {
		if ( ! isLoading ) {
			return;
		}
		const timeout = setTimeout( () => {
			setShowLoader( true );
		}, 1000 );
		return () => clearTimeout( timeout );
	}, [ isLoading ] );

	useEffect( () => {
		onChangeRef.current = onChange;
	}, [ onChange ] );

	useEffect( () => {
		onRefreshRef.current = onRefresh;
	}, [ onRefresh ] );

	useLayoutEffect( () => {
		onChangeRef.current( response );
	}, [ response ] );

	useLayoutEffect( () => {
		onRefreshRef.current( response );
	}, [ response, updateOn ] );

	const hasResponse = !! response;
	const hasEmptyResponse = response === '';
	const hasError = response?.error;

	if ( isLoading ) {
		return (
			<LoadingResponsePlaceholder { ...props } showLoader={ showLoader }>
				{ hasResponse && (
					<RawHTML className={ className }>{ response }</RawHTML>
				) }
			</LoadingResponsePlaceholder>
		);
	}

	if ( hasEmptyResponse || ! hasResponse ) {
		return <EmptyResponsePlaceholder { ...props } />;
	}

	if ( hasError ) {
		return <ErrorResponsePlaceholder response={ response } { ...props } />;
	}

	return <RawHTML className={ className }>{ response }</RawHTML>;
}
