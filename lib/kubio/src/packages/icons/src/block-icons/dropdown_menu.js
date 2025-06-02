import { Path } from '@wordpress/primitives';
import { BlockIconWrapper } from './utils/block-icon-wrapper';

export default (
	<BlockIconWrapper x1="92" y1="9.47" x2="499.65" y2="417.12">
		{({ gradientClassName, backgroundClassName }) => (
			<>
				<Path
					className={backgroundClassName}
					d="M512,127.74V85.12a47.58,47.58,0,0,0-47.53-47.53H47.53A47.58,47.58,0,0,0,0,85.12v42.62a47.58,47.58,0,0,0,47.53,47.53H159.31V417.08a57.4,57.4,0,0,0,57.33,57.33h238A57.4,57.4,0,0,0,512,417.08V209.19a57.18,57.18,0,0,0-19.55-43.06A47.51,47.51,0,0,0,512,127.74Z"
				/>
				<Path
					className={gradientClassName}
					d="M464.47,63.07H47.53a22.07,22.07,0,0,0-22,22.05v42.62a22.07,22.07,0,0,0,22.05,22H464.47a22.07,22.07,0,0,0,22-22V85.12A22.07,22.07,0,0,0,464.47,63.07ZM50,87.57H171v37.72H50Zm266.53,37.72h-121V87.57h121Zm145.51,0H341V87.57H462Z"
				/>
				<Path
					className={gradientClassName}
					d="M454.68,177.34H184.79V417.08a31.89,31.89,0,0,0,31.85,31.85h238a31.88,31.88,0,0,0,31.84-31.85V209.19A31.88,31.88,0,0,0,454.68,177.34ZM462,417.08a7.35,7.35,0,0,1-7.34,7.35h-238a7.36,7.36,0,0,1-7.35-7.35V201.84H454.68a7.35,7.35,0,0,1,7.34,7.35Z"
				/>
				<Path
					className={gradientClassName}
					d="M241.66,252.24H409.37a12.25,12.25,0,0,0,0-24.5H241.66a12.25,12.25,0,1,0,0,24.5Z"
				/>
				<Path
					className={gradientClassName}
					d="M241.66,300.35H397.54a12.25,12.25,0,1,0,0-24.5H241.66a12.25,12.25,0,1,0,0,24.5Z"
				/>
				<Path
					className={gradientClassName}
					d="M429.65,324h-188a12.25,12.25,0,0,0,0,24.5h188a12.25,12.25,0,0,0,0-24.5Z"
				/>
				<Path
					className={gradientClassName}
					d="M381.16,372.08H241.66a12.25,12.25,0,1,0,0,24.49h139.5a12.25,12.25,0,1,0,0-24.49Z"
				/>
			</>
		)}
	</BlockIconWrapper>
);
