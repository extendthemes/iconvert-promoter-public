/**
 * WordPress dependencies
 */
import { hasBlockSupport } from '@wordpress/blocks';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockStyles from '../block-styles';
import DefaultStylePicker from '../default-style-picker';
import InspectorControls from '../inspector-controls';
import { useBorderPanelLabel } from '../../hooks/border';

const StylesTab = ( { blockName, clientId, hasBlockStyles } ) => {
	const borderPanelLabel = useBorderPanelLabel( { blockName } );

	return (
		<>
			{ hasBlockStyles && (
				<div>
					<PanelBody title={ __( 'Styles', 'kubio' ) }>
						<BlockStyles clientId={ clientId } />
						{ hasBlockSupport(
							blockName,
							'defaultStylePicker',
							true
						) && <DefaultStylePicker blockName={ blockName } /> }
					</PanelBody>
				</div>
			) }
			<InspectorControls.Slot
				group="color"
				label={ __( 'Color', 'kubio' ) }
				className="color-block-support-panel__inner-wrapper"
			/>
			<InspectorControls.Slot
				group="background"
				label={ __( 'Background', 'kubio' ) }
			/>
			<InspectorControls.Slot group="filter" />
			<InspectorControls.Slot
				group="typography"
				label={ __( 'Typography', 'kubio' ) }
			/>
			<InspectorControls.Slot
				group="dimensions"
				label={ __( 'Dimensions', 'kubio' ) }
			/>
			<InspectorControls.Slot group="border" label={ borderPanelLabel } />
			<InspectorControls.Slot group="styles" />
		</>
	);
};

export default StylesTab;
