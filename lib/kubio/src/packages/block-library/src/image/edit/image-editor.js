/**
 * External dependencies
 */

import { Cropper } from '@kubio/controls';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import { BlockControls } from '@wordpress/block-editor';
import { useState, useCallback } from '@wordpress/element';
import {
	search,
	check,
	rotateRight as rotateRightIcon,
	aspectRatio as aspectRatioIcon,
} from '@wordpress/icons';
import {
	ToolbarGroup,
	ToolbarButton,
	ToolbarItem,
	Spinner,
	RangeControl,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Dropdown,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { useImageSize } from '@kubio/core';
import _ from 'lodash';

const MIN_ZOOM = 100;
const MAX_ZOOM = 300;
const POPOVER_PROPS = {
	position: 'bottom right',
	isAlternate: true,
};

function AspectGroup({ aspectRatios, isDisabled, label, onClick, value }) {
	return (
		<MenuGroup label={label}>
			{aspectRatios.map(({ title, aspect }) => (
				<MenuItem
					key={aspect}
					disabled={isDisabled}
					onClick={() => {
						onClick(aspect);
					}}
					role="menuitemradio"
					isSelected={aspect === value}
					icon={aspect === value ? check : undefined}
				>
					{title}
				</MenuItem>
			))}
		</MenuGroup>
	);
}

function AspectMenu({ toggleProps, isDisabled, onClick, value, defaultValue }) {
	return (
		<DropdownMenu
			icon={aspectRatioIcon}
			label={__('Aspect Ratio', 'kubio')}
			popoverProps={POPOVER_PROPS}
			toggleProps={toggleProps}
			className="wp-block-image__aspect-ratio"
		>
			{({ onClose }) => (
				<>
					<AspectGroup
						isDisabled={isDisabled}
						onClick={(aspect) => {
							onClick(aspect);
							onClose();
						}}
						value={value}
						aspectRatios={[
							{
								title: __('Original', 'kubio'),
								aspect: defaultValue,
							},
							{
								title: __('Square', 'kubio'),
								aspect: 1,
							},
						]}
					/>
					<AspectGroup
						label={__('Landscape', 'kubio')}
						isDisabled={isDisabled}
						onClick={(aspect) => {
							onClick(aspect);
							onClose();
						}}
						value={value}
						aspectRatios={[
							{
								title: __('16:10', 'kubio'),
								aspect: 16 / 10,
							},
							{
								title: __('16:9', 'kubio'),
								aspect: 16 / 9,
							},
							{
								title: __('4:3', 'kubio'),
								aspect: 4 / 3,
							},
							{
								title: __('3:2', 'kubio'),
								aspect: 3 / 2,
							},
						]}
					/>
					<AspectGroup
						label={__('Portrait', 'kubio')}
						isDisabled={isDisabled}
						onClick={(aspect) => {
							onClick(aspect);
							onClose();
						}}
						value={value}
						aspectRatios={[
							{
								title: __('10:16', 'kubio'),
								aspect: 10 / 16,
							},
							{
								title: __('9:16', 'kubio'),
								aspect: 9 / 16,
							},
							{
								title: __('3:4', 'kubio'),
								aspect: 3 / 4,
							},
							{
								title: __('2:3', 'kubio'),
								aspect: 2 / 3,
							},
						]}
					/>
				</>
			)}
		</DropdownMenu>
	);
}

export default function ImageEditor({
	id,
	url,
	setAttributes,
	naturalWidth,
	naturalHeight,
	width,
	height,
	clientWidth,
	setIsEditingImage,
	currentSlug,
	ownerDocument = document,
}) {
	const { createErrorNotice } = useDispatch('core/notices');
	const [inProgress, setIsProgress] = useState(false);
	const [crop, setCrop] = useState(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(100);
	const [aspect, setAspect] = useState(naturalWidth / naturalHeight);
	const [rotation, setRotation] = useState(0);
	const [editedUrl, setEditedUrl] = useState();

	const editedWidth = width;
	let editedHeight = height || (clientWidth * naturalHeight) / naturalWidth;
	let naturalAspectRatio = naturalWidth / naturalHeight;

	if (rotation % 180 === 90) {
		editedHeight = (clientWidth * naturalWidth) / naturalHeight;
		naturalAspectRatio = naturalHeight / naturalWidth;
	}

	const applySucess = useCallback(
		(response) => {
			let newUrl = response.source_url;
			if (currentSlug) {
				newUrl = _.get(response, [
					'media_details',
					'sizes',
					currentSlug,
					'source_url',
				]);
			}
			setAttributes({
				id: response.id,
				url: newUrl,
				height: height && width ? width / aspect : undefined,
			});
		},
		[currentSlug, height, width, aspect]
	);

	function apply() {
		setIsProgress(true);

		let attrs = {};

		// The crop script may return some very small, sub-pixel values when the image was not cropped.
		// Crop only when the new size has changed by more than 0.1%.
		if (crop.width < 99.9 || crop.height < 99.9) {
			attrs = crop;
		}

		if (rotation > 0) {
			attrs.rotation = rotation;
		}

		attrs.src = url;
		apiFetch({
			path: `/wp/v2/media/${id}/edit`,
			method: 'POST',
			data: attrs,
		})
			.then(applySucess)
			.catch((error) => {
				createErrorNotice(
					sprintf(
						/* translators: 1. Error message */
						__('Could not edit image. %s', 'kubio'),
						error.message
					),
					{
						id: 'image-editing-error',
						type: 'snackbar',
					}
				);
			})
			.finally(() => {
				setIsProgress(false);
				setIsEditingImage(false);
			});
	}

	function rotate() {
		const angle = (rotation + 90) % 360;

		if (angle === 0) {
			setEditedUrl();
			setRotation(angle);
			setAspect(1 / aspect);
			setPosition({
				x: -(position.y * naturalAspectRatio),
				y: position.x * naturalAspectRatio,
			});
			return;
		}

		function editImage(event) {
			const canvas = document.createElement('canvas');

			let translateX = 0;
			let translateY = 0;

			if (angle % 180) {
				canvas.width = event.target.height;
				canvas.height = event.target.width;
			} else {
				canvas.width = event.target.width;
				canvas.height = event.target.height;
			}

			if (angle === 90 || angle === 180) {
				translateX = canvas.width;
			}

			if (angle === 270 || angle === 180) {
				translateY = canvas.height;
			}

			const context = canvas.getContext('2d');

			context.translate(translateX, translateY);
			context.rotate((angle * Math.PI) / 180);
			context.drawImage(event.target, 0, 0);

			canvas.toBlob((blob) => {
				setEditedUrl(URL.createObjectURL(blob));
				setRotation(angle);
				setAspect(1 / aspect);
				setPosition({
					x: -(position.y * naturalAspectRatio),
					y: position.x * naturalAspectRatio,
				});
			});
		}

		const el = new window.Image();
		el.src = url;
		el.onload = editImage;
	}

	return (
		<>
			<div
				className={classnames('wp-block-image__crop-area', {
					'is-applying': inProgress,
				})}
				style={{
					width: editedWidth,
					height: editedHeight,
				}}
			>
				<Cropper
					image={editedUrl || url}
					disabled={inProgress}
					minZoom={MIN_ZOOM / 100}
					maxZoom={MAX_ZOOM / 100}
					crop={position}
					zoom={zoom / 100}
					aspect={aspect}
					onCropChange={setPosition}
					onCropComplete={(newCropPercent) => {
						setCrop(newCropPercent);
					}}
					onZoomChange={(newZoom) => {
						setZoom(newZoom * 100);
					}}
					ownerDocument={ownerDocument}
				/>
				{inProgress && <Spinner />}
			</div>
			<BlockControls>
				<ToolbarGroup>
					<Dropdown
						contentClassName="wp-block-image__zoom"
						popoverProps={POPOVER_PROPS}
						renderToggle={({ isOpen, onToggle }) => (
							<ToolbarButton
								icon={search}
								label={__('Zoom', 'kubio')}
								onClick={onToggle}
								aria-expanded={isOpen}
								disabled={inProgress}
							/>
						)}
						renderContent={() => (
							<RangeControl
								min={MIN_ZOOM}
								max={MAX_ZOOM}
								label={__('Zoom', 'kubio')}
								value={Math.round(zoom)}
								onChange={setZoom}
							/>
						)}
					/>
					<ToolbarItem>
						{(toggleProps) => (
							<AspectMenu
								toggleProps={toggleProps}
								isDisabled={inProgress}
								onClick={setAspect}
								value={aspect}
								defaultValue={naturalWidth / naturalHeight}
							/>
						)}
					</ToolbarItem>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton
						icon={rotateRightIcon}
						label={__('Rotate', 'kubio')}
						onClick={rotate}
						disabled={inProgress}
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton onClick={apply} disabled={inProgress}>
						{__('Apply', 'kubio')}
					</ToolbarButton>
					<ToolbarButton onClick={() => setIsEditingImage(false)}>
						{__('Cancel', 'kubio')}
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
		</>
	);
}
