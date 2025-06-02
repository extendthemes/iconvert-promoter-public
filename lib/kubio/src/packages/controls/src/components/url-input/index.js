import { fetchLinkSuggestions, useOnClickOutside } from '@kubio/core';
import { useUIVersion } from '@kubio/core-hooks';
import { EnterIcon } from '@kubio/icons';
import { ucwords } from '@kubio/utils';
import {
	BaseControl,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	Popover,
	Tooltip,
} from '@wordpress/components';
import { select } from '@wordpress/data';
import { createPortal, useCallback, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cog, Icon } from '@wordpress/icons';
import classnames from 'classnames';
import { find, noop } from 'lodash';
import LinkSelector from './url-input-wordpress';

const getSuggestionType = ( { type, taxonomy, block } ) => {
	if ( type ) {
		switch ( type ) {
			case 'post':
				return __( 'Post', 'kubio' );

			case 'page':
				return __( 'Page', 'kubio' );
			default:
				return ucwords( type.replace( /[\-\_]/gi, ' ' ) );
		}
	}

	if ( taxonomy ) {
		switch ( taxonomy ) {
			case 'post_tag':
				return __( 'Tag', 'kubio' );

			case 'category':
				return __( 'Category', 'kubio' );
		}
	}

	if ( block ) {
		const blockTypes = select( 'core/blocks' ).getBlockTypes();
		const blockType = find( blockTypes, { name: block } );
		return blockType?.title || __( 'Unknown Block', 'kubio' );
	}
};

const URLInput = ( {
	label,
	value,
	onChange,
	placeholder,
	showInitialSuggestions = false,
	showSuggestionsInline = false,
	allowSettings = false,
	suggestionsPortalContainerRef = false,
	suggestionsLimit = 3,
	onClick,
	onSuggestionSelected = noop,
	autoFocus,
} ) => {
	const suggestionsRef = useRef();
	const ref = useRef();
	const clickOutsideCallback = useRef( noop );
	const { uiVersion } = useUIVersion();

	const clickOutsideFunction = useCallback( () => {
		clickOutsideCallback.current();
	}, [] );

	useOnClickOutside( suggestionsRef, clickOutsideFunction );

	const getAnchorRect = useCallback( () => {
		const rect = ref.current?.getBoundingClientRect?.();
		const position = rect?.toJSON() || {};
		const horizontalOffset = uiVersion === 2 ? 1 : 0;

		return {
			...position,
			left: position.left + horizontalOffset,
			x: position.x + horizontalOffset,
			right: position.right + horizontalOffset,
			ownerDocument: ref.current?.ownerDocument,
		};
	}, [ uiVersion ] );

	const renderSuggestions = ( {
		suggestions,
		selectedSuggestion,
		suggestionsListProps,
		closePopover,
		handleSuggestionClick,
	} ) => {
		clickOutsideCallback.current = closePopover;

		suggestions = suggestionsLimit
			? suggestions.slice( 0, suggestionsLimit )
			: suggestions;

		const suggestionsContent = (
			<div
				{ ...suggestionsListProps }
				className={ classnames(
					'block-editor-url-input__suggestions',
					`kubio-url-control__suggestions`
				) }
				ref={ suggestionsRef }
			>
				{ suggestions.map( ( suggestion, index ) => (
					<Button
						key={ index }
						className={ classnames(
							'kubio-url-control__suggestion',
							{
								'is-selected': index === selectedSuggestion,
							}
						) }
						onClick={ () => {
							handleSuggestionClick( suggestion );
							onSuggestionSelected( suggestion );
						} }
					>
						<Flex>
							<FlexBlock>
								<Flex
									justify={ 'start' }
									className={
										'kubio-url-control__suggestion_title-wrapper'
									}
								>
									<FlexItem
										className={
											'kubio-url-control__suggestion_title'
										}
									>
										{ suggestion.title }
									</FlexItem>
									<FlexItem
										className={
											'kubio-url-control__suggestion_type'
										}
									>
										({ getSuggestionType( suggestion ) })
									</FlexItem>
								</Flex>
								<div
									className={
										'kubio-url-control__suggestion_url'
									}
								>
									<Tooltip text={ suggestion.url }>
										<span>{ suggestion.url }</span>
									</Tooltip>
								</div>
							</FlexBlock>
							<FlexItem>
								<Icon icon={ EnterIcon } width={ 12 } />
							</FlexItem>
						</Flex>
					</Button>
				) ) }
			</div>
		);

		if ( suggestionsPortalContainerRef ) {
			return createPortal(
				suggestionsContent,
				suggestionsPortalContainerRef.current
			);
		}

		if ( showSuggestionsInline ) {
			return suggestionsContent;
		}

		return (
			<Popover
				className={ 'kubio-url-control__popover' }
				position={ uiVersion === 2 ? 'bottom right' : 'bottom' }
				placement={ 'bottom-end' }
				getAnchorRect={ getAnchorRect }
				noArrow
				focusOnMount={ false }
				shouldAnchorIncludePadding={ true }
				__unstableForceXAlignment={ uiVersion === 2 }
			>
				{ suggestionsContent }
			</Popover>
		);
	};

	/* eslint-disable jsx-a11y/no-autofocus */
	return (
		<BaseControl
			className={ classnames(
				'kubio-url-control-container',
				'kubio-control'
			) }
		>
			{ typeof label !== 'undefined' ? (
				<BaseControl.VisualLabel>{ label }</BaseControl.VisualLabel>
			) : (
				''
			) }
			<div ref={ ref } className="kubio-url-control-input-container">
				<LinkSelector
					autoFocus={ autoFocus }
					className={ 'kubio-url-control' }
					value={ value }
					onChange={ onChange }
					placeholder={
						placeholder ?? __( 'Search or type url', 'kubio' )
					}
					__experimentalHandleURLSuggestions={ true }
					__experimentalFetchLinkSuggestions={ fetchLinkSuggestions }
					__experimentalShowInitialSuggestions={
						showInitialSuggestions
					}
					__experimentalRenderSuggestions={ renderSuggestions }
				/>

				{ allowSettings && (
					<Button
						isSmall
						icon={ cog }
						className={ 'kubio-input-wrapper-button' }
						onClick={ onClick }
					/>
				) }
			</div>
		</BaseControl>
	);
	/* eslint-enable jsx-a11y/no-autofocus */
};

export { URLInput };
