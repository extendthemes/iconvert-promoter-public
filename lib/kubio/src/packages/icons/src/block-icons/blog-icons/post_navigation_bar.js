import { BlockIconWrapper } from '../utils/block-icon-wrapper';
import { Path, Circle } from '@wordpress/primitives';

export default (
	<BlockIconWrapper x1={136.91} y1={136.9} x2={375.1} y2={375.1}>
		{({ gradientClassName, backgroundClassName }) => (
			<>
				<Path
					className={backgroundClassName}
					d="M344.85,204.9a51.12,51.12,0,0,0-44.42,25.87,51.06,51.06,0,0,0-88.83,0,51.11,51.11,0,1,0,0,50.46,51.05,51.05,0,0,0,88.83,0,51.09,51.09,0,1,0,44.42-76.33Z"
				/>
				<Path
					className={backgroundClassName}
					d="M497.63,222.66l-.3-.3-41.52-38.9a38.5,38.5,0,0,0-52.63,56.21L420.62,256l-17.44,16.33a38.5,38.5,0,0,0,52.63,56.21l41.08-38.47.74-.73A47.21,47.21,0,0,0,497.63,222.66Z"
				/>
				<Path
					className={backgroundClassName}
					d="M108.85,272.33,91.41,256l17.44-16.33a38.5,38.5,0,0,0-52.64-56.2L15.3,221.78l-.9.88a47.14,47.14,0,0,0,0,66.69l.3.3,41.52,38.89a38.5,38.5,0,0,0,52.63-56.21Z"
				/>
				<Circle
					className={gradientClassName}
					cx="256.01"
					cy="256"
					r="25.11"
				/>
				<Circle
					className={gradientClassName}
					cx="167.17"
					cy="256"
					r="25.11"
				/>
				<Circle
					className={gradientClassName}
					cx="344.84"
					cy="256"
					r="25.11"
				/>
				<Path
					className={gradientClassName}
					d="M429.49,312.93a12.5,12.5,0,0,1-8.55-21.62L458.65,256l-37.71-35.31A12.5,12.5,0,0,1,438,202.44L479.24,241a21.2,21.2,0,0,1,0,29.92l-.3.29L438,309.56A12.44,12.44,0,0,1,429.49,312.93Z"
				/>
				<Path
					className={gradientClassName}
					d="M82.52,312.93A12.44,12.44,0,0,1,74,309.56L32.77,271a21.17,21.17,0,0,1,0-29.92l.3-.28L74,202.44a12.5,12.5,0,1,1,17.09,18.25L53.36,256l37.71,35.31a12.5,12.5,0,0,1-8.55,21.62Z"
				/>
			</>
		)}
	</BlockIconWrapper>
);
