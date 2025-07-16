import { getNamesOfBlocks } from '@kubio/block-library';
import {
	useGetGlobalSessionProp,
	useSetGlobalSessionProp,
} from '@kubio/editor-data';
import { updateAllStyleManagers } from '@kubio/style-manager';
import { parse } from '@wordpress/blocks';
import {
	compose,
	createHigherOrderComponent,
	useDebounce,
	usePrevious,
} from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { addFilter, doAction } from '@wordpress/hooks';
import { debounce, find, isString, isUndefined } from 'lodash';
import { STORE_KEY } from '../../../build/store/constants';

const KubioEditorStateContext = createContext( {} );

const templatePartsNames = [
	getNamesOfBlocks().HEADER,
	getNamesOfBlocks().FOOTER,
	getNamesOfBlocks().SIDEBAR,
	'core/template-part',
	'core/post-content',
];

const useKubioEditorStateContext = () => useContext( KubioEditorStateContext );

const KubioEditorStateProvider = ( {
	children,
	blockContext,
	templateId,
	templateType,
	page,
} ) => {
	const templateParts = useRef( [] );
	const [ isReady, setReady ] = useState( false );

	const setEditorReady = useSetGlobalSessionProp( 'ready' );
	const isEditorReady = useGetGlobalSessionProp( 'ready', false );

	const isEditorReadyRef = useRef( isEditorReady );

	const {
		entitiesFinished,
		postLoaded,
		isEmptyPost,
		isPost,
		postEntity,
		isChangingPage,
	} = useSelect(
		( select ) => {
			const { getEditedEntityRecord, hasFinishedResolution } =
				select( 'core' );
			const { getCurrentPostType, getCurrentPostId } =
				select( STORE_KEY );

			const templatePartsFinished =
				isEditorReady || ! templateId || ! templateType
					? true
					: templateParts.current.reduce(
							( acc, { theme, slug, content } ) => {
								let finished = true;
								if ( ! content ) {
									if ( ! theme || ! slug ) {
										finished = true;
									} else {
										finished = ! isUndefined(
											getEditedEntityRecord(
												'postType',
												'wp_template_part',
												`${ theme }//${ slug }`
											)?.content
										);
									}
								}

								return acc && finished;
							},
							true
					  );

			let _pageLoaded = true;
			const currentPostType = getCurrentPostType();
			const currentPostId = getCurrentPostId();
			let _pageContent;
			let _isPost = false;
			let _postEntity = false;
			if ( currentPostType && currentPostId ) {
				if (
					! [ 'wp_template', 'wp_template_part' ].includes(
						currentPostType
					)
				) {
					_isPost = true;
					_postEntity = getEditedEntityRecord(
						'postType',
						currentPostType,
						currentPostId
					);
					_pageContent = _postEntity?.content;
					_pageLoaded =
						! isUndefined( _pageContent ) &&
						hasFinishedResolution( 'getEditedEntityRecord', [
							'postType',
							currentPostType,
							currentPostId,
						] );
				}
			}

			return {
				entitiesFinished: templatePartsFinished || _pageLoaded,
				postLoaded: _pageLoaded,
				postEntity: _postEntity,
				isEmptyPost:
					currentPostType &&
					currentPostId &&
					! isUndefined( _pageContent ) &&
					isString( _pageContent ) &&
					! (
						_pageContent.includes( '<!-- wp:' ) ||
						_pageContent.includes( '<!--wp:' )
					),
				isPost: _isPost,
				isChangingPage: false,
			};
		},
		[
			templateParts.current.length,
			isEditorReady,
			blockContext,
			templateId,
			templateId,
		]
	);

	const maybeMarkAsReady = useDebounce(
		useCallback( () => {
			setReady( true );
		}, [] ),
		200
	);

	const setEditorReadyAndLog = useCallback(
		( readyValue ) => {
			setEditorReady( readyValue );
			if ( readyValue ) {
				setEditorReady( readyValue );
				if ( top.kubioStartTime ) {
					const duration =
						Math.floor( performance.now() - top.kubioStartTime ) /
						1000;
					// eslint-disable-next-line no-console
					console.log( 'Kubio ready in: ' + duration + ' seconds' );
					top.kubioStartTime = null;
				}
				doAction( 'kubio.editorIsReady' );
			}
		},
		[ setEditorReady ]
	);

	const setEditorReadyWrapper = useCallback(
		( readyValue ) => {
			if ( isEditorReadyRef.current !== readyValue ) {
				if ( readyValue ) {
					updateAllStyleManagers( () => {
						setEditorReadyAndLog( readyValue );
					} );
				}
			}
		},
		[ setEditorReadyAndLog ]
	);

	const setEditorReadyDebounce = useDebounce( setEditorReadyWrapper, 500 );
	const forceMakeEditorVisible = useDebounce(
		useCallback( () => {
			setEditorReadyWrapper( true );
			setReady( true );
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [] ),
		2000
	);
	const forceMakeEditorVisibleLong = useDebounce(
		useCallback( () => {
			setEditorReadyWrapper( true );
			setReady( true );
		}, [] ),
		10000
	);

	// ensure an initial set ready
	useEffect( () => {
		debounce( setEditorReadyWrapper, 15000 );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	// Load the blocks from the content if not already in state
	// Guard against other instances that might have
	// set content to a function already or the blocks are already in state.
	const { editEntityRecord } = useDispatch( 'core' );
	useEffect( () => {
		const content = postEntity.content;
		if (
			isPost &&
			content &&
			typeof content !== 'function' &&
			! postEntity.blocks
		) {
			editEntityRecord(
				'postType',
				postEntity.type,
				postEntity.id,
				{
					blocks: parse( content ),
				},
				{ undoIgnore: true }
			);
		}
	}, [ isPost, postEntity, isEmptyPost, editEntityRecord ] );

	const previousWasReady = usePrevious( isEditorReady );
	useEffect( () => {
		isEditorReadyRef.current = isEditorReady;
		if ( previousWasReady && ! isEditorReady ) {
			setReady( false );
			templateParts.current = [];
		}
	}, [ isEditorReady, previousWasReady ] );

	useLayoutEffect( () => {
		if ( isChangingPage ) {
			return;
		}

		if ( ! isEditorReady ) {
			if ( entitiesFinished ) {
				forceMakeEditorVisibleLong.cancel();
				forceMakeEditorVisible.cancel();
				setEditorReadyDebounce.cancel();

				if ( isPost && postLoaded && isEmptyPost ) {
					forceMakeEditorVisible( true );
					return;
				}

				if ( isPost ) {
					setEditorReadyDebounce( isReady );
					return;
				}

				setEditorReadyDebounce( true );
			} else {
				forceMakeEditorVisible.cancel();
				forceMakeEditorVisibleLong( true );
			}
		}
	}, [
		postLoaded,
		isPost,
		isEmptyPost,
		entitiesFinished,
		isReady,
		isEditorReady,
		page,
		templateId,
		templateType,
		forceMakeEditorVisibleLong,
		forceMakeEditorVisible,
		setEditorReadyDebounce,
		isChangingPage,
	] );

	const markAsLoaded = useCallback(
		( blockName, { theme, slug } ) => {
			if ( templatePartsNames.includes( blockName ) ) {
				if ( theme && slug ) {
					if ( ! find( templateParts.current, { theme, slug } ) ) {
						templateParts.current.push( {
							theme,
							slug,
						} );
					}
				} else if ( blockName === 'core/post-content' ) {
					templateParts.current.push( {
						content: true,
					} );
				}
			}

			maybeMarkAsReady();
		},
		[ maybeMarkAsReady ]
	);

	const contextValue = useMemo(
		() => ( {
			isReady: isEditorReady,
			markAsLoaded,
		} ),
		[ isEditorReady, markAsLoaded ]
	);

	return (
		<KubioEditorStateContext.Provider value={ contextValue }>
			{ children }
		</KubioEditorStateContext.Provider>
	);
};

export { KubioEditorStateProvider, useKubioEditorStateContext };

const BlockListBlockEditorStateReady = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const { markAsLoaded, isReady } = useKubioEditorStateContext();

			useLayoutEffect( () => {
				if ( ! isReady ) {
					markAsLoaded( props.name, props.attributes );
				}
			}, [ isReady, markAsLoaded, props.attributes, props.name ] );

			return <BlockListBlock { ...props } />;
		};
	},
	'BlockListEditorStateReady'
);

addFilter(
	'editor.BlockListBlock',
	'kubio/style/BlockListEditorStateReady',
	compose( [ BlockListBlockEditorStateReady ] ),
	1
);
