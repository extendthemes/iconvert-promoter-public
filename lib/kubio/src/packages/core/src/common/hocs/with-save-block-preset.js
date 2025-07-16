import { omit, isEmpty } from 'lodash';
import {
	MenuGroup,
	MenuItem,
	Button,
	Modal,
	SelectControl,
	FormFileUpload,
} from '@wordpress/components';
import {
	BlockSettingsMenuControls,
	BlockPreview,
} from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';
import { ProItem, addProTagToItem } from '@kubio/pro';
import { useKubioCloudConnect } from './with-kubio-cloud-connect';
import { useKubioNotices } from '../../notices';
import classnames from 'classnames';

/**
 * This function returns the clean version of a given block, without styleRef data. Maybe move this in '@kubio/utils';
 *
 * @param {Object} props The given props for the function.
 */
const getCleanBlock = (props) => {
	let { name, innerBlocks, attributes = {} } = props;
	attributes = {
		...(attributes || {}),
		kubio: omit(attributes?.kubio || {}, ['styleRef', 'hash', 'id']),
	};

	return [
		name,
		attributes,
		innerBlocks.map((innerBlock) => getCleanBlock(innerBlock)),
	];
};

const SaveBlockPreset = (props) => {
	const { clientId, name } = props;

	const { createErrorNotice, createSuccessNotice } = useKubioNotices();

	const [
		apiData,
		connectToKubioCloud,
		disconnectFromKubioCloud,
	] = useKubioCloudConnect();

	const categoryOptions = window.kubioEditSiteSettings.__experimentalBlockPatternCategories.filter(
		(i) => {
			if (!i.name || i.name.indexOf('kubio') < 0) {
				return false;
			}

			return {
				label: i.label,
				value: i.name,
			};
		}
	);

	const { blockPreview } = useSelect((select) => {
		return {
			// this one contains innerBlocks too.
			blockPreview: select('core/block-editor').getBlock(clientId),
		};
	});

	const item = addProTagToItem({});

	const [state, setState] = useState({
		isVisible: false,
		isValid: true,
		name: null,
		category: categoryOptions[0].label,
		screenshot: null,
	});

	const onSaveClick = (event) => {
		event.target.classList.add('is-busy');

		apiFetch({
			path: '/kubio/v1/snippet',
			method: 'POST',
			data: {
				name: state.name,
				snippet: getCleanBlock(blockPreview),
				category: state.category,
				screenshot: state.screenshot,
			},
		})
			.then((res) => {
				if (res.success) {
					setState({ ...state, isVisible: false });
					createSuccessNotice(
						state.name + __(' saved successfully!', 'kubio')
					);
				} else {
					createErrorNotice(
						__('An error occurred. ', 'kubio') +
							state.name +
							__(' was not saved!', 'kubio')
					);
				}
			})
			.catch(() => {
				createErrorNotice(
					__('An error occurred. ', 'kubio') +
						state.name +
						__(' was not saved!', 'kubio')
				);
			});
	};

	const onCategoryChange = (newValue) => {
		setState({ ...state, category: newValue });
	};

	const onScreenshotChange = (e) => {
		const files = e.target.files;
		if (files.length < 1) {
			return;
		}

		const file = files[0];

		// Check if the file is an image.
		if (file.type && !file.type.startsWith('image/')) {
			console.log('File is not an image.', file.type, file);
			return;
		}

		const reader = new window.FileReader();
		let screenshot = null;
		reader.addEventListener('load', (event) => {
			screenshot = event.target.result;
			setState({
				...state,
				screenshot,
			});
		});
		reader.readAsDataURL(file);
	};

	const onEditingName = (e) => {
		// max 100 chars and only spaces, letters and numbers.
		if (
			e.target.value.length > 100 ||
			e.target.value.match(/[^A-Za-z0-9 \-_]+/)
		) {
			setState({
				...state,
				isValid: false,
			});

			return;
		}

		setState({
			...state,
			name: e.target.value,
			isValid: true,
		});
	};

	const saveDisabled =
		apiData.status !== 'connected' ||
		isEmpty(state.screenshot) ||
		isEmpty(state.name) ||
		!state.isValid;

	let blockName = blockPreview.name.replace('kubio/', '').replace('-', ' ');

	blockName = blockName[0].toUpperCase() + blockName.slice(1);

	const saveButtonClasseNames = classnames({
		'kubio-save-snippet-popup__save-disabled': saveDisabled,
	});

	const isEmptySection = () => {
		if (
			blockPreview.name !== 'kubio/section' &&
			blockPreview.innerBlocks.length !== 1
		) {
			return false;
		}

		const row = blockPreview.innerBlocks[0];

		if (row.name !== 'kubio/row' && row.innerBlocks.length !== 1) {
			return false;
		}

		const column = row.innerBlocks[0];

		if (column.name === 'kubio/column' && isEmpty(column.innerBlocks)) {
			return true;
		}

		return false;
	};

	if (isEmptySection()) {
		return <></>;
	}

	return (
		<>
			<MenuGroup className={'kubio-block-settings-control'}>
				<ProItem
					item={item}
					tag={MenuItem}
					onClick={() => setState({ ...state, isVisible: true })}
					urlArgs={{ source: 'toolbar', content: 'save-snippet' }}
				>
					{__('Save block preset', 'kubio')}
				</ProItem>
			</MenuGroup>

			{state.isVisible && (
				<Modal
					onRequestClose={() =>
						setState({ ...state, isVisible: false })
					}
					className="kubio-save-snippet-popup"
					title={__('Save block preset in Kubio Cloud', 'kubio')}
				>
					<div className={'kubio-save-snippet-popup__content'}>
						{apiData.status !== 'connected' ? (
							<Button
								onClick={connectToKubioCloud}
								variant="primary"
								target="blank"
								className={
									'kubio-save-snippet-popup__connect-button'
								}
							>
								{__('Connect to Kubio Cloud', 'kubio')}
							</Button>
						) : (
							<div
								className={
									'kubio-save-snippet-popup__option kubio-save-snippet-popup__option-header'
								}
							>
								<span
									className={
										'kubio-save-snippet-popup__account'
									}
								>
									{__('Hello, ', 'kubio')}
									<em>{apiData.name}</em>
								</span>
								<Button
									onClick={disconnectFromKubioCloud}
									variant="link"
								>
									{__('Change account', 'kubio')}
								</Button>
							</div>
						)}

						{!state.isValid && (
							<span className="kubio-save-snippet-popup__name-error">
								{__(
									// 'Preset name is limited to 100 characters',
									'Only letters and numbers are allowed (Max 100 characters).',
									'kubio'
								)}
							</span>
						)}

						<div className={'kubio-save-snippet-popup__option'}>
							<div>{__('Block preset name', 'kubio')}</div>
							<input
								className="kubio-save-snippet-popup__snippet-name"
								autoComplete="off"
								placeholder={__('Ex: ', 'kubio') + blockName}
								onChange={onEditingName}
							/>
						</div>

						{name === 'kubio/section' && (
							<SelectControl
								label={__('Save in', 'kubio')}
								className={'kubio-save-snippet-popup__option'}
								options={categoryOptions}
								labelPosition="side"
								onChange={onCategoryChange}
							/>
						)}

						<div className="kubio-save-snippet-popup__option">
							<span>{__('Block screenshot', 'kubio')}</span>
							{!state.screenshot && (
								<FormFileUpload
									type="file"
									onChange={onScreenshotChange}
									accept="image/*"
								>
									<span className="components-button is-link">
										{__('Upload', 'kubio')}
									</span>
								</FormFileUpload>
							)}
							{state.screenshot && (
								<FormFileUpload
									type="file"
									onChange={onScreenshotChange}
									accept="image/*"
									// onClick={() =>
									// 	setState({
									// 		...state,
									// 		screenshot: null,
									// 	})
									// }
								>
									<span className="components-button is-link">
										{__('Replace', 'kubio')}
									</span>
								</FormFileUpload>
							)}
						</div>
						<div className="kubio-save-snippet-popup__media-placeholder">
							{state.screenshot && (
								<>
									<img
										src={state.screenshot}
										alt=""
										style={{
											maxWidth: '400px',
											maxHeight: '400px',
										}}
									/>
								</>
							)}
							{/*{!state.screenshot && (*/}
							{/*	<BlockPreview*/}
							{/*		style={{ opacity: '50%' }}*/}
							{/*		blocks={blockPreview}*/}
							{/*		viewportWidth={200}*/}
							{/*		__experimentalMinHeight={250}*/}
							{/*		__experimentalPadding={20}*/}
							{/*	/>*/}
							{/*)}*/}
						</div>
						<div className={'kubio-save-snippet-popup__option'}>
							<div></div>
							<Button
								variant="primary"
								onClick={onSaveClick}
								className={saveButtonClasseNames}
								disabled={saveDisabled}
							>
								{__('Save block preset', 'kubio')}
							</Button>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
};

const withSaveBlockPreset = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (!window?.kubioEditSiteSettings?.kubioCloudSnippets) {
			return (
				<>
					<BlockEdit {...props} />
				</>
			);
		}

		return (
			<>
				<BlockEdit {...props} />
				{props?.isSelected && (
					<BlockSettingsMenuControls>
						<SaveBlockPreset {...props} />
					</BlockSettingsMenuControls>
				)}
			</>
		);
	};
});

export { withSaveBlockPreset };
