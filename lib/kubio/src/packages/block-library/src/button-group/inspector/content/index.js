import { LinkGroupProperties } from '../../../link-group/inspector/content/group-propeties';
import { __ } from '@wordpress/i18n';
import { ContentInspectorControls } from '@kubio/inspectors';

const Content = () => {
	return (
		<ContentInspectorControls>
			<LinkGroupProperties
				panelLabel={__('Button Group', 'kubio')}
				addButtonText={__('Add button', 'kubio')}
				alignLabel={__('Button group align', 'kubio')}
				spaceBetweenLabel={__('Space between buttons', 'kubio')}
			/>
		</ContentInspectorControls>
	);
};

export { Content };
