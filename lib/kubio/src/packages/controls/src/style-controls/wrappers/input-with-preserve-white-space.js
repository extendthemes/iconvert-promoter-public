import { BaseControl, Flex, FlexBlock, FlexItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InputControlWithPath } from './input-wrapper';
import { ToggleControlWithPath } from './toggle-wrapper/toggle-wrapper';
import PopoverOptionsButton from '../../components/popover-options-button';

const InputWithPreserveWhiteSpaceWithPath = ({
	label,
	path,
	type,
	whiteSpacePath,
	whiteSpaceType,
	whiteSpaceLabel = __('Preserve whitespace', 'kubio'),
	...props
}) => {
	return (
		<BaseControl>
			<Flex align="flex-end">
				<FlexBlock>
					<InputControlWithPath
						label={label}
						path={path}
						type={type}
						{...props}
					/>
				</FlexBlock>
				<FlexItem>
					<PopoverOptionsButton
						popupContent={
							<>
								<ToggleControlWithPath
									label={whiteSpaceLabel}
									type={whiteSpaceType}
									path={whiteSpacePath}
								/>
							</>
						}
					/>
				</FlexItem>
			</Flex>
		</BaseControl>
	);
};

export { InputWithPreserveWhiteSpaceWithPath };
