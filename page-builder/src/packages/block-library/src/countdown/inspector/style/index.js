import { StyleInspectorControls } from '@kubio/inspectors';
import Countdown from './countdown';
import CountdownItems from './countdown-items';
import CountdownSeparator from './countdown-separator';

const Style = () => {
	return (
		<StyleInspectorControls>
			<Countdown />
			<CountdownItems />
			<CountdownSeparator />
		</StyleInspectorControls>
	);
};

export { Style };
