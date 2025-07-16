import { Path } from '@wordpress/primitives';
import { BlockIconWrapper } from './utils/block-icon-wrapper';

export default (
	<BlockIconWrapper x1="96.28" y1="96.28" x2="415.72" y2="415.72">
		{({ gradientClassName, backgroundClassName }) => (
			<>
				<Path
					className={backgroundClassName}
					d="M437,75A256,256,0,0,0,75,437,256,256,0,0,0,437,75Z"
				/>
				<Path
					className={gradientClassName}
					d="M256,30.12A225.88,225.88,0,0,0,96.28,415.72,225.88,225.88,0,1,0,415.72,96.28,224.42,224.42,0,0,0,256,30.12Zm0,421.64C148.06,451.76,60.24,363.94,60.24,256S148.06,60.24,256,60.24,451.76,148.06,451.76,256,363.94,451.76,256,451.76Z"
				/>
				<Path
					className={gradientClassName}
					d="M252.86,171.08a84.16,84.16,0,0,1,50.3,16.52A15.07,15.07,0,0,0,321,163.34a115,115,0,1,0,0,185.32,15.07,15.07,0,0,0-17.87-24.26,84.16,84.16,0,0,1-50.3,16.52,84.92,84.92,0,0,1,0-169.84Z"
				/>
			</>
		)}
	</BlockIconWrapper>
);
