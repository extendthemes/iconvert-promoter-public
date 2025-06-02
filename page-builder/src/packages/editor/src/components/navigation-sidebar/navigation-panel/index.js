/**
 * External dependencies
 */
import {
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	Tooltip,
} from '@wordpress/components';
/**
 * WordPress dependencies
 */
import { usePrevious } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { close } from '@wordpress/icons';
import { ESCAPE } from '@wordpress/keycodes';
import classnames from 'classnames';
import { STORE_KEY } from '@kubio/editor';
import { MENU_ROOT } from './constants';
import ContentNavigation from './content-navigation';

const NavigationPanel = ( { isOpen } ) => {
	const [ contentActiveMenu, setContentActiveMenu ] = useState( MENU_ROOT );

	const { siteTitle } = useSelect( ( select ) => {
		const { getEntityRecord } = select( 'core' );

		const siteData =
			getEntityRecord( 'root', '__unstableBase', undefined ) || {};

		return {
			siteTitle: siteData.name,
		};
	}, [] );

	// Ensures focus is moved to the panel area when it is activated
	// from a separate component (such as document actions in the header).
	const panelRef = useRef();
	useEffect( () => {
		if ( isOpen ) {
			panelRef.current.focus();
		}
	}, [ contentActiveMenu ] );

	const prevIsOpen = usePrevious( isOpen );
	useEffect( () => {
		if ( contentActiveMenu !== MENU_ROOT && isOpen && ! prevIsOpen ) {
			setContentActiveMenu( MENU_ROOT );
		}
	}, [ contentActiveMenu, isOpen ] );

	const { setIsNavigationPanelOpened } = useDispatch( STORE_KEY );

	const closeOnEscape = ( event ) => {
		if ( event.keyCode === ESCAPE ) {
			event.stopPropagation();
			setIsNavigationPanelOpened( false );
		}
	};

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			className={ classnames( `edit-site-navigation-panel`, {
				'is-open': isOpen,
			} ) }
			ref={ panelRef }
			tabIndex="-1"
			onKeyDown={ closeOnEscape }
		>
			<div className="edit-site-navigation-panel__inner">
				<div className="edit-site-navigation-panel__site-title-container">
					<Flex>
						<FlexBlock>
							<div className="edit-site-navigation-panel__site-title">
								{ siteTitle }
							</div>
						</FlexBlock>
						<FlexItem>
							<Tooltip
								text={ __(
									'Close panel',
									'iconvert-promoter'
								) }
							>
								<Button
									className={
										'kubio-edit-site-navigation-panel__close-button'
									}
									icon={ close }
									onClick={ () =>
										setIsNavigationPanelOpened( false )
									}
								/>
							</Tooltip>
						</FlexItem>
					</Flex>
				</div>

				<div className="edit-site-navigation-panel__scroll-container">
					<ContentNavigation
						onActivateMenu={ setContentActiveMenu }
					/>
				</div>
			</div>
		</div>
	);
};

export default NavigationPanel;
