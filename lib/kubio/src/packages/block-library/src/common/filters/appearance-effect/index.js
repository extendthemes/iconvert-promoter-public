import { AppearanceControl } from '@kubio/controls';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	__experimentalStyleProvider as StyleProvider,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { useKubioBlockContext } from '@kubio/core';
import { hasBlockSupport } from '@wordpress/blocks';
import './add-attribute';

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom class name, if block supports custom class name.
 *
 * @param {WPComponent} BlockEdit Original component.
 *
 * @return {WPComponent} Wrapped component.
 */
export const withInspectorControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { dataHelper } = useKubioBlockContext();

		const hasAppearanceEffectSupport = hasBlockSupport(
			props.name,
			'kubio.appearanceEffect',
			false
		);

		if (hasAppearanceEffectSupport && props.isSelected) {
			return (
				<>
					<BlockEdit {...props} />
					<StyleProvider document={document}>
						<InspectorControls className={'kubio-inspector'}>
							<PanelBody
								title={__('Entrance animation', 'kubio')}
								initialOpen={false}
							>
								<AppearanceControl dataHelper={dataHelper} />
							</PanelBody>
						</InspectorControls>
					</StyleProvider>
				</>
			);
		}

		return <BlockEdit {...props} />;
	};
}, 'withInspectorControl');

function addAppearanceEffectFilter() {
	const shouldAddAppearanceEffectFilter = applyFilters(
		'kubio.block-library.addAppearanceEffectFilter',
		true
	);

	if (!shouldAddAppearanceEffectFilter) {
		return;
	}
	addFilter(
		'editor.BlockEdit',
		'kubio/controls/appearance-effect',
		withInspectorControl
	);
}

export { addAppearanceEffectFilter };
