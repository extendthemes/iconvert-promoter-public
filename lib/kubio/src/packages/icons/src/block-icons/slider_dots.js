import { BlockIconWrapper } from './utils/block-icon-wrapper';
import { Path, Circle } from '@wordpress/primitives';

export default (
	<BlockIconWrapper x1="0" y1="0" x2="512" y2="512">
		{({ gradientClassName, backgroundClassName }) => (
			<>
				<Path
					className={backgroundClassName}
					d="M458,0H54A54.05,54.05,0,0,0,0,54V458a54.05,54.05,0,0,0,54,54H458a54.05,54.05,0,0,0,54-54V54A54.05,54.05,0,0,0,458,0ZM425.19,425.19H86.81V86.81H425.19Z"
				/>
				<Path
					className={backgroundClassName}
					d="M162,310.1a54.13,54.13,0,0,0,47-27.39,54.05,54.05,0,0,0,94,0,54.1,54.1,0,1,0,0-53.42,54.05,54.05,0,0,0-94,0,54.09,54.09,0,1,0-47,80.81Z"
				/>
				<Path d="M458,484.48H54A26.51,26.51,0,0,1,27.52,458V54A26.51,26.51,0,0,1,54,27.52H458A26.51,26.51,0,0,1,484.48,54V458A26.51,26.51,0,0,1,458,484.48ZM59.28,452.72H452.72V59.28H59.28Z" />
				<Circle cx="256" cy="256" r="26.58" />
				<Circle cx="161.96" cy="256" r="26.58" />
				<Circle cx="350.04" cy="256" r="26.58" />
				<Path
					className={gradientClassName}
					d="M458,484.48H54A26.51,26.51,0,0,1,27.52,458V54A26.51,26.51,0,0,1,54,27.52H458A26.51,26.51,0,0,1,484.48,54V458A26.51,26.51,0,0,1,458,484.48ZM59.28,452.72H452.72V59.28H59.28Z"
				/>
				<Circle
					className={gradientClassName}
					cx="256"
					cy="256"
					r="26.58"
				/>
				<Circle
					className={gradientClassName}
					cx="161.96"
					cy="256"
					r="26.58"
				/>
				<Circle
					className={gradientClassName}
					cx="350.04"
					cy="256"
					r="26.58"
				/>
			</>
		)}
	</BlockIconWrapper>
);
