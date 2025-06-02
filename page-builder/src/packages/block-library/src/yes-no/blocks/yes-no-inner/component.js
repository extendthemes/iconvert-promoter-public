import { useKubioInnerBlockProps } from '@kubio/block-library';
import {
	withColibriDataAutoSave,
	withDynamicStyles,
	withStyledElements,
} from '@kubio/core';
import { compose } from '@wordpress/compose';
import { ElementsEnum } from './elements';
import { dynamicStylesTransforms } from '@kubio/style-manager';
import { useToolbarState } from '../../toolbar';

const Component = ( props ) => {
	const { StyledElements, computed = {}, dataHelper } = props;

	const innerBlocksProps = useKubioInnerBlockProps(
		{},
		{
			templateLock: false,
		}
	);

	const { toolbarComponent } = useToolbarState( dataHelper.withParent() );

	return (
		<>
			{ toolbarComponent }
			<StyledElements.Container
				data-action-content={ computed.action }
				{ ...innerBlocksProps }
			></StyledElements.Container>
		</>
	);
};

const compute = ( dataHelper ) => {
	return {
		action: dataHelper.getAttribute( 'action' ),
	};
};

const dynamicStyling = ( dataHelper ) => {
	const spaceByMedia = dataHelper.getPropByMedia( 'vSpace', {} );

	return {
		[ ElementsEnum.VSPACE ]: dynamicStylesTransforms.vSpace( spaceByMedia ),
	};
};

export default compose(
	withColibriDataAutoSave( compute ),
	withDynamicStyles( dynamicStyling ),
	withStyledElements()
)( Component );
