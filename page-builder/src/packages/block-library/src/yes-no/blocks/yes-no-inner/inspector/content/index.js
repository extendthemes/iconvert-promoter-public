import { __ } from '@wordpress/i18n';

import {
	KubioPanelBody,
	RangeWithUnitWithPath,
	HorizontalTextAlignControlWithPath,
} from '@kubio/controls';
import { WithDataPathTypes, withColibriDataAutoSave } from '@kubio/core';

import { ContentInspectorControls } from '@kubio/inspectors';

import { useGlobalDataStyle } from '@kubio/global-data';
import { ElementsEnum } from '../../elements';

const Panel = ( props ) => {
	const { globalStyle } = useGlobalDataStyle();
	const vSpacingDefault = globalStyle.getPropInMedia( 'vSpace' );

	return (
		<>
			<KubioPanelBody>
				<RangeWithUnitWithPath
					label={ __(
						'Content elements vertical spacing',
						'iconvert-promoter'
					) }
					type={ WithDataPathTypes.PROP }
					defaultValue={ vSpacingDefault }
					path="vSpace"
					media="auto"
				/>
				<HorizontalTextAlignControlWithPath
					path="textAlign"
					type="style"
					style={ ElementsEnum.CONTAINER }
					label={ __( 'Horizontal align', 'iconvert-promoter' ) }
				/>
			</KubioPanelBody>
		</>
	);
};

const ContentComponent = withColibriDataAutoSave()( Panel );

export const ContentInspector = ( props ) => {
	return (
		<ContentInspectorControls>
			<ContentComponent { ...props } />
		</ContentInspectorControls>
	);
};
