import { Button, Dropdown } from '@wordpress/components';
import { FontsList } from './fonts/fonts-list';
import { ucwords } from '@kubio/utils';
import { useDispatch } from '@wordpress/data';
import { STORE_KEY } from '@kubio/constants';
import { __ } from '@wordpress/i18n';
import { Icon, chevronDown } from '@wordpress/icons';
import classnames from 'classnames';
import { ResetIcon } from '@kubio/icons';

const FontPicker = ( {
	value,
	onChange,
	onReset,
	placeholder = __( 'Select…', 'kubio' ),
	allowReset = false,
} ) => {
	const onFontChange = ( font, closePopover ) => {
		onChange( font );
		closePopover();
	};

	const { openSidebar } = useDispatch( STORE_KEY ) || {};

	let label;
	const showPlaceholder = ! value;
	if ( ! showPlaceholder ) {
		label = ucwords( ( value || '' ).replace( /-/gi, ' ' ) );
	} else {
		label = placeholder;
	}

	return (
		<div className="">
			<div
				className={ classnames(
					'kubio-font-picker-container',
					'kubio-control'
				) }
			>
				<div className="position-relative kubio-font-picker-dropdown-container">
					<Dropdown
						contentClassName="kubio-fontpicker-content"
						renderToggle={ ( { isOpen, onToggle } ) => (
							<div className={ 'kubio-fonts-dropdown' }>
								<Button
									className={ classnames(
										'kubio-font-picker-button',
										{
											'kubio-font-picker-button--placeholder':
												showPlaceholder,
										}
									) }
									isSecondary
									onClick={ onToggle }
									aria-expanded={ isOpen }
								>
									<div className={ 'float-left' }>
										{ label }
									</div>
									<div className={ 'float-right' }>
										<Icon
											icon={ chevronDown }
											className="h-select-control__button-icon"
										/>
									</div>
								</Button>
							</div>
						) }
						renderContent={ ( { onClose } ) => (
							<div className="fonts-list">
								<FontsList
									onChange={ ( e ) =>
										onFontChange( e, onClose )
									}
									value={ value }
								/>
								{ openSidebar && (
									<div className={ 'kubio-font-footer' }>
										<Button
											onClick={ () =>
												openSidebar(
													'document/general-settings/typography'
												)
											}
										>
											{ __(
												'Manage font providers',
												'kubio'
											) }
										</Button>
									</div>
								) }
							</div>
						) }
					/>
				</div>
				{ allowReset && (
					<Button
						isSmall
						icon={ ResetIcon }
						label={ __( 'Reset', 'kubio' ) }
						className={
							'kubio-popover-options-icon kubio-color-indicator-popover-reset-icon'
						}
						// disabled={!isDirty}
						onClick={ onReset }
					/>
				) }
			</div>
		</div>
	);
};

export { FontPicker };
