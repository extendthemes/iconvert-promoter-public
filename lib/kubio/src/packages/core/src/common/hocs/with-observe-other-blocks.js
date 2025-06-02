import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { castArray, isEmpty, isString } from 'lodash';
import isEqual from 'react-fast-compare';
import { useKubioBlockContext } from '../../context';

const withObserveOtherBlocks = ( mapSelectObserverBlockClientIds ) =>
	compose(
		createHigherOrderComponent(
			( WrappedComponent ) => ( ownProps ) => {
				const [ observedBlocks, setObservedBlocks ] = useState( null );
				const observedBlocksHashes = useRef( null );
				const { dataHelper } = useKubioBlockContext();

				const mapSelect = ( select, registry ) =>
					mapSelectObserverBlockClientIds( select, ownProps, {
						dataHelper,
						registry,
					} );

				const { nextHashes, clientIDs } = useSelect(
					( select, registry ) => {
						const ids = castArray(
							mapSelect( select, registry )
						).filter(
							( clientID ) =>
								isString( clientID ) &&
								clientID !== ownProps.clientId
						);

						const hashes = ids
							.map( select( 'core/block-editor' ).getBlock )
							.filter( Boolean )
							.map(
								( { attributes } ) => attributes?.kubio?.hash
							)
							.filter( Boolean );

						return {
							nextHashes: isEmpty( hashes ) ? null : hashes,
							clientIDs: ids,
						};
					},
					[]
				);

				useEffect( () => {
					if (
						nextHashes?.length &&
						! isEqual( observedBlocksHashes.current, nextHashes )
					) {
						observedBlocksHashes.current = nextHashes;

						setObservedBlocks(
							clientIDs.reduce(
								( acc, clientID ) => ( {
									...acc,
									[ clientID ]:
										dataHelper?.withClientId?.( clientID ),
								} ),
								{}
							)
						);
					}
				}, [ clientIDs, dataHelper, nextHashes ] );

				return (
					<WrappedComponent
						{ ...ownProps }
						observedBlocks={ observedBlocks }
					/>
				);
			},
			'withObserveAnotherBlocks'
		)
	);

export { withObserveOtherBlocks };
