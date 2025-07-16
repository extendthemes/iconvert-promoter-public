import {
	BackgroundControlWithPath,
	BordersAndRadiusWithPath,
	BoxUnitValueControlWithPath,
	ColorWithPath,
	KubioPanelBody,
	SeparatorHorizontalLine,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { StyleInspectorControls } from '@kubio/inspectors';
import { __ } from '@wordpress/i18n';
import { ElementsEnum } from '../../elements';

const Component_ = () => {
	const outerOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.OUTER,
	};

	const innerOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.INNER,
	};

	return (
		<>
			<KubioPanelBody
				title={ __( 'Container', 'iconvert-promoter' ) }
				initialOpen={ true }
			>
				<BackgroundControlWithPath
					type={ WithDataPathTypes.STYLE }
					path={ 'background' }
					filters={ {
						showOverlayOptions: false,
					} }
					{ ...innerOptions }
				/>
				<SeparatorHorizontalLine />
				<BoxUnitValueControlWithPath
					label={ __( 'Padding', 'iconvert-promoter' ) }
					path={ 'padding' }
					capMin={ true }
					min={ 0 }
					{ ...innerOptions }
				/>
				<BordersAndRadiusWithPath
					path={ 'border' }
					{ ...innerOptions }
				/>
			</KubioPanelBody>
			<KubioPanelBody title={ 'Colors' } initialOpen={ false }>
				<ColorWithPath
					label={ __( 'Track color', 'iconvert-promoter' ) }
					path={ '--scrollbar-track' }
					{ ...outerOptions }
				/>
				<ColorWithPath
					label={ __( 'Handle color', 'iconvert-promoter' ) }
					path={ '--scrollbar-handle' }
					{ ...outerOptions }
				/>
				<ColorWithPath
					label={ __( 'Hovered handle color', 'iconvert-promoter' ) }
					path={ '--scrollbar-handle-hover' }
					{ ...outerOptions }
				/>
			</KubioPanelBody>
		</>
	);
};

const ComposedComponent = withComputedData()( Component_ );

const Component = () => {
	return (
		<StyleInspectorControls>
			<ComposedComponent />
		</StyleInspectorControls>
	);
};

export default Component;
