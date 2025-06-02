import {
	Popover,
	ToggleControl,
	Button,
	BaseControl,
} from '@wordpress/components';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { RangeWithUnitWithPath } from '../style-controls/wrappers/range-with-unit-wrapper';

const useCustomSize = ({ computed, dataHelper, ...rest }) => {
	const {
		useCustomDimensions,
		onChangeUseCustomSize,
		styledComponent,
	} = computed;
	const [isVisible, toggleVisibility] = useState(false);
	const advancedButtonRef = useRef(null);
	return (
		<>
			<ToggleControl
				label={__('Custom size', 'kubio')}
				checked={useCustomDimensions}
				onChange={onChangeUseCustomSize}
			/>
			<BaseControl>
				<Button
					disabled={!useCustomDimensions}
					ref={advancedButtonRef}
					isPrimary
					onClick={() => toggleVisibility(!isVisible)}
				>
					Advanced
				</Button>
			</BaseControl>
			{isVisible && (
				<Popover
					anchorRef={advancedButtonRef.current}
					onFocusOutside={() => toggleVisibility(false)}
					className={'kubio-popover'}
				>
					<RangeWithUnitWithPath
						label={'Width'}
						max={1000}
						style={styledComponent}
						type="style"
						path="width"
					/>

					<RangeWithUnitWithPath
						label={'Height'}
						max={1000}
						type="style"
						style={styledComponent}
						path="height"
					/>
				</Popover>
			)}
		</>
	);
};

export { useCustomSize };
