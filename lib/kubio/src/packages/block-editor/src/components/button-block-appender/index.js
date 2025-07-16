/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Button, Tooltip, VisuallyHidden } from '@wordpress/components';
import {
	forwardRef,
	useCallback,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { _x, sprintf } from '@wordpress/i18n';
import { Icon, plus } from '@wordpress/icons';
import deprecated from '@wordpress/deprecated';
import { wpVersionCompare } from '@kubio/utils';
/**
 * Internal dependencies
 */
import Inserter from '../inserter';
import { useMergeRefs } from '@wordpress/compose';

// eslint-disable-next-line camelcase
const isLessThan6_4 = wpVersionCompare( '6.4', '<' );
function ButtonBlockAppender(
	{ rootClientId, className, onFocus, tabIndex },
	ref
) {
	const [ buttonRef, setButtonRef ] = useState( null );
	const mergedRefs = useMergeRefs( [ ref, setButtonRef ] );

	const anchor = useMemo( () => {
		return {
			getBoundingClientRect() {
				return buttonRef?.getBoundingClientRect?.();
			},
			contextElement: isLessThan6_4 ? undefined : buttonRef,
			ownerDocument: isLessThan6_4 ? buttonRef?.ownerDocument : undefined,
		};
	}, [ buttonRef ] );

	return (
		<Inserter
			position="bottom center"
			rootClientId={ rootClientId }
			__experimentalIsQuick
			anchor={ anchor }
			anchorRef={ buttonRef }
			renderToggle={ ( {
				onToggle,
				disabled,
				isOpen,
				blockTitle,
				hasSingleBlockType,
			} ) => {
				let label;
				if ( hasSingleBlockType ) {
					label = sprintf(
						// translators: %s: the name of the block when there is only one
						_x(
							'Add %s',
							'directly add the only allowed block',
							'kubio'
						),
						blockTitle
					);
				} else {
					label = _x(
						'Add block',
						'Generic label for block inserter button',
						'kubio'
					);
				}
				const isToggleButton = ! hasSingleBlockType;

				let inserterButton = (
					<Button
						ref={ mergedRefs }
						onFocus={ onFocus }
						tabIndex={ tabIndex }
						className={ classnames(
							className,
							'block-editor-button-block-appender'
						) }
						onClick={ onToggle }
						aria-haspopup={ isToggleButton ? 'true' : undefined }
						aria-expanded={ isToggleButton ? isOpen : undefined }
						disabled={ disabled }
						label={ label }
					>
						{ ! hasSingleBlockType && (
							<VisuallyHidden as="span">{ label }</VisuallyHidden>
						) }
						<Icon icon={ plus } />
					</Button>
				);

				if ( isToggleButton || hasSingleBlockType ) {
					inserterButton = (
						<Tooltip text={ label }>{ inserterButton }</Tooltip>
					);
				}
				return inserterButton;
			} }
			isAppender
		/>
	);
}

/**
 * Use `ButtonBlockAppender` instead.
 *
 * @deprecated
 */
export const ButtonBlockerAppender = forwardRef( ( props, ref ) => {
	deprecated( `wp.blockEditor.ButtonBlockerAppender`, {
		alternative: 'wp.blockEditor.ButtonBlockAppender',
		since: '5.9',
	} );

	return ButtonBlockAppender( props, ref );
} );

/**
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/button-block-appender/README.md
 */
export default forwardRef( ButtonBlockAppender );
