import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { TextareaControl, PanelBody } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { STORE_KEY } from '@kubio/constants';

const withInspectorControlsColibriJson = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const { setAttributes, attributes } = props;
			const { kubio } = attributes;

			const isGutentagDebug = useSelect( ( select ) =>
				select( STORE_KEY )
					? select( STORE_KEY ).isGutentagDebug()
					: false
			);

			return (
				<Fragment>
					<BlockEdit { ...props } />
					<InspectorControls>
						{ isGutentagDebug && (
							<>
								<PanelBody
									title={ __( 'Kubio Debug', 'kubio' ) }
									initialOpen={ false }
								>
									<p>Style Ref: { kubio?.styleRef }</p>
									<TextareaControl
										label={ __( 'Style', 'kubio' ) }
										value={ JSON.stringify( kubio ) }
										onChange={ ( value, oldValue ) => {
											let newValue = null;
											try {
												newValue = JSON.parse( value );
											} catch ( e ) {}

											if ( newValue === null ) {
												setAttributes( {
													kubio: oldValue,
												} );
												return;
											}

											setAttributes( {
												kubio: newValue,
											} );
										} }
									/>
									<TextareaControl
										label={ __( 'Attributes', 'kubio' ) }
										value={ JSON.stringify( attributes ) }
									/>
								</PanelBody>
							</>
						) }
					</InspectorControls>
				</Fragment>
			);
		};
	},
	'withInspectorControl'
);

export default withInspectorControlsColibriJson;
