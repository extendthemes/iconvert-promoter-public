import { AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { CustomFormatsToolbar } from '@kubio/format-library';

import { __ } from '@wordpress/i18n';
import {
	alignCenter,
	alignJustify,
	alignLeft,
	alignRight,
	plusCircle,
} from '@wordpress/icons';

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

const TextToolbar = ({ computed }) => {
	const { textAlign } = computed;

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<CustomFormatsToolbar />
					<AlignmentToolbar
						value={textAlign.value}
						onChange={textAlign.onChange}
						alignmentControls={alignmentControls}
					/>
				</ToolbarGroup>
			</BlockControls>
		</>
	);
};

export { TextToolbar };
