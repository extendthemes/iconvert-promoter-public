import { getNamesOfBlocks } from '@kubio/block-library';
import { withColibriData, withStyledElements } from '@kubio/core';
import { FlexAlign } from '@kubio/style-manager';
import { compose } from '@wordpress/compose';
import { ElementsEnum } from './elements';

import { useInnerBlocksProps } from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';
import _ from 'lodash';

const Component = ( props ) => {
	const NamesOfBlocks = getNamesOfBlocks();
	const ALLOWED_BLOCKS = [ NamesOfBlocks.ICON ];
	const { StyledElements } = props;

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			template: [
				[
					'cspromo/icon',
					{
						name: 'font-awesome/remove',
						kubio: {
							style: {
								descendants: {
									inner: {
										width: { value: '34', unit: 'px' },
										height: { value: '34', unit: 'px' },
									},
								},
							},
						},
					},
				],
			],
			templateLock: true,
			allowedBlocks: ALLOWED_BLOCKS,
			orientation: 'horizontal',
			renderAppender: false,
		}
	);

	return (
		<>
			<StyledElements.Outer shouldRender={ true }>
				<StyledElements.Inner>
					<Disabled>
						<div { ...innerBlocksProps } />
					</Disabled>
				</StyledElements.Inner>
			</StyledElements.Outer>
		</>
	);
};

const stylesMapper = ( { computed } = {} ) => {
	return {
		[ ElementsEnum.OUTER ]: {
			className: () => {
				const { verticalAlignByMedia, horizontalAlignByMedia } =
					computed;

				const verticalAlignClasses = FlexAlign.getVAlignClasses(
					verticalAlignByMedia,
					{ self: false }
				);

				const horizontalAlignClasses = FlexAlign.getHAlignClasses(
					horizontalAlignByMedia,
					{ self: false }
				);

				return _.concat( verticalAlignClasses, horizontalAlignClasses );
			},
			'data-skip-inbetween': 'skip',
		},
		[ ElementsEnum.INNER ]: {},
	};
};

const useComputed = ( dataHelper ) => {
	return {
		direction: dataHelper.getAttribute( 'direction' ),
		horizontalAlignByMedia: dataHelper.getPropByMedia( 'horizontalAlign' ),
		verticalAlignByMedia: dataHelper.getPropByMedia( 'verticalAlign' ),
	};
};

const CloseButtonCompose = compose(
	withColibriData( useComputed ),
	withStyledElements( stylesMapper )
);

const CloseButton = CloseButtonCompose( Component );

export { Component, useComputed, stylesMapper, CloseButton };
