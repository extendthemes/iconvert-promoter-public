import { Fill, ToolbarButton } from '@wordpress/components';

const KubioRichTextToolbarButton = ({ name, children, ...otherProps }) => {
	let slotName = 'RichText.ToolbarControls';

	if (name) {
		slotName += `.${name}`;
	}

	return <Fill name={slotName}>{children}</Fill>;
};

export { KubioRichTextToolbarButton };
