import { BlockControls } from '@wordpress/block-editor';
import { FormatToolbar } from './toolbar-slots';

const CustomFormatsToolbar = ( props ) => {
	const { addWrapper = true } = props;

	if ( true === addWrapper ) {
		return (
			<BlockControls>
				<FormatToolbar />
			</BlockControls>
		);
	}

	return <FormatToolbar />;
};

export { CustomFormatsToolbar };
