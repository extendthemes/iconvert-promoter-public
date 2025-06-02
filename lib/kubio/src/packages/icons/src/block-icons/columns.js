import { Path, Rect } from '@wordpress/primitives';
import { BlockIconWrapper } from './utils/block-icon-wrapper';

export default (
	<BlockIconWrapper x1="75.62" y1="75.62" x2="436.38" y2="436.38">
		{({ gradientClassName, backgroundClassName }) => (
			<>
				<Rect
					className={backgroundClassName}
					y="70.24"
					width="512"
					height="371.51"
					rx="65.38"
				/>
				<Path
					className={gradientClassName}
					d="M446.62,100.42H65.38a35.24,35.24,0,0,0-35.2,35.21V376.37a35.25,35.25,0,0,0,35.2,35.21H446.62a35.25,35.25,0,0,0,35.2-35.21V135.63A35.24,35.24,0,0,0,446.62,100.42Zm-276,281H65.38a5,5,0,0,1-5-5V135.63a5,5,0,0,1,5-5H170.67Zm140.49,0H200.84V130.6H311.16Zm140.49-5a5,5,0,0,1-5,5H341.33V130.6H446.62a5,5,0,0,1,5,5Z"
				/>
			</>
		)}
	</BlockIconWrapper>
);
