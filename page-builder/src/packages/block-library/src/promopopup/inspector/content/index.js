import { ContentInspectorControls } from '@kubio/inspectors';
import Properties from './properties';

import { CodeMirrorControl } from '@kubio/controls';
import { PanelBody } from '@wordpress/components';
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDebounce } from '@wordpress/compose';

const AdditionalCSS = ( { attributes, setAttributes } ) => {
	const [ css, setCss ] = useState( attributes.additionalCSS || '' );

	const setAdditionalCSSDebounced = useDebounce(
		useCallback( ( nextValue ) => {
			setAttributes( {
				additionalCSS: nextValue,
			} );
		}, [] ),
		300
	);

	const onChange = ( nextValue ) => {
		setCss( nextValue );
		setAdditionalCSSDebounced( nextValue );
	};

	return (
		<PanelBody
			initialOpen={ false }
			title={ __( 'Additional CSS', 'iconvert-promoter' ) }
		>
			<CodeMirrorControl
				value={ css }
				onChange={ onChange }
				mode={ 'css' }
			/>
		</PanelBody>
	);
};

const Content = ( props ) => {
	return (
		<ContentInspectorControls>
			<Properties />
			<AdditionalCSS { ...props } />
		</ContentInspectorControls>
	);
};

export { Content };
