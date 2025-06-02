/**
 * WordPress dependencies
 */
import { useMemo, useRef, useLayoutEffect } from '@wordpress/element';
import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { find } from 'lodash';

const blocksTab = {
	name: 'blocks',
	/* translators: Blocks tab title in the block inserter. */
	title: __( 'Blocks', 'kubio' ),
};

const gutentagSectionsTab = {
	name: 'kubio-sections',
	/* translators: Patterns tab title in the block inserter. */
	title: __( 'Sections', 'kubio' ),
};

const patternsTab = {
	name: 'patterns',
	/* translators: Patterns tab title in the block inserter. */
	title: __( 'Patterns', 'kubio' ),
};
const reusableBlocksTab = {
	name: 'reusable',
	/* translators: Locally created Patterns tab title in the block inserter. */
	title: __( 'Synced patterns', 'kubio' ),
};

const KUBIO_DISABLED_PATTERNS_TAB = true;

function InserterTabs( {
	children,
	showPatterns: showPatterns_ = false,
	showReusableBlocks = false,
	onSelect,
	initialTabName,
	enableGutentagSectionsTab = true,
} ) {
	const showPatterns = ! KUBIO_DISABLED_PATTERNS_TAB && showPatterns_;

	const tabs = useMemo( () => {
		const tempTabs = [ blocksTab ];

		if ( enableGutentagSectionsTab ) {
			tempTabs.push( gutentagSectionsTab );
		}

		if ( showPatterns ) {
			tempTabs.push( patternsTab );
		}

		if ( showReusableBlocks ) {
			tempTabs.push( reusableBlocksTab );
		}

		return tempTabs;
	}, [
		blocksTab,
		showPatterns,
		patternsTab,
		showReusableBlocks,
		reusableBlocksTab,
		gutentagSectionsTab,
	] );

	const ref = useRef();

	useLayoutEffect( () => {
		if ( ref.current && initialTabName && tabs.length ) {
			const to = setTimeout( () => {
				const tab = find( tabs, { name: initialTabName } );
				const index = tabs.indexOf( tab );

				const buttons = ref.current.querySelectorAll(
					'.components-tab-panel__tabs > *'
				);

				if ( buttons && buttons.length ) {
					buttons[ index ].click();
				}
			}, 50 );

			return () => clearTimeout( to );
		}
	}, [ ref.current, initialTabName, tabs ] );

	return (
		<div ref={ ref }>
			<TabPanel
				className="block-editor-inserter__tabs"
				tabs={ tabs }
				onSelect={ onSelect }
				initialTabName={ initialTabName }
			>
				{ children }
			</TabPanel>
		</div>
	);
}

export default InserterTabs;
