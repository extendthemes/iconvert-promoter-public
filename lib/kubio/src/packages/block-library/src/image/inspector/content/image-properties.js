import { BaseControl, Flex, FlexItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	TextareaControlWithPath,
	ToggleControlWithPath,
	LinkControlWithData,
	MediaPicker,
	PopoverOptionsButton,
	HorizontalTextAlign,
	GutentagSelectControl,
	ToggleControl,
	RangeWithUnitControl,
	InputControl,
	KubioPanelBody,
} from '@kubio/controls';

import { filter, get, map, pick, escape, unescape } from 'lodash';
import { useSelect } from '@wordpress/data';
import { useImageSize, withComputedData, WithDataPathTypes } from '@kubio/core';
import { ElementsEnum } from '../../elements';
import { UNSET_VALUE } from '@kubio/constants';
import { DEFAULT_SIZE_SLUG } from '../../edit/constants';
import { useInheritedTextAlign } from '@kubio/global-data';

const Panel = ({ computed, ...rest }) => {
	const {
		captionProperties,
		url,
		captionEnabled,
		onImageChange,
		imageSizeOptions,
		align,
		sizeSlug,
		maxWidth,
		maxHeight,
	} = computed;

	const { clientData } = rest;

	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.IMAGE,
	};

	/**
	  h-dummy-focus-control is added because when you open the popoverOptionsButton the first control is focused.
	  When a slider is focused the tooltip is show, and the tooltip was over the label we added a dummy control to take focus
	 */
	return (
		<KubioPanelBody title={__('Image Properties', 'kubio')}>
			<MediaPicker
				label={__('Image', 'kubio')}
				value={url}
				onChange={onImageChange}
				showButton
				buttonLabel={__('Change image', 'kubio')}
				mediaId={clientData.attributes.id}
			/>
			<HorizontalTextAlign
				label={__('Horizontal align', 'kubio')}
				{...align}
			/>
			<ToggleControlWithPath
				label={__('Show caption', 'kubio')}
				type={WithDataPathTypes.ATTRIBUTE}
				path="captionEnabled"
			/>
			{captionEnabled && (
				<InputControl
					label={__('Caption', 'kubio')}
					{...captionProperties}
				/>
			)}
			<TextareaControlWithPath
				path={'alt'}
				type={WithDataPathTypes.ATTRIBUTE}
				label={__('Alt text', 'kubio')}
			/>
			<Flex justify="space-between" expanded={true}>
				<FlexItem className={'image-size-row-dropdown'}>
					<GutentagSelectControl
						label={__('Image size', 'kubio')}
						{...sizeSlug}
						options={imageSizeOptions}
					/>
				</FlexItem>
				<FlexItem className={'image-size-row-cog'}>
					<PopoverOptionsButton
						label={''}
						popoverWidth={250}
						popupContent={
							<>
								<div className="h-dummy-focus-control">
									<BaseControl>
										<ToggleControl />
										<BaseControl />
									</BaseControl>
								</div>
								<RangeWithUnitControl
									label={__('Max width', 'kubio')}
									max={500}
									capMin={true}
									units={['px']}
									{...maxWidth}
								/>
								<RangeWithUnitControl
									label={__('Max height', 'kubio')}
									path={'maxWidth'}
									max={500}
									capMin={true}
									units={['px']}
									{...maxHeight}
								/>
							</>
						}
					/>
				</FlexItem>
			</Flex>
			<LinkControlWithData />
		</KubioPanelBody>
	);
};
const useComputed = (dataHelper) => {
	const defaultTextAlign = useInheritedTextAlign();
	const onImageChange = (image) => {
		const { url, caption, id } = image;

		// set multiple attributes once to reduce the undos created
		dataHelper.setAttributes({
			url,
			caption,
			id,
			sizeSlug: DEFAULT_SIZE_SLUG,
		});
	};
	const id = dataHelper.getAttribute('id');

	let imageSizeOptions = useImageSize(id);
	if (imageSizeOptions.length < 1) {
		imageSizeOptions = [{ value: 'full', label: __('Full Size', 'kubio') }];
	}

	const image = useSelect(
		(select) => {
			const { getMedia } = select('core');
			return id ? getMedia(id) : null;
		},
		[id]
	);

	const onAlignChange = (event, options = {}) => {
		dataHelper.setAttribute('align', event, options);
		dataHelper.setStyle('textAlign', event, {
			styledComponent: ElementsEnum.OUTER,
			...options,
		});
	};

	const align = {
		value: dataHelper.getAttribute('align', defaultTextAlign),
		onChange: onAlignChange,
		onReset: () => onAlignChange('', { unset: true }),
	};

	const onSlugChange = (newSize) => {
		const getUrlForSlug = (image, sizeSlug) => {
			return get(image, [
				'media_details',
				'sizes',
				sizeSlug,
				'source_url',
			]);
		};
		const url = getUrlForSlug(image, newSize);
		if (!url) {
			return null;
		}

		dataHelper.setAttributes({
			url,
			sizeSlug: newSize,
		});
	};
	const sizeSlug = {
		value: dataHelper.getAttribute('sizeSlug'),
		onChange: onSlugChange,
	};

	const useMaxProperty = (property) => {
		return {
			value: dataHelper.getStyle(property, null, {
				styledComponent: ElementsEnum.IMAGE,
			}),
			onReset: () => {
				dataHelper.setStyle(property, UNSET_VALUE, {
					styledComponent: ElementsEnum.IMAGE,
				});
				dataHelper.setStyle(property, UNSET_VALUE, {
					styledComponent: ElementsEnum.FRAME_CONTAINER,
				});
			},
			onChange: (newValue) => {
				dataHelper.setStyle(property, newValue, {
					styledComponent: ElementsEnum.IMAGE,
				});
				dataHelper.setStyle(property, newValue, {
					styledComponent: ElementsEnum.FRAME_CONTAINER,
				});
			},
		};
	};

	const useCaptionProperties = () => {
		const caption = dataHelper.getAttribute('caption', null);

		return {
			value: unescape(caption),
			onChange: (newValue) => {
				dataHelper.setAttribute('caption', escape(newValue));
			},
		};
	};

	const maxWidth = useMaxProperty('maxWidth');
	const maxHeight = useMaxProperty('maxHeight');

	return {
		url: dataHelper.getAttribute('url'),
		caption: dataHelper.getAttribute('caption'),
		captionEnabled: dataHelper.getAttribute('captionEnabled'),
		captionProperties: useCaptionProperties(),
		imageSizeOptions,
		onImageChange,
		align,
		sizeSlug,
		maxHeight,
		maxWidth,
	};
};
const PanelWithData = withComputedData(useComputed)(Panel);

export default PanelWithData;
