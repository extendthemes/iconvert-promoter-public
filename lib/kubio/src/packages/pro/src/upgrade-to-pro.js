/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable jsx-a11y/label-has-for */
import { BaseControl, Button } from '@wordpress/components';
import { useCallback } from '@wordpress/element';
import { DISABLE_TRY_ONLY, getStringValueWithId } from './strings-by-id';
import { upgradeToPro, tryOnline } from './utils';

let isProOnly = false;


const UpgradeToProOverlay = ({ show, message, urlArgs }) => {
	
	const onClickUpgrade = useCallback(
		(event) => {
			event.preventDefault();
			upgradeToPro(urlArgs);
		},
		[urlArgs]
	);
	const onClickTry = useCallback(
		(event) => {
			event.preventDefault();
			tryOnline(urlArgs);
		},
		[urlArgs]
	);

	if (isProOnly) {
		return <></>;
	}
	
	return show && <div className="kubio-feature-upgrade-to-pro-overlay">
		<div className="kubio-feature-upgrade-to-pro">
			<div className={'upgrade-to-pro__content'}>
				<p className="label-title">
					{message || getStringValueWithId('pro.try.msg')}
				</p>
				<div className="upgrade-to-pro__content-buttons">
					<Button
						className={'btn-upgrade'}
						onMouseUp={onClickUpgrade}
					>
						{getStringValueWithId('pro.upgrade.label')}
					</Button>
				</div>
			</div>
		</div>

	</div>
}

const UpgradeToPro = ( { urlArgs = {}, message = null } ) => {
	const onClickUpgrade = useCallback(
		( event ) => {
			event.preventDefault();
			upgradeToPro( urlArgs );
		},
		[ urlArgs ]
	);
	const onClickTry = useCallback(
		( event ) => {
			event.preventDefault();
			tryOnline( urlArgs );
		},
		[ urlArgs ]
	);

	if ( isProOnly ) {
		return <></>;
	}
	return (
		<BaseControl className="kubio-feature-upgrade-to-pro">
			<div className={ 'upgrade-to-pro__content' }>
				<p className="label-title">
					{ message || getStringValueWithId( 'pro.try.msg' ) }
				</p>
				<div className="upgrade-to-pro__content-buttons">
					<Button
						className={ 'btn-upgrade' }
						onMouseUp={ onClickUpgrade }
					>
						{ getStringValueWithId( 'pro.upgrade.label' ) }
					</Button>
					{ ! DISABLE_TRY_ONLY && (
						<Button
							className={ 'btn-try' }
							onMouseUp={ onClickTry }
						>
							{ getStringValueWithId( 'pro.try.label' ) }
						</Button>
					) }
				</div>
			</div>
		</BaseControl>
	);
};

export { UpgradeToPro, UpgradeToProOverlay };
