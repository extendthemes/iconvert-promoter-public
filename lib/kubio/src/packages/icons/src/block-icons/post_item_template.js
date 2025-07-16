import { BlockIconWrapper } from './utils/block-icon-wrapper';
import { Path, Defs, Stop, LinearGradient } from '@wordpress/primitives';

export default (
	<BlockIconWrapper>
		{({ gradientClassName, backgroundClassName }) => (
			<>
				<Defs>
					<LinearGradient
						x1="105.64"
						y1="102.14"
						x2="387.55"
						y2="384.05"
						gradientUnits="userSpaceOnUse"
					>
						<Stop
							offset="0"
							stopColor="var(--gutentag-block-icon-color-primary)"
						/>
						<Stop
							offset="1"
							stopColor="var(--gutentag-block-icon-color-secondary)"
						/>
					</LinearGradient>
				</Defs>
				<Path
					className={backgroundClassName}
					d="M483.87,219.93A41,41,0,0,0,471,140H262a41,41,0,0,0-33.13,16.88,62.47,62.47,0,0,0-48.09-22.58H62.61A62.69,62.69,0,0,0,0,196.93V315.07a62.69,62.69,0,0,0,62.61,62.62H180.76a62.48,62.48,0,0,0,46-20.14A41,41,0,0,0,262,377.69H413.71a41,41,0,0,0,18-77.84H471a41,41,0,0,0,12.87-79.92Z"
				/>
				<Path d="M471,196H262a15,15,0,0,1,0-30H471a15,15,0,0,1,0,30Z" />
				<Path d="M471,273.85H262a15,15,0,0,1,0-30H471a15,15,0,0,1,0,30Z" />
				<Path d="M413.71,351.69H262a15,15,0,0,1,0-30H413.71a15,15,0,0,1,0,30Z" />
				<Path d="M180.76,351.69H62.61A36.66,36.66,0,0,1,26,315.07V196.93a36.66,36.66,0,0,1,36.61-36.62H180.76a36.66,36.66,0,0,1,36.61,36.62V315.07A36.66,36.66,0,0,1,180.76,351.69ZM62.61,190.31A6.63,6.63,0,0,0,56,196.93V315.07a6.63,6.63,0,0,0,6.61,6.62H180.76a6.62,6.62,0,0,0,6.61-6.62V196.93a6.62,6.62,0,0,0-6.61-6.62Z" />
				<Path
					className={gradientClassName}
					d="M471,196H262a15,15,0,0,1,0-30H471a15,15,0,0,1,0,30Z"
				/>
				<Path
					className={gradientClassName}
					d="M471,273.85H262a15,15,0,0,1,0-30H471a15,15,0,0,1,0,30Z"
				/>
				<Path
					className={gradientClassName}
					d="M413.71,351.69H262a15,15,0,0,1,0-30H413.71a15,15,0,0,1,0,30Z"
				/>
				<Path
					className={gradientClassName}
					d="M180.76,351.69H62.61A36.66,36.66,0,0,1,26,315.07V196.93a36.66,36.66,0,0,1,36.61-36.62H180.76a36.66,36.66,0,0,1,36.61,36.62V315.07A36.66,36.66,0,0,1,180.76,351.69ZM62.61,190.31A6.63,6.63,0,0,0,56,196.93V315.07a6.63,6.63,0,0,0,6.61,6.62H180.76a6.62,6.62,0,0,0,6.61-6.62V196.93a6.62,6.62,0,0,0-6.61-6.62Z"
				/>
			</>
		)}
	</BlockIconWrapper>
);
