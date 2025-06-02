import { ucwords } from '@kubio/utils';
import { useCallback, useRef } from '@wordpress/element';
import SeparatorHorizontalLine from '../../separator-horizontal-line';

const FontListItem = ( {
	item,
	style, // Style object to be applied to row (to position it)
	isSelected,
	onClick,
	pastSeparator = false,
	isVisible = false,
} ) => {
	const isSeparator = !! item.separator;
	const linkRef = useRef();

	const onStyleLoaded = useCallback( () => {
		if ( linkRef.current?.rel ) {
			linkRef.current.rel = 'stylesheet';
		}
	}, [] );

	if ( isSeparator ) {
		style = { ...style, height: 20, top: style.top - 5 };
		return (
			<div style={ style }>
				<SeparatorHorizontalLine
					className={ 'kubio-font-list-category-separator' }
					fit={ true }
				/>
			</div>
		);
	}
	if ( pastSeparator ) {
		style = {
			...style,
			top: style.top - 15,
		};
	}

	const itemClassName = [
		isSelected ? 'selected-font' : '',
		'kubio-font-list-preview-item',
	].join( ' ' );

	const fontPreview = {
		fontFamily: [ item.family, 'sans-serif' ].join( ',' ),
	};

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events
		<div
			tabIndex={ 0 }
			role={ 'button' }
			style={ style }
			className={ itemClassName }
			onClick={ () => onClick( item ) }
		>
			{ isVisible && (
				<link
					href={ `https://fonts.googleapis.com/css?family=${ item.family }&display=swap` }
					rel="preload"
					as="style"
					ref={ linkRef }
					onLoad={ onStyleLoaded }
				/>
			) }
			<span style={ fontPreview }>
				{ ucwords( item.family.replace( /-/gi, ' ' ) ) }
			</span>
		</div>
	);
};

export default FontListItem;
