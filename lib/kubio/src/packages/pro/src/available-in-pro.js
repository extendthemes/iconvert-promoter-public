import { BaseControl, Button, Flex } from '@wordpress/components';
import { useCallback, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useProModal } from './pro-modal';
import { DISABLE_TRY_ONLY, getStringValueWithId } from './strings-by-id';
import { noticeMessage, tryOnline, upgradeToPro } from './utils';

const ControlNotice = ( { showLabel = true, label, content = '' } ) => {
	return (
		<BaseControl>
			<div className={ 'h-control-notice' }>
				{ showLabel && (
					<span className="h-control-notice__label">{ label }</span>
				) }
				<div className={ 'h-control-notice__content' }>{ content }</div>
			</div>
		</BaseControl>
	);
};

export { AvailableInPro, ControlNotice };

const AvailableInPro = ( {
	displayModal = true,
	urlArgs = {},
	...props
} = {} ) => {
	/* eslint-disable no-unreachable, react-hooks/rules-of-hooks */
	const ref = useRef();
	const [ ProModal, showModal ] = useProModal();
	const onClick = useCallback( ( event ) => {
		if ( displayModal ) {
			event.preventDefault();
			event.stopPropagation();
			showModal( true );
		} else {
			upgradeToPro( urlArgs );
		}
	}, [] );

	const onTryOnline = useCallback( () => {
		tryOnline( urlArgs );
	}, [] );

	return (
		<BaseControl ref={ ref } className="kubio-feature-available-in-pro">
			<div className={ 'h-control-notice' }>
				<span className="h-control-notice__label">
					{ __( 'PRO', 'kubio' ) }
				</span>
				<div className={ 'h-control-notice__content' }>
					<label className="label-title">
						{ noticeMessage( props ) }
					</label>
				</div>
				<Flex
					justify={ 'flex-start' }
					align={ 'flex-start' }
					className={ 'h-control-notice__content' }
				>
					<Button
						isSmall={ true }
						variant={ 'primary' }
						onClick={ onClick }
					>
						{ getStringValueWithId( 'pro.upgrade.label' ) }
						{ displayModal && (
							<ProModal
								urlArgs={ urlArgs }
								anchorRef={ ref.current }
							/>
						) }
					</Button>
					{ ! displayModal && ! DISABLE_TRY_ONLY && (
						<Button
							isSmall={ true }
							variant={ 'secondary' }
							onClick={ onTryOnline }
						>
							{ getStringValueWithId( 'pro.try.label' ) }
						</Button>
					) }
				</Flex>
			</div>
		</BaseControl>
	);
	/* eslint-enable no-unreachable, react-hooks/rules-of-hooks */
};
