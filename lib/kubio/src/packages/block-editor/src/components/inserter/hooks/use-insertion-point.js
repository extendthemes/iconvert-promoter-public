import {
	isGutentagPrefixed,
	refreshBlockStyleRefs,
	slugify,
	cleanFontFamilyFromBlocks,
} from '@kubio/utils';
import { createBlock, isUnmodifiedDefaultBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import _, { castArray, find, get, isEqual, isNumber, map, omit } from 'lodash';
import { __unstableSerializeAndClean } from '@wordpress/blocks';

import { HERO_ACCENT_CATEGORY } from '@kubio/constants';
/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../../store';

const focusInsertedPattern = ( ownerDocument, insertedPatternId ) =>
	top.requestIdleCallback( () => {
		ownerDocument
			.querySelector( `[data-block="${ insertedPatternId }"]` )
			?.scrollIntoView( {
				behavior: 'smooth',
			} );
	} );

const kubioBlocksByArea = {
	header: 'kubio/header',
	footer: 'kubio/footer',
	sidebar: 'kubio/sidebar',
};

/**
 * @typedef WPInserterConfig
 * @property {string=}   rootClientId   If set, insertion will be into the
 *                                      block with this ID.
 * @property {number=}   insertionIndex If set, insertion will be into this
 *                                      explicit position.
 * @property {string=}   clientId       If set, insertion will be after the
 *                                      block with this ID.
 * @property {boolean=}  isAppender     Whether the inserter is an appender
 *                                      or not.
 * @property {Function=} onSelect       Called after insertion.
 */

/**
 * Returns the insertion point state given the inserter config.
 *
 * @param {WPInserterConfig} config Inserter Config.
 * @return {Array} Insertion Point State (rootClientID, onInsertBlocks and onToggle).
 */
function useInsertionPoint( {
	rootClientId = null,
	insertionIndex = null,
	clientId = null,
	isAppender = false,
	onSelect,
	shouldFocusBlock = true,
	shouldSelectBlock = true,
	ownerDocument,
	kubioInsertPosition,
} ) {
	//the new template is created for classic themes that don't have a template
	const [ showCreateTemplateModal, setShowCreateTemplateModal ] =
		useState( false );
	const [ newTemplateData, setNewTemplateData ] = useState( [] );

	const {
		destinationRootClientId,
		destinationIndex,
		getSelectedBlock,
		getBlockOrder,
		patternRootClientId,
		patternRootBlock,
		patternCategories,
		getClientIdsOfDescendants,
		getClientIdsWithDescendants,
		getBlock,
		getBlockParentId,
		canInsertBlockType,
		getBlockIndex,
		isFSEFrontPageWithoutFrontPageTemplate,
		shouldReplace,
		closeOnInsert,
	} = useSelect(
		( select ) => {
			const {
				getSelectedBlock: _getSelectedBlock,
				getBlockIndex: _getBlockIndex,
				getBlockOrder: _getBlockOrder,
				getClientIdsOfDescendants: _getClientIdsOfDescendants,
				getBlockRootClientId,
				getClientIdsWithDescendants: _getClientIdsWithDescendants,
				getBlock: _getBlock,
				getSelectedBlockClientId,
				canInsertBlockType: _canInsertBlockType,
			} = select( blockEditorStore );

			let _destinationRootClientId, _destinationIndex;
			const selectedBlockClientId = getSelectedBlockClientId();

			if ( rootClientId || insertionIndex || clientId || isAppender ) {
				// If any of these arguments are set, we're in "manual mode"
				// meaning the insertion point is set by the caller.

				_destinationRootClientId = rootClientId;

				if ( isNumber( insertionIndex ) ) {
					// Insert into a specific index.
					_destinationIndex = insertionIndex;
				} else if ( clientId ) {
					// Insert after a specific client ID.
					_destinationIndex = _getBlockIndex(
						clientId,
						_destinationRootClientId
					);
				} else if ( ! isAppender && selectedBlockClientId ) {
					_destinationRootClientId = getBlockRootClientId(
						selectedBlockClientId
					);
					_destinationIndex =
						_getBlockIndex(
							selectedBlockClientId,
							_destinationRootClientId
						) + 1;
				} else {
					// Insert at the end of the list.
					_destinationIndex = _getBlockOrder(
						_destinationRootClientId
					).length;
				}
			}

			const inserterForcedClientId =
				select( 'kubio/edit-site' ).getOpenedInsertedClientId();

			if ( inserterForcedClientId ) {
				_destinationRootClientId = inserterForcedClientId;
			}

			// eslint-disable-next-line no-shadow

			const { __experimentalBlockPatternCategories } =
				select( 'core/block-editor' ).getSettings();

			let _patternRootClientId = select(
				// use literal store name to avoid circular dependencies
				'kubio/edit-site'
			).getOpenedInsertedClientId();

			if ( ! _patternRootClientId ) {
				_patternRootClientId = find(
					_getClientIdsWithDescendants().map( _getBlock ),
					{ name: 'core/post-content' }
				)?.clientId;
			}

			const _patternRootBlock = _getBlock( _patternRootClientId );
			const { getEditedEntityRecord } = select( 'core' );
			const {
				getTemplateId = _.noop,
				getPage = _.noop,
				getSettings = _.noop,
			} = select( 'kubio/edit-site' ) || {};

			const siteData = getEditedEntityRecord( 'root', 'site' );
			const frontPageId = siteData?.page_on_front;
			const currentPageId = getPage()?.context?.postId;
			const isFrontPage = frontPageId === currentPageId;

			const templateId = getTemplateId();
			const templateSlugParts = templateId?.split( '//' );
			const templateSlug = _.get( templateSlugParts, '[1]' );
			const isFrontPageTemplate = templateSlug === 'front-page';

			const supportsTemplateMode = getSettings()?.supportsTemplateMode;

			//is FSE theme is the front page from general settings of wordpress but the front page template does not exists
			const isFSEFrontWithoutFrontTemplate =
				supportsTemplateMode && isFrontPage && ! isFrontPageTemplate;
			return {
				getSelectedBlock: _getSelectedBlock,
				destinationRootClientId: _destinationRootClientId,
				destinationIndex: _destinationIndex,
				getBlockOrder: _getBlockOrder,
				patternRootClientId: _patternRootClientId,
				patternRootBlock: _patternRootBlock,
				patternCategories: __experimentalBlockPatternCategories,
				getClientIdsOfDescendants: _getClientIdsOfDescendants,
				getClientIdsWithDescendants: _getClientIdsWithDescendants,
				getBlock: _getBlock,
				getBlockParentId: getBlockRootClientId,
				canInsertBlockType: _canInsertBlockType,
				getBlockIndex: _getBlockIndex,
				isFSEFrontPageWithoutFrontPageTemplate:
					isFSEFrontWithoutFrontTemplate,
				shouldReplace:
					select(
						'kubio/edit-site'
					).getOpenedInsertedShouldReplace(),
				closeOnInsert:
					select(
						'kubio/edit-site'
					).getOpenedInsertedShouldCloseOnSelect(),
			};
		},
		[ rootClientId, insertionIndex, clientId, isAppender ]
	);
	const {
		replaceBlocks,
		insertBlocks,
		selectBlock,
		showInsertionPoint,
		replaceBlock,
		hideInsertionPoint,
		updateBlockAttributes,
		replaceInnerBlocks,
		__unstableMarkNextChangeAsNotPersistent,
	} = useDispatch( blockEditorStore );

	const { editEntityRecord } = useDispatch( 'core' );

	const { setOpenInserter } = useDispatch( 'kubio/edit-site' );
	function onCloseTemplateModal() {
		setShowCreateTemplateModal( false );
	}
	function onCreateTemplate() {
		onCloseTemplateModal();
		setOpenInserter( false );
	}

	const currentClientId = useRef( patternRootClientId );
	const { createWarningNotice } = useDispatch( noticesStore );

	const getNextSectionNameAndId = useCallback(
		( nameRoot, skipNodesInCurrentContainer = false ) => {
			const skipIds = skipNodesInCurrentContainer
				? getClientIdsOfDescendants( [ patternRootClientId ] )
				: [];

			const currentIds = getClientIdsWithDescendants()
				.filter(
					( descendantClientId ) =>
						skipIds.indexOf( descendantClientId ) === -1
				)
				.map(
					( descendantClientId ) =>
						getBlock( descendantClientId )?.attributes?.anchor
				)
				.filter( Boolean );

			const currentIdRoot = slugify( nameRoot );
			let currentSuffixIndex = 0;
			let currentSuffix = '';

			while (
				currentIds.indexOf( `${ currentIdRoot }${ currentSuffix }` ) !==
				-1
			) {
				currentSuffixIndex++;
				currentSuffix = `-${ currentSuffixIndex }`;
			}

			return {
				name: currentSuffixIndex
					? `${ nameRoot } ${ currentSuffixIndex }`
					: nameRoot,
				anchor: `${ currentIdRoot }${ currentSuffix }`,
			};
		},
		[
			getClientIdsOfDescendants,
			getClientIdsWithDescendants,
			patternRootClientId,
			getBlock,
		]
	);

	const insertSelectedBlocks = useCallback(
		( blocks, meta, shouldForceFocusBlock = false ) => {
			const selectedBlock = getSelectedBlock();
			if (
				! isAppender &&
				selectedBlock &&
				isUnmodifiedDefaultBlock( selectedBlock )
			) {
				replaceBlocks(
					selectedBlock.clientId,
					blocks,
					null,
					shouldFocusBlock || shouldForceFocusBlock ? 0 : null,
					meta
				);
			} else {
				let parentId = destinationRootClientId;
				let inserterIndex = destinationIndex;

				const blocksTypes = castArray( blocks ).map(
					( block ) => block.name
				);

				if ( ! parentId ) {
					const selectedBlockId = getSelectedBlock()?.clientId;
					const canInsert = blocksTypes.reduce(
						( _canInsert, blockName ) =>
							_canInsert &&
							canInsertBlockType( blockName, selectedBlockId ),
						true
					);

					if ( canInsert ) {
						parentId = selectedBlockId;
					} else {
						parentId = getBlockParentId( selectedBlockId );
						inserterIndex = getBlockIndex(
							selectedBlockId,
							parentId
						);
					}
				}

				const canInsert = blocksTypes.reduce(
					( _canInsert, blockName ) =>
						_canInsert && canInsertBlockType( blockName, parentId ),
					true
				);

				if ( ! canInsert ) {
					return createWarningNotice(
						__(
							'Please drag the block to the desired location',
							'kubio'
						),
						{
							type: 'snackbar',
						}
					);
				}

				if ( kubioInsertPosition === 'begin' ) {
					inserterIndex = 0;
				}

				if ( kubioInsertPosition === 'end' ) {
					inserterIndex = getBlockOrder( parentId ).length;
				}

				insertBlocks(
					cleanFontFamilyFromBlocks( blocks ),
					inserterIndex,
					parentId,
					shouldSelectBlock,
					shouldFocusBlock || shouldForceFocusBlock ? 0 : null,
					meta
				);
			}
		},
		[
			isAppender,
			getSelectedBlock,
			replaceBlocks,
			insertBlocks,
			destinationRootClientId,
			destinationIndex,
			shouldSelectBlock,
			shouldFocusBlock,
			kubioInsertPosition,
			getBlockOrder,
			canInsertBlockType,
			getBlockIndex,
		]
	);

	const insertPattern = useCallback(
		( blocks, meta, shouldForceFocusBlock ) => {
			const selectedBlock = getSelectedBlock();
			if (
				! isAppender &&
				selectedBlock &&
				isUnmodifiedDefaultBlock( selectedBlock )
			) {
				replaceBlocks(
					selectedBlock.clientId,
					blocks,
					null,
					shouldFocusBlock || shouldForceFocusBlock ? 0 : null,
					meta
				);
			} else {
				if ( ! destinationRootClientId ) {
					return createWarningNotice(
						__(
							'Please select a container block ( like a column ) before inserting patterns',
							'kubio'
						),
						{
							type: 'snackbar',
						}
					);
				}

				insertBlocks(
					blocks,
					destinationIndex,
					destinationRootClientId,
					true,
					shouldFocusBlock || shouldForceFocusBlock ? 0 : null,
					meta
				);
			}

			if ( onSelect ) {
				onSelect();
			}
		},
		[
			isAppender,
			getSelectedBlock,
			replaceBlocks,
			insertBlocks,
			destinationRootClientId,
			destinationIndex,
			shouldFocusBlock,
		]
	);
	const insertGutentagSectionOrPattern = useCallback(
		async ( blocks, meta, shouldForceFocusBlock = false ) => {
			const { area = 'content', pattern = {} } = meta;

			if ( ! pattern?.isGutentagPattern ) {
				insertPattern( blocks, meta, shouldForceFocusBlock );
				return;
			}

			if ( pattern.isProOnFree ) {
				return;
			}

			blocks = castArray( blocks );
			if ( [ 'header', 'footer' ].indexOf( area ) !== -1 ) {
				const { attributes, innerBlocks } = castArray( blocks )[ 0 ];

				const newInnerBlocks = innerBlocks.map( ( block ) => {
					let sectionBaseName = __( 'Header Section', 'kubio' );
					if ( area === 'footer' ) {
						sectionBaseName = __( 'Footer Section', 'kubio' );
					}
					switch ( block.name ) {
						case 'kubio/navigation':
							sectionBaseName = __( 'Navigation', 'kubio' );
							break;
						case 'kubio/hero':
							sectionBaseName = __( 'Hero', 'kubio' );
							break;
					}
					switch ( block.name ) {
						case 'kubio/hero':
							//for hero do not clean yet so alexandra can resave the headers with the general settings updated accordion the the heading
							break;
						default:
							block = cleanFontFamilyFromBlocks( block );
							break;
					}
					const { anchor, name } = getNextSectionNameAndId(
						sectionBaseName,
						true
					);

					return {
						...block,
						attributes: {
							...block.attributes,
							anchor,
							attrs: {
								...block.attributes.attrs,
								name,
							},
						},
					};
				} );

				const classicThemePatternRootIdAreas = [ 'header', 'footer' ];
				if (
					classicThemePatternRootIdAreas.includes(
						patternRootClientId
					) ||
					isFSEFrontPageWithoutFrontPageTemplate
				) {
					setShowCreateTemplateModal( true );
					setNewTemplateData( newInnerBlocks );
					return;
				}

				// check if the new attributes has something else instead of kubio hashes
				const changeValues = omit( attributes, [
					'kubio.hash',
					'kubio.id',
					'kubio.styleRef',
					'tagName',
				] );

				if ( ! isEqual( changeValues, { kubio: {} } ) ) {
					__unstableMarkNextChangeAsNotPersistent();
					updateBlockAttributes( patternRootClientId, attributes );
				}

				if (
					kubioBlocksByArea[ area ] &&
					patternRootBlock &&
					patternRootBlock?.name !== kubioBlocksByArea[ area ]
				) {
					const slugPath = [ 'attributes', 'slug' ];
					const currentSlug = get( patternRootBlock, slugPath );
					const nextAttributes = {
						slug: currentSlug,
					};
					const newBlock = createBlock(
						kubioBlocksByArea[ area ],
						nextAttributes
					);

					await replaceInnerBlocks(
						patternRootClientId,
						newInnerBlocks
					);
					await replaceBlock( patternRootClientId, newBlock );

					//this fixes 2 issues: 1) the cog for the header/footer section list still has the old clientId. 2) If you add the header
					//again it will look for the old clientId. So with this workaround we select the first block refreshing the
					//header clientId in the section list and closes the add panel making you open it again with the new header block.
					//This is the preferred way to not handle all the complex cases
					selectBlock( newBlock?.clientId );

					focusInsertedPattern( ownerDocument, newBlock?.clientId );
				} else {
					// replaceInnerBlocks(patternRootClientId, newInnerBlocks);
					const edits = {
						blocks: newInnerBlocks,
						content: ( { blocks: blocksForSerialization = [] } ) =>
							__unstableSerializeAndClean(
								blocksForSerialization
							),
					};
					const { theme, slug } = patternRootBlock.attributes;
					editEntityRecord(
						'postType',
						'wp_template_part',
						`${ theme }//${ slug }`,
						edits
					);

					// setLatestPatternInsertedId(patternRootClientId);
					focusInsertedPattern( ownerDocument, patternRootClientId );
				}
			} else {
				const { categories } = pattern;
				const categoryName =
					categories?.[ 0 ] ?? '__undefined__category__';

				const categoryLabel =
					find( patternCategories, {
						name: categoryName,
					} )?.label ?? 'Custom Section';

				const { anchor, name } =
					getNextSectionNameAndId( categoryLabel );

				const newBlocks = map( blocks, ( block ) => {
					if ( block.name === 'kubio/section' ) {
						block = {
							...block,
							attributes: {
								...block.attributes,
								anchor,
								attrs: {
									...block.attributes.attrs,
									name,
								},
							},
						};
					}

					return block;
				} );

				let patternInsertionIndex =
					getBlockOrder( patternRootClientId ).length;

				if (
					pattern.categories.indexOf( HERO_ACCENT_CATEGORY ) !== -1
				) {
					patternInsertionIndex = 0;
				}

				if ( shouldReplace ) {
					replaceBlocks( currentClientId.current, newBlocks );
					currentClientId.current = newBlocks[ 0 ].clientId;
				} else {
					insertBlocks(
						cleanFontFamilyFromBlocks( newBlocks ),
						patternInsertionIndex,
						patternRootClientId,
						false
					);
				}

				if ( closeOnInsert ) {
					setOpenInserter( false );
				}

				// setLatestPatternInsertedId(blocks[0]?.clientId);
				focusInsertedPattern( ownerDocument, blocks[ 0 ]?.clientId );
			}
		},
		[
			patternRootClientId,
			patternRootBlock,
			getNextSectionNameAndId,
			updateBlockAttributes,
			replaceInnerBlocks,
			insertBlocks,
			getBlockOrder,
			patternCategories,
			shouldReplace,
		]
	);

	const onInsertBlocks = useCallback(
		( blocks, meta, shouldForceFocusBlock = false ) => {
			if ( isGutentagPrefixed( castArray( blocks )[ 0 ]?.name ) ) {
				blocks = refreshBlockStyleRefs( blocks );
			}

			if ( meta?.patternName ) {
				insertGutentagSectionOrPattern(
					blocks,
					meta,
					shouldForceFocusBlock
				);
			} else {
				if ( ! destinationRootClientId ) {
					if ( ! getSelectedBlock() ) {
						createWarningNotice(
							__(
								'Please drag the block to the desired location',
								'kubio'
							),
							{
								type: 'snackbar',
							}
						);
						return;
					}
				}

				insertSelectedBlocks( blocks, meta, shouldForceFocusBlock );
				if ( onSelect ) {
					onSelect();
				}
			}
		},
		[ insertGutentagSectionOrPattern, insertSelectedBlocks ]
	);

	const onToggleInsertionPoint = useCallback(
		( show ) => {
			if ( show ) {
				showInsertionPoint( destinationRootClientId, destinationIndex );
			} else {
				hideInsertionPoint();
			}
		},
		[
			showInsertionPoint,
			hideInsertionPoint,
			destinationRootClientId,
			destinationIndex,
			newTemplateData,
		]
	);

	const createTemplateParams = {
		showCreateTemplateModal,
		onCloseTemplateModal,
		onCreateTemplate,
		newTemplateData,
		patternRootClientId,
		isFSEFrontPageButDoesNotHaveFrontPageTemplate:
			isFSEFrontPageWithoutFrontPageTemplate,
	};

	return [
		destinationRootClientId,
		onInsertBlocks,
		onToggleInsertionPoint,
		createTemplateParams,
	];
}

export default useInsertionPoint;
