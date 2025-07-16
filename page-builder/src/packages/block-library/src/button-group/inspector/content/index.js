import { __ } from '@wordpress/i18n';
import { ContentInspectorControls } from '@kubio/inspectors';
import { getBlocksMap } from '@kubio/block-library';

const BlocksMap = getBlocksMap();
const buttonGroup = BlocksMap?.buttonGroup;
const { LinkGroupProperties } = buttonGroup?.Components?.ComponentParts || {};

const Content = () => {
	return (
		<ContentInspectorControls>
			<LinkGroupProperties
				panelLabel={ __( 'Button Group', 'iconvert-promoter' ) }
				addButtonText={ __( 'Add button', 'iconvert-promoter' ) }
				alignLabel={ __( 'Button group align', 'iconvert-promoter' ) }
				spaceBetweenLabel={ __(
					'Space between buttons',
					'iconvert-promoter'
				) }
			/>
		</ContentInspectorControls>
	);
};

export { Content };
