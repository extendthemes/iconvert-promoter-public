import { ContentInspectorControls } from '@kubio/inspectors';
import { ControlNotice } from '@kubio/controls';
import { __ } from '@wordpress/i18n';

const Content = () => {
	return (
		<ContentInspectorControls>
			<div className="kubio-editing-header">
				<ControlNotice
					content={__(
						'Current block does not have content options',
						'kubio'
					)}
				/>
			</div>
		</ContentInspectorControls>
	);
};

export { Content };
