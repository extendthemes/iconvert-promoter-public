import { useBlockEditContext } from '@wordpress/block-editor';
import { useDebounce } from '@wordpress/compose';
import {
	dispatch as globalDispatch,
	select as globalSelect,
	subscribe,
} from '@wordpress/data';
import { useCallback, useEffect } from '@wordpress/element';
import { addAction, removeAction } from '@wordpress/hooks';
import { noop } from 'lodash';

const returnFalse = () => false;

const useNoticeOnBlockRemove = ( message, level = 'warn', actions = [] ) => {
	const { clientId } = useBlockEditContext();

	const blockDeletionCheck = useDebounce(
		useCallback(
			( unsubscribe, onUnmount = false ) => {
				const { clearSelectedBlock } =
					globalDispatch( 'core/block-editor' );

				const { createWarningNotice, createErrorNotice, removeNotice } =
					globalDispatch( 'core/notices' );

				const { wasBlockJustRemoved = returnFalse } =
					globalSelect( 'core/block-editor' );

				if ( wasBlockJustRemoved( clientId ) ) {
					unsubscribe();

					let createNotice = noop;
					const noticeId = clientId + '-kubio-deleted';

					addAction(
						'kubio.editor.page-changed',
						`kubio-page-changed-remove-notice-${ noticeId }`,
						function () {
							removeAction(
								'kubio.editor.page-changed',
								`kubio-page-changed-remove-notice-${ noticeId }`
							);
							removeNotice( noticeId );
						}
					);

					switch ( level ) {
						case 'error':
							createNotice = createErrorNotice;
							break;
						default:
							createNotice = createWarningNotice;
					}

					createNotice( message, {
						id: noticeId,
						actions,
					} );
					clearSelectedBlock();
				} else if ( onUnmount ) {
					unsubscribe();
				}
			},
			[ clientId ]
		),
		300
	);

	useEffect( () => {
		const unsubscribe = subscribe( () =>
			blockDeletionCheck( unsubscribe )
		);
		return () => blockDeletionCheck( unsubscribe, true );
	}, [ clientId ] );
};

export { useNoticeOnBlockRemove };
