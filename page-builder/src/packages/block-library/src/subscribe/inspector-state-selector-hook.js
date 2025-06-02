import { useKubioBlockContext } from '@kubio/core';
import { BlockInspectorTopControls } from '@kubio/inspectors';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { name as blockName } from './block.json';
import { useToolbarState } from './toolbar';

const StateSwitcher = ( { dataHelper, subscribeClientId } ) => {
	const { sidebarDropdownComponent } = useToolbarState(
		dataHelper.withClientId( subscribeClientId )
	);

	return (
		!! sidebarDropdownComponent && (
			<BlockInspectorTopControls>
				<div className="kubio-editing-header subscribe-inspector-state-selector">
					{ sidebarDropdownComponent }
				</div>
			</BlockInspectorTopControls>
		)
	);
};

const ComponentWrapper = ( { BlockEdit, props } ) => {
	const { dataHelper } = useKubioBlockContext();

	const parentClientId = useSelect(
		( select ) => {
			if ( props.name === blockName ) {
				return props.clientId;
			}

			const subscribeBlock = select( 'core/block-editor' )
				.getBlockParents( props.clientId )
				.map( ( c ) => select( 'core/block-editor' ).getBlock( c ) )
				.find( ( b ) => b.name === blockName );

			return subscribeBlock ? subscribeBlock.clientId : null;
		},
		[ props.clientId, props.name ]
	);

	if ( ! parentClientId ) {
		return <BlockEdit { ...props } />;
	}

	return (
		<>
			<StateSwitcher
				dataHelper={ dataHelper }
				subscribeClientId={ parentClientId }
			/>
			<BlockEdit { ...props } />
		</>
	);
};

addFilter(
	'editor.BlockEdit',
	'cspromo/subscribe/inspector-controls-top',
	createHigherOrderComponent( ( BlockEdit ) => {
		return ( props ) => {
			if ( ! props.isSelected ) {
				return <BlockEdit { ...props } />;
			}

			return <ComponentWrapper BlockEdit={ BlockEdit } props={ props } />;
		};
	}, 'withInspectorControlsSubscribe' )
);
