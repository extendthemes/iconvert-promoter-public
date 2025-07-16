import { useKubioBlockContext } from '@kubio/core';
import { BlockInspectorTopControls } from '@kubio/inspectors';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { name as blockName } from './block.json';
import { useToolbarState } from './toolbar';

const StateSwitcher = ( { targetClientId } ) => {
	const { dataHelper } = useKubioBlockContext();

	const { sidebarDropdownComponent } = useToolbarState(
		dataHelper.withClientId( targetClientId )
	);

	return (
		!! sidebarDropdownComponent && (
			<BlockInspectorTopControls>
				<div className="kubio-editing-header yes-no-inspector-state-selector">
					{ sidebarDropdownComponent }
				</div>
			</BlockInspectorTopControls>
		)
	);
};

addFilter(
	'editor.BlockEdit',
	'cspromo/yes-no/inspector-controls-top',
	createHigherOrderComponent( ( OriginalComponent ) => {
		return ( props ) => {
			const parentClientId = useSelect(
				( select ) => {
					if ( props.name === blockName ) {
						return props.clientId;
					}

					const targetBlock = select( 'core/block-editor' )
						.getBlockParents( props.clientId )
						.map( ( c ) =>
							select( 'core/block-editor' ).getBlock( c )
						)
						.find( ( b ) => b.name === blockName );

					return targetBlock ? targetBlock.clientId : null;
				},
				[ props.clientId, props.name ]
			);

			if ( ! parentClientId ) {
				return <OriginalComponent { ...props } />;
			}

			if ( ! props.isSelected ) {
				return <OriginalComponent { ...props } />;
			}

			return (
				<>
					<StateSwitcher targetClientId={ parentClientId } />
					<OriginalComponent { ...props } />
				</>
			);
		};
	}, 'withInspectorControlsYesNo' )
);
