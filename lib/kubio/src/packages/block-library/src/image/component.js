import { LinkWrapper } from '@kubio/controls';
import {
	BackgroundOverlay,
	withColibriData,
	withStyledElements,
} from '@kubio/core';
import { useInheritedTextAlign } from '@kubio/global-data';
import { compose } from '@wordpress/compose';
import _ from 'lodash';
import { useMemo } from '@wordpress/element';
import { ElementsEnum } from './elements';

const Component = ({ StyledElements, computed }) => {
	const {
		caption,
		captionEnabled,
		link,
		showFrameImage,
		overlayEnabled,
		overlayBackground,
	} = computed;

	return (
		<StyledElements.Outer>
			<StyledElements.CaptionContainer>
				<LinkWrapper link={link}>
					<StyledElements.FrameContainer>
						{overlayEnabled && (
							<StyledElements.Overlay>
								<BackgroundOverlay value={overlayBackground} />
							</StyledElements.Overlay>
						)}
						<StyledElements.Image />
						{showFrameImage && <StyledElements.FrameImage />}
					</StyledElements.FrameContainer>
				</LinkWrapper>
				<StyledElements.Caption shouldRender={captionEnabled}>
					{caption}
				</StyledElements.Caption>
			</StyledElements.CaptionContainer>
		</StyledElements.Outer>
	);
};

const stylesMapper = ({ computed }) => {
	const { alt, sizeSlug, frameType } = computed;

	return {
		[ElementsEnum.OUTER]: {
			className: () => {
				return {
					[`size-${sizeSlug}`]: sizeSlug,
				};
			},
		},
		[ElementsEnum.IMAGE]: {
			src: computed?.url,
			alt,
		},
		[ElementsEnum.FRAME_IMAGE]: {
			className: () => {
				return {
					[`frame-type-${frameType}`]: frameType,
				};
			},
		},
	};
};

const attributes = [
	'url',
	'alt',
	'id',
	'caption',
	'captionEnabled',
	'sizeSlug',
	'link',
];

const useComputed = (dataHelper, ownProps) => {
	const defaultTextAlign = useInheritedTextAlign();

	return useMemo(() => {
		const data = dataHelper.getAttributes(attributes);
		const align = dataHelper.getAttribute('align', defaultTextAlign);
		const overlay = dataHelper.getStyle(
			'background.overlay',
			{},
			{
				styledComponent: 'overlay',
			}
		);
		const overlayEnabled = _.get(overlay, 'enabled');
		const frameEnabled = dataHelper.getPropInMedia('frame.enabled');
		const frameType = dataHelper.getPropInMedia('frame.type');

		return {
			...data,
			align,
			showFrameImage: frameEnabled,
			overlayEnabled,
			overlayBackground: overlay,
			frameType,
		};
	}, [dataHelper, defaultTextAlign]);
};
const ImageCompose = compose(
	withColibriData(useComputed),
	withStyledElements(stylesMapper)
);

const Image = ImageCompose(Component);
export { Component, useComputed, stylesMapper, Image };
