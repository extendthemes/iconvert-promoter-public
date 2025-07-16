import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { get } from 'lodash';
import shortid from 'shortid';
import { useUndoTrapDispatch } from '../../utils';

const KubioEnsureStyleRef = ( { BlockListBlock, ...props } ) => {
	const applyUndoTrap = useUndoTrapDispatch();
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );
	const { clientId } = props;
	useEffect( () => {
		if ( ! get( props, 'attributes.kubio.styleRef' ) ) {
			applyUndoTrap( () =>
				updateBlockAttributes( clientId, {
					kubio: {
						...( props.attributes?.kubio || {} ),
						styleRef: shortid.generate(),
						hash: shortid.generate(),
					},
				} )
			);
		}
	}, [] );

	return <BlockListBlock { ...props } />;
};

const withEnsureStyleRef = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		if (
			props.name.startsWith( 'kubio/' ) ||
			props.name.startsWith( 'cspromo/' )
		) {
			return (
				<KubioEnsureStyleRef
					BlockListBlock={ BlockListBlock }
					{ ...props }
				/>
			);
		}

		return <BlockListBlock { ...props } />;
	};
}, 'withEnsureStyleRef' );

export { withEnsureStyleRef };
