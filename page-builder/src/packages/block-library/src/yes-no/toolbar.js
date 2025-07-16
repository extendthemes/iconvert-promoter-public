import { GutentagSelectControl } from '@kubio/controls';
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
import { blockIcon } from './block-icon';

const POPOVER_PROPS = {
	className: 'ic-promo-yes-no-toolbar-state-popover',
};

const VIEW_STATES = [
	{
		value: '',
		label: __( 'Show Buttons', 'iconvert-promoter' ),
	},
	{
		value: 'yes',
		label: __( 'Show Yes Content', 'iconvert-promoter' ),
	},
	{
		value: 'no',
		label: __( 'Show No Content', 'iconvert-promoter' ),
	},
];

export const useContentViewState = ( dataHelper ) => {
	return useSessionProp( dataHelper.clientId, 'yesNoViewState', '' );
};

export const useToolbarState = ( dataHelper ) => {
	const showYesContent = dataHelper.getAttribute( 'yesAction' ) === 'content';
	const showNoContent = dataHelper.getAttribute( 'noAction' ) === 'content';

	const { selectBlock } = useDispatch( 'core/block-editor' );

	const [ viewState, setViewState ] = useContentViewState( dataHelper );

	const activeLabel = useMemo( () => {
		return VIEW_STATES.find( ( { value } ) => value === viewState )?.label;
	}, [ viewState ] );

	const activeViewStates = useMemo( () => {
		return VIEW_STATES.filter( ( { value } ) => {
			if ( value === 'yes' ) {
				return showYesContent;
			}
			if ( value === 'no' ) {
				return showNoContent;
			}
			return true;
		} );
	}, [ showNoContent, showYesContent ] );

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
		if ( viewState === 'yes' && ! showYesContent ) {
			setViewState( '' );
		}
		if ( viewState === 'no' && ! showNoContent ) {
			setViewState( '' );
		}
	}, [ setViewState, showNoContent, showYesContent, viewState ] );

	if ( controlOptions.length < 2 ) {
		return {
			viewState,
			toolbarComponent: null,
			sidebarDropdownComponent: null,
		};
	}

	const sidebarDropdownComponent = (
		<GutentagSelectControl
			className="kubio-editing-select"
			value={ viewState }
			label={
				<Flex gap={ 2 } align="center" justify="flex-start">
					<Icon icon={ blockIcon } />
					<span>{ __( 'Yes/No view', 'iconvert-promoter' ) }</span>
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

	return {
		viewState,
		toolbarComponent,
		sidebarDropdownComponent,
	};
};
