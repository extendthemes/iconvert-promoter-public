import { LinkGroupProperties } from './group-propeties';
import { __ } from '@wordpress/i18n';
import { ContentInspectorControls } from '@kubio/inspectors';

const Content = () => {
	return (
		<ContentInspectorControls>
			<LinkGroupProperties
				panelLabel={__('Link Group', 'kubio')}
				groupListLabel={__('Link list', 'kubio')}
			/>
		</ContentInspectorControls>
	);
};

export { Content };
