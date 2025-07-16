/**
 * WordPress dependencies
 */
import { link, linkOff } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Button, Tooltip } from '@wordpress/components';

export default function LinkedButton( { isLinked, ...props } ) {
	const linkedTooltipText = isLinked
		? __( 'Unlink Sides', 'kubio' )
		: __( 'Link Sides', 'kubio' );

	return (
		<Tooltip text={ linkedTooltipText }>
			<span>
				<Button
					{ ...props }
					isSmall
					icon={ isLinked ? link : linkOff }
					className={
						isLinked
							? 'kubio-popover-options-icon kubio-color-indicator-popover-reset-icon kubio-linked-button'
							: 'kubio-popover-options-icon kubio-color-indicator-popover-reset-icon kubio-link-button '
					}
				/>
			</span>
		</Tooltip>
	);
}
