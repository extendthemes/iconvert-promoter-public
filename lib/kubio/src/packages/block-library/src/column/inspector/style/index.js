import { __ } from '@wordpress/i18n';
import { StyleInspectorControls } from '@kubio/inspectors';
import {
	BackgroundSection,
	BoxShadowWithPath,
	KubioPanelBody,
	SeparatorHorizontalLine,
	BordersAndRadiusWithPath,
} from '@kubio/controls';
import { elementsByName, ColumnElementsEnum } from '../../elements';
import _ from 'lodash';

import { WithDataPathTypes } from '@kubio/core';

const Style = () => {
	const styledElement = _.get(elementsByName, ColumnElementsEnum.INNER);

	return (
		<StyleInspectorControls>
			<BackgroundSection styledElement={styledElement} />

			<KubioPanelBody
				title={__('Border & Shadow', 'kubio')}
				initialOpen={false}
			>
				<BordersAndRadiusWithPath
					type={WithDataPathTypes.STYLE}
					path={'border'}
				/>

				<SeparatorHorizontalLine />

				<BoxShadowWithPath
					label={__('Box shadow', 'kubio')}
					path={'boxShadow'}
					type={WithDataPathTypes.STYLE}
					style={ColumnElementsEnum.INNER}
				/>
			</KubioPanelBody>
		</StyleInspectorControls>
	);
};

export { Style };
