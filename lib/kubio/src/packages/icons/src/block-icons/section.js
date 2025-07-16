import { BlockIconWrapper } from './utils/block-icon-wrapper';
import { Path, Rect } from '@wordpress/primitives';

export default (
	<BlockIconWrapper x1="66.36" y1="66.36" x2="445.64" y2="445.64">
		{({ gradientClassName, backgroundClassName }) => (
			<>
				<Rect
					className={backgroundClassName}
					y="53.2"
					width="512"
					height="405.59"
					rx="64.19"
				/>
				<Path
					className={gradientClassName}
					d="M447.81,82.83H64.19a34.6,34.6,0,0,0-34.57,34.56V394.61a34.6,34.6,0,0,0,34.57,34.56H447.81a34.6,34.6,0,0,0,34.57-34.56V117.39A34.6,34.6,0,0,0,447.81,82.83Zm4.94,311.78a4.94,4.94,0,0,1-4.94,4.94H64.19a4.94,4.94,0,0,1-4.94-4.94V117.39a4.94,4.94,0,0,1,4.94-4.94H447.81a4.94,4.94,0,0,1,4.94,4.94Z"
				/>
				<Path
					className={gradientClassName}
					d="M378.82,148.61H133.18a32.13,32.13,0,0,0-32.09,32.09V331.3a32.13,32.13,0,0,0,32.09,32.09H378.82a32.13,32.13,0,0,0,32.09-32.09V180.7A32.13,32.13,0,0,0,378.82,148.61ZM196.13,338.7H133.18a7.42,7.42,0,0,1-7.41-7.4V180.7a7.42,7.42,0,0,1,7.41-7.4h62.95Zm95.05,0H220.82V173.3h70.36Zm95.05-7.4a7.42,7.42,0,0,1-7.41,7.4H315.87V173.3h62.95a7.42,7.42,0,0,1,7.41,7.4Z"
				/>
			</>
		)}
	</BlockIconWrapper>
);
