import { BlockIconWrapper } from './utils/block-icon-wrapper';
import { Path } from '@wordpress/primitives';

export default (
	<BlockIconWrapper x1={130.05} y1={15.61} x2={489.89} y2={375.45}>
		{({ gradientClassName, backgroundClassName }) => (
			<>
				<Path
					className={backgroundClassName}
					d="M447.35,0H163.19C84.64,0,20.73,63.91,20.73,142.46S84.64,284.92,163.19,284.92H226a43.69,43.69,0,0,0,23.6-6.9V468.08a43.92,43.92,0,0,0,85.43,14.35,43.91,43.91,0,0,0,85.42-14.35V87.83h26.88a43.92,43.92,0,1,0,0-87.83Z"
				/>
				<Path
					className={gradientClassName}
					d="M447.35,29.28H163.19a113.18,113.18,0,0,0,0,226.36H226a14.64,14.64,0,0,0,0-29.28H163.19a83.91,83.91,0,1,1,0-167.81H278.9V468.08a14.64,14.64,0,1,0,29.28,0V58.55h53.74V468.08a14.64,14.64,0,0,0,29.28,0V58.55h56.15a14.64,14.64,0,1,0,0-29.27Z"
				/>
			</>
		)}
	</BlockIconWrapper>
);
