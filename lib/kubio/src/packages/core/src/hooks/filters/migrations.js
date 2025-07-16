import { Log } from '@kubio/log';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { difference, get, has, isArray, isEmpty, set } from 'lodash';
import { useUndoTrapDispatch } from '../../utils/dispatch-marks';
import { hasKubioSupport } from '@kubio/utils';

const processMigrations = ( blockAttributes, migrations ) => {
	const appliedMigrations = get( blockAttributes, 'kubio.migrations', [] );
	const toApply = migrations.filter(
		( { id } ) => ! appliedMigrations.includes( id )
	);

	let nextBlockAttributes = window.structuredClone( blockAttributes );
	toApply.forEach( ( deprecation ) => {
		try {
			appliedMigrations.push( deprecation.id );
			nextBlockAttributes =
				deprecation.handleAttributes( nextBlockAttributes );
		} catch ( e ) {
			Log.error( 'Block deprecation error', e );
		}
	} );

	set( nextBlockAttributes, 'kubio.migrations', appliedMigrations );

	return nextBlockAttributes;
};

const kubioApplyBlockMigrations = ( blockAttributes, blockType ) => {
	if ( isArray( blockType?.kubioMigrations ) ) {
		return processMigrations( blockAttributes, blockType.kubioMigrations );
	}

	return blockAttributes;
};

const KubioMigrationWrapper = ( { BlockListBlock, ...props } ) => {
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

	const { name, attributes, clientId } = props;
	const currentMigrations = get( attributes, 'kubio.migrations', null );

	const applyUndoTrap = useUndoTrapDispatch();

	const migrationsIds = useSelect(
		( select ) =>
			select( 'core/blocks' )
				.getBlockType( name )
				?.kubioMigrations?.map( ( { id } ) => id ),
		[]
	);

	let nextAttributes = attributes;
	if (
		isArray( migrationsIds ) &&
		! (
			currentMigrations &&
			isEmpty( difference( migrationsIds, currentMigrations ) )
		)
	) {
		nextAttributes = window.structuredClone( nextAttributes );
		set( nextAttributes, 'kubio.migrations', migrationsIds );
	}
	useEffect( () => {
		if (
			isArray( migrationsIds ) &&
			( ! currentMigrations ||
				! isEmpty( difference( migrationsIds, currentMigrations ) ) )
		) {
			set( attributes, 'kubio.migrations', migrationsIds );
			applyUndoTrap( () =>
				updateBlockAttributes( clientId, attributes )
			);
		}
	}, [] );

	return <BlockListBlock { ...props } attributes={ nextAttributes } />;
};

const BlockAddMigrations = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		if ( ! hasKubioSupport( props.name ) ) {
			return <BlockListBlock { ...props } />;
		}

		return (
			<KubioMigrationWrapper
				BlockListBlock={ BlockListBlock }
				{ ...props }
			/>
		);
	};
}, 'BlockAddMigrations' );

export { kubioApplyBlockMigrations, BlockAddMigrations };
