import { AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import { CustomFormatsToolbar } from '@kubio/format-library';
import { __ } from '@wordpress/i18n';
import {
	alignCenter,
	alignLeft,
	alignRight,
	alignJustify,
} from '@wordpress/icons';
import HeadingLevelDropdown from './toolbar/heading-level-dropdown';

const alignmentControls = [
	{
		icon: alignLeft,
		title: __('Align text left', 'kubio'),
		align: 'left',
	},
	{
		icon: alignCenter,
		title: __('Align text center', 'kubio'),
		align: 'center',
	},
	{
		icon: alignRight,
		title: __('Align text right', 'kubio'),
		align: 'right',
	},
	{
		icon: alignJustify,
		title: __('Justify text', 'kubio'),
		align: 'justify',
	},
];

const HeadingToolbar = ({ computed }) => {
	const { headerType, textAlign } = computed;

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<HeadingLevelDropdown
						selectedLevel={headerType.value}
						onChange={headerType.onChange}
					/>
					<AlignmentToolbar
						value={textAlign.value}
						onChange={textAlign.onChange}
						alignmentControls={alignmentControls}
					/>
				</ToolbarGroup>
				<CustomFormatsToolbar addWrapper={false} />
			</BlockControls>
		</>
	);
};

export { HeadingToolbar };
