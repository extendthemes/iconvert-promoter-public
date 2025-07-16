import { GutentagColorPickerWithPalette } from '@kubio/controls';
import { useOnClickOutside } from '@kubio/utils';
import {
	Popover,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalStyleProvider as StyleProvider,
} from '@wordpress/components';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import {
	applyFormat,
	getActiveFormat,
	useAnchorRef,
} from '@wordpress/rich-text';
import { textColor as settings } from './index';
import { useGetPopoverOptions } from '../common/use-get-popover-options';

export function getActiveColor( formatName, formatValue ) {
	const activeColorFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeColorFormat ) {
		return;
	}
	const styleColor = activeColorFormat.attributes.style;
	if ( styleColor ) {
		return styleColor.match( /color:(.*?)(;|$)/ )?.[ 1 ]?.trim();
	}
}

export default function InlineColorUI( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
	onReset,
	currentColor,
	formatValue,
} ) {
	const popperRef = useRef();
	const applyColor = ( color ) =>
		onChange(
			applyFormat( value, {
				type: name,
				attributes: {
					style: `color:${ color }`,
				},
			} ),
			color
		);

	const onClickOutside = useCallback(
		( event ) => {
			const target = event?.target;
			const popperNode = popperRef.current;
			if ( target && popperNode?.contains( target ) ) {
				return;
			}
			onClose();
		},
		[ popperRef.current, onClose ]
	);

	useOnClickOutside( popperRef, onClickOutside );
	const { popoverOptions } = useGetPopoverOptions( {
		contentRef,
		settings,
		value,
	} );
	return (
		<StyleProvider document={ document }>
			<Popover
				value={ value }
				className="kubio-components-inline-color-popover kubio-color-popover"
				position={ 'bottom center' }
				placement="bottom"
				{ ...popoverOptions }
			>
				<div ref={ popperRef }>
					<GutentagColorPickerWithPalette
						defaultValue={ currentColor }
						onChange={ applyColor }
						hasButton={ true }
						onButtonClick={ onReset }
					/>
				</div>
			</Popover>
		</StyleProvider>
	);
}
