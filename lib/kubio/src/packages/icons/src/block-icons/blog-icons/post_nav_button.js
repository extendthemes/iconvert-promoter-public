import { BlockIconWrapper } from '../utils/block-icon-wrapper';
import { Path, Rect } from '@wordpress/primitives';

export default (
	<BlockIconWrapper x1={86.51} y1={86.51} x2={425.49} y2={425.49}>
		{({ gradientClassName, backgroundClassName }) => (
			<>
				<Rect
					className={backgroundClassName}
					y="107.85"
					width="512"
					height="296.3"
					rx="45.54"
				/>
				<Path
					className={gradientClassName}
					d="M121.13,271.32l38.54,36.08a13.08,13.08,0,0,0,17.89-19.1L143.06,256l34.5-32.3a13.08,13.08,0,0,0-17.89-19.1l-38.54,36.08-.31.3a21.27,21.27,0,0,0,0,30Z"
				/>
				<Path
					className={gradientClassName}
					d="M333.84,306.8a13.07,13.07,0,0,0,18.49.6l38.54-36.08.31-.3a21.27,21.27,0,0,0,0-30l-.31-.3L352.33,204.6a13.08,13.08,0,0,0-17.89,19.1l34.5,32.3-34.5,32.3A13.09,13.09,0,0,0,333.84,306.8Z"
				/>
				<Path
					className={gradientClassName}
					d="M466.46,135.07H45.54a18.33,18.33,0,0,0-18.32,18.32V358.61a18.33,18.33,0,0,0,18.32,18.32H466.46a18.33,18.33,0,0,0,18.32-18.32V153.39A18.33,18.33,0,0,0,466.46,135.07ZM242.91,350.76H53.39V161.24H242.91Zm215.7,0H269.09V161.24H458.61Z"
				/>
			</>
		)}
	</BlockIconWrapper>
);
