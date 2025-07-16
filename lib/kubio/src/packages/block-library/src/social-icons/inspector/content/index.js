import { __ } from '@wordpress/i18n';
import { ContentInspectorControls } from '@kubio/inspectors';
import { IconGroupProperties } from './icon-group-properties';

const Content = () => {
	return (
		<ContentInspectorControls>
			<IconGroupProperties
				panelLabel={__('Social Icons Properties', 'kubio')}
			/>
		</ContentInspectorControls>
	);
};

export { Content };
