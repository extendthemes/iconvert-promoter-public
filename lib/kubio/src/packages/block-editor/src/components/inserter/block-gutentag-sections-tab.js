import _, { fromPairs, isEmpty } from 'lodash';

import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';

import BlockPatternList from '../block-patterns-list';
import { useGutentagSectionState } from './hooks/use-patterns-state';

import { HERO_ACCENT_CATEGORY, INNER_HEADERS_CATEGORY } from '@kubio/constants';
import { KubioLoader } from '@kubio/icons';
import { Log } from '@kubio/log';
import {
	ALL_TAG,
	KubioSectionsTags,
	isPatternAvailableInCurrentTheme,
} from '@kubio/utils';
import { Panel, PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Icon, blockDefault } from '@wordpress/icons';
import InserterNoResults from './no-results';
import { searchItems } from './search-items';

function BlockGutentagSectionsCategory( {
	area = 'content',
	onInsert,
	filterValue = '',
} ) {
	const [ availablePatterns, allCategories, onClick ] =
		useGutentagSectionState( onInsert, area );

	const { isFrontPage } = useSelect( ( select ) => {
		let isFront;
		try {
			const { getIsFrontPage = _.noop } =
				select( 'kubio/edit-site' ) || {};
			isFront = getIsFrontPage();
		} catch ( e ) {
			Log.error(
				'BlockGutentagSectionsCategory - determine isFrontPage',
				e
			);
		}

		return {
			isFrontPage: isFront,
		};
	}, [] );

	const excludedSectionCategories = useSelect( ( select ) => {
		const { getExcludedSectionCategories } = select( 'kubio/edit-site' );

		return getExcludedSectionCategories();
	} );

	const [ activeTag, setActiveTag ] = useState( ALL_TAG );

	const { filteredPatterns, availableTagSlugs } = useMemo( () => {
		// using set to ensure uniqueness
		const availableTags = new Set();

		// eslint-disable-next-line no-shadow
		const filteredPatterns = availablePatterns.filter( ( pattern ) => {
			const patternCategory = _.get( pattern, 'categories.0', '' );
			const isInnerPagePattern =
				patternCategory === INNER_HEADERS_CATEGORY;

			if ( excludedSectionCategories.includes( patternCategory ) ) {
				return false;
			}

			if ( isFrontPage && isInnerPagePattern ) {
				return false;
			}

			//filter by tag
			const patternTags = pattern?.publicTags || [];

			patternTags.forEach( ( tag ) => {
				availableTags.add( tag );
			} );

			if (
				activeTag !== ALL_TAG &&
				! patternTags?.includes?.( activeTag )
			) {
				return false;
			}

			if ( ! isPatternAvailableInCurrentTheme( pattern ) ) {
				return false;
			}

			return true;
		} );

		return {
			filteredPatterns,
			// spread to set to return an array
			availableTagSlugs: [ ...availableTags ],
		};
	}, [ availablePatterns, isFrontPage, activeTag ] );

	const NoResultsComponent = window.kubioPatternsRegistered
		? InserterNoResults
		: InserterLoadingResults;

	const allPatterns = useMemo(
		() => searchItems( filteredPatterns, filterValue ),
		[ filterValue, filteredPatterns ]
	);

	// Remove any empty categories
	const populatedCategories = useMemo( () => {
		let initiallyOpened = 1; // number of categories to be initially opened
		return (
			allCategories
				// .filter(
				// 	(category) => !excludedSectionCategories.includes(category.name)
				// )
				.filter( ( category ) =>
					allPatterns.some( ( pattern ) =>
						pattern.categories?.includes( category.name )
					)
				)
				.map( ( category ) => {
					let open = false;

					if ( category.name !== HERO_ACCENT_CATEGORY ) {
						if ( initiallyOpened ) {
							initiallyOpened--;
							open = true;
						}
					}

					return {
						...category,
						open,
					};
				} )
		);
	}, [ allPatterns, allCategories ] );

	const patternsByCategories = useMemo( () => {
		const result = {};

		populatedCategories.forEach( ( { name } ) => {
			const categoryPatterns = allPatterns.filter( ( pattern ) =>
				pattern.categories?.includes( name )
			);

			result[ name ] = categoryPatterns.sort( ( p1, p2 ) => {
				// adding zero to booleans converts them to number
				return 0 + p1.isProOnFree - p2.isProOnFree;
			} );
		} );

		return result;
	}, [ allPatterns, populatedCategories ] );

	const getPatternIndex = useCallback(
		( pattern ) => {
			if ( ! pattern.categories || ! pattern.categories.length ) {
				return Infinity;
			}
			const indexedCategories = fromPairs(
				populatedCategories.map( ( { name }, index ) => [
					name,
					index,
				] )
			);
			return Math.min(
				...pattern.categories.map( ( cat ) =>
					indexedCategories[ cat ] !== undefined
						? indexedCategories[ cat ]
						: Infinity
				)
			);
		},
		[ populatedCategories ]
	);

	useEffect( () => {
		if (
			allPatterns.some(
				( pattern ) => getPatternIndex( pattern ) === Infinity
			) &&
			! populatedCategories.find(
				( category ) => category.name === 'uncategorized'
			)
		) {
			populatedCategories.push( {
				name: 'uncategorized',
				label: _x( 'Uncategorized', 'kubio', 'kubio' ),
			} );
		}
	}, [ populatedCategories, allPatterns, getPatternIndex ] );

	const PanelTitleContent = ( { title, slug } ) => {
		return (
			<>
				{ title }
				<span className="kubio-pattern__category-count">
					({ patternsByCategories[ slug ].length })
				</span>
			</>
		);
	};

	return (
		<>
			{ !! availableTagSlugs.length && (
				<div className="kubio-inserter-section-tags__container">
					<KubioSectionsTags
						activeTag={ activeTag }
						setActiveTag={ setActiveTag }
						availableTagSlugs={ availableTagSlugs }
					/>
				</div>
			) }

			{ !! populatedCategories.length && (
				<Panel className={ 'kubio-patterns-panel' }>
					{ populatedCategories.map( ( category ) => {
						let title = category.label;
						if ( category.name === 'kubio-content/blank' ) {
							title = __( 'Blank section', 'kubio' );
						}

						return (
							<PanelBody
								key={ `patterns-category-${ category.name }` }
								title={
									<PanelTitleContent
										title={ title }
										slug={ category.name }
									/>
								}
								initialOpen={
									category.open || ! isEmpty( filterValue )
								}
								opened={
									populatedCategories.length === 1
										? true
										: undefined
								}
							>
								<BlockPatternList
									blockPatterns={
										patternsByCategories[ category.name ]
									}
									onClickPattern={ onClick }
									orientation="vertical"
								/>
							</PanelBody>
						);
					} ) }
				</Panel>
			) }
			{ ! populatedCategories.length && <NoResultsComponent /> }
		</>
	);
}

function InserterLoadingResults() {
	return (
		<div className="block-editor-inserter__no-results">
			<Icon
				className="block-editor-inserter__no-results-icon"
				icon={ blockDefault }
			/>
			<div className="block-editor-inserter__no-results__message">
				<Icon icon={ KubioLoader } />
				<p>{ __( 'Loading sections…', 'kubio' ) }</p>
			</div>
		</div>
	);
}

function BlockGutentagSectionsTabs( {
	rootClientId,
	onInsert,
	filterValue,
	area = 'content',
} ) {
	return (
		<BlockGutentagSectionsCategory
			rootClientId={ rootClientId }
			onInsert={ onInsert }
			filterValue={ filterValue }
			area={ area }
		/>
	);
}

export default BlockGutentagSectionsTabs;
