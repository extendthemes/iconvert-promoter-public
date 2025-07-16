import { useCallback, useMemo } from '@wordpress/element';
import { cloneBlock, parse } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

import { store as blockEditorStore } from '../../../store';
import { transformTemplateToBlock } from '@kubio/utils';
import _, { map } from 'lodash';

const useGutentagSectionState = ( onInsert, area = 'content' ) => {
	// modified default usePatternsState to load patterns depending on the area
	const { patternCategories, patterns } = useSelect(
		( select ) => {
			const { getSettings } = select( blockEditorStore );

			return {
				patterns: getSettings().__experimentalBlockPatterns.filter(
					( pattern ) =>
						pattern.isGutentagPattern &&
						pattern.name.indexOf( `kubio-${ area }` ) === 0
				),
				patternCategories:
					getSettings().__experimentalBlockPatternCategories,
			};
		},
		[ area ]
	);

	const onClickPattern = useCallback(
		( pattern, blocks ) => {
			const patternContent = pattern.isGutentagPattern
				? transformTemplateToBlock( blocks )
				: map( blocks, ( block ) => cloneBlock( block ) );

			onInsert( patternContent, pattern );
		},
		[ onInsert ]
	);
	const orderedPatterns = useMemo( () => {
		return patterns?.sort?.( ( p1, p2 ) => {
			// adding zero to booleans converts them to number
			return 0 + p1.isProPattern - p2.isProPattern;
		} );
	}, [ patterns ] );

	return [ orderedPatterns, patternCategories, onClickPattern ];
};

const usePatternsState = ( onInsert, rootClientId ) => {
	const { patternCategories, patterns } = useSelect(
		( select ) => {
			const { getSettings } = select( blockEditorStore );

			const inserterPatterns =
				getSettings().__experimentalBlockPatterns.filter(
					( pattern ) =>
						! pattern.isGutentagPattern &&
						( ! pattern.scope || pattern.scope.inserter )
				);

			return {
				patterns: inserterPatterns,
				patternCategories:
					getSettings().__experimentalBlockPatternCategories,
			};
		},
		[ rootClientId ]
	);

	const onClickPattern = useCallback( ( pattern, blocks ) => {
		onInsert(
			map( blocks, ( block ) => cloneBlock( block ) ),
			pattern.name
		);
	}, [] );

	return [ patterns, patternCategories, onClickPattern ];
};

export { useGutentagSectionState, usePatternsState };
