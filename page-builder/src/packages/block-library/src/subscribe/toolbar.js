import { useSessionProp } from '@kubio/editor-data';
import { BlockControls } from '@wordpress/block-editor';
import {
	Flex,
	Icon,
	ToolbarDropdownMenu,
	ToolbarGroup,
} from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { onSuccessStates } from './config';

import { GutentagSelectControl } from '@kubio/controls';
import { BlockIcons } from '@kubio/icons';

const POPOVER_PROPS = {
	className: 'ic-promo-yes-no-toolbar-state-popover',
};

const VIEW_STATES = [
	{
		value: '',
		label: __( 'Show Form', 'iconvert-promoter' ),
	},
	{
		value: 'success-content',
		label: __( 'Show Success', 'iconvert-promoter' ),
	},
];

export const useContentViewState = ( dataHelper ) => {
	return useSessionProp( dataHelper.clientId, 'yesNoViewState', '' );
};

export const useToolbarState = ( dataHelper ) => {
	const showSuccessContent =
		dataHelper.getAttribute( 'onSuccessAction' ) ===
		onSuccessStates.CUSTOM_CONTENT;

	const { selectBlock } = useDispatch( 'core/block-editor' );

	const [ viewState, setViewState ] = useContentViewState( dataHelper );

	const activeLabel = useMemo( () => {
		return VIEW_STATES.find( ( { value } ) => value === viewState )?.label;
	}, [ viewState ] );

	const activeViewStates = useMemo( () => {
		return VIEW_STATES.filter( ( { value } ) => {
			if ( value === 'success-content' ) {
				return showSuccessContent;
			}

			return true;
		} );
	}, [ showSuccessContent ] );

	const controlOptions = useMemo( () => {
		return activeViewStates.map( ( { value, label } ) => {
			const isActive = viewState === value;

			return {
				isActive,
				label,
				title: label,
				onClick() {
					setViewState( value );
					if ( value === '' ) {
						selectBlock( dataHelper.clientId );
					}
				},
			};
		} );
	}, [
		activeViewStates,
		viewState,
		setViewState,
		selectBlock,
		dataHelper.clientId,
	] );

	useEffect( () => {
		if ( viewState === 'success-content' && ! showSuccessContent ) {
			setViewState( '' );
		}
	}, [ setViewState, showSuccessContent, viewState ] );

	if ( controlOptions.length < 2 ) {
		return {
			viewState,
			toolbarComponent: null,
			sidebarDropdownComponent: null,
		};
	}

	const toolbarComponent = (
		<BlockControls>
			<ToolbarGroup className={ 'ic-promo-yes-no-toolbar-state-group' }>
				<ToolbarDropdownMenu
					className={ 'ic-promo-yes-no-toolbar-state' }
					icon={ <span>{ activeLabel }</span> }
					popoverProps={ POPOVER_PROPS }
					controls={ controlOptions }
				/>
			</ToolbarGroup>
		</BlockControls>
	);

	const sidebarDropdownComponent = (
		<GutentagSelectControl
			className="kubio-editing-select"
			value={ viewState }
			label={
				<Flex gap={ 2 } align="center" justify="flex-start">
					<Icon icon={ BlockIcons.Subscribe } />
					<span>{ __( 'Subscribe view', 'iconvert-promoter' ) }</span>
				</Flex>
			}
			onChange={ ( value ) => {
				setViewState( value );
				if ( value === '' ) {
					selectBlock( dataHelper.clientId );
				}
			} }
			options={ activeViewStates }
		/>
	);

	return {
		viewState,
		toolbarComponent,
		sidebarDropdownComponent,
	};
};
