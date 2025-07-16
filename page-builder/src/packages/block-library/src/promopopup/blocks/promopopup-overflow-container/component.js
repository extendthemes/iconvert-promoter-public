import { withColibriData, withStyledElements } from '@kubio/core';
import { compose } from '@wordpress/compose';
// import { FlexAlign } from '@kubio/style-manager';
import { useKubioInnerBlockProps } from '@kubio/block-library';

// import { Disabled } from '@wordpress/components';
import { useRef } from '@wordpress/element';
import { ElementsEnum } from './elements';

const Component_ = ( props ) => {
	// const NamesOfBlocks = getNamesOfBlocks();
	const { StyledElements, dataHelper } = props;
	const ref = useRef();

	const innerBlocksProps = useKubioInnerBlockProps(
		{},
		{
			templateLock: false,
			orientation: 'vertical',
			renderAppender: true,
		}
	);

	const width = dataHelper.getStyle( '--scrollbar-width.value', 10, {
		styledComponent: ElementsEnum.OUTER,
	} );

	const computedStyle = {
		'--moz-scrollbar-width': width <= 10 ? 'thin' : 'auto',
	};

	return (
		<StyledElements.Outer style={ computedStyle } ref={ ref }>
			<StyledElements.Inner { ...innerBlocksProps } />
		</StyledElements.Outer>
	);
};

const ComponentCompose = compose( withColibriData(), withStyledElements() );

const Component = ComponentCompose( Component_ );

export { Component };
