/**
 * Internal dependencies
 */
import {
	Root,
	Viewbox,
	TopStroke,
	RightStroke,
	BottomStroke,
	LeftStroke,
} from './styles/box-control-icon-styles';
import { Icon } from '@wordpress/icons';
import { BorderBottom, BorderLeft, BorderRight, BorderTop } from '@kubio/icons';

const BASE_ICON_SIZE = 24;

export default function BorderControlIcon( {
	size = 24,
	side = 'all',
	...props
} ) {
	const top = getSide( side, 'top' );
	const right = getSide( side, 'right' );
	const bottom = getSide( side, 'bottom' );
	const left = getSide( side, 'left' );

	// Simulates SVG Icon scaling
	const scale = size / BASE_ICON_SIZE;

	return (
		<Root style={ { transform: `scale(${ scale })` } } { ...props }>
			<Viewbox>
				<div className={ 'kubio-border-radius-icon-container' }>
					<Icon
						icon={ BorderTop }
						className={ top ? 'kubio-border-radius-selected' : '' }
					/>
					<Icon
						icon={ BorderLeft }
						className={ left ? 'kubio-border-radius-selected' : '' }
					/>
					<Icon
						icon={ BorderBottom }
						className={
							bottom ? 'kubio-border-radius-selected' : ''
						}
					/>
					<Icon
						icon={ BorderRight }
						className={
							right ? 'kubio-border-radius-selected' : ''
						}
					/>
				</div>
			</Viewbox>
		</Root>
	);
}

function getSide( side, value ) {
	return side === 'all' || side === value;
}
