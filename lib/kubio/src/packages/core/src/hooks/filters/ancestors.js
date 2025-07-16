import { getBlockType } from '@wordpress/blocks';
import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { useMemo, useState } from '@wordpress/element';
import { isString } from 'lodash';
import { AncestorContext } from '../../context';
import { addKubioProps } from '../blocks';
import { hasKubioSupport } from '@kubio/utils';

function normalizeBlockType( blockTypeOrName ) {
	if ( isString( blockTypeOrName ) ) {
		return getBlockType( blockTypeOrName );
	}
	return blockTypeOrName;
}

const AncestorContextProvider = ( { BlockListBlock, ...props } ) => {
	const [ ancestor, setAncestor ] = useState( '' );
	const ancestorValue = useMemo( () => {
		return {
			ancestor,
			setAncestor,
		};
	}, [ ancestor, setAncestor ] );

	const { name, attributes } = props;

	const newProps = { ...props };
	addKubioProps( newProps, normalizeBlockType( name ), attributes );

	return name === 'kubio/navigation' ? (
		<AncestorContext.Provider value={ ancestorValue }>
			<BlockListBlock key={ 'navigation' } { ...newProps } />
		</AncestorContext.Provider>
	) : (
		<BlockListBlock key={ 'no-ancestor' } { ...newProps } />
	);
};

const BlockListBlockColibri = compose( [
	createHigherOrderComponent( ( BlockListBlock ) => {
		return ( props ) => {
			if ( ! hasKubioSupport( props.name ) ) {
				return <BlockListBlock { ...props } />;
			}

			return (
				<AncestorContextProvider
					BlockListBlock={ BlockListBlock }
					{ ...props }
				/>
			);
		};
	}, 'BlockListBlockColibri' ),
] );

export { BlockListBlockColibri };
