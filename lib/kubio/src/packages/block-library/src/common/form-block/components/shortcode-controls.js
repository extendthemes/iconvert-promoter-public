import {
	ToggleGroup,
	GutentagSelectControl,
	ControlNotice,
} from '@kubio/controls';
import { BaseControl, Button, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { formTypeCallback, properties } from '../config';
import { useSelect } from '@wordpress/data';
import _ from 'lodash';
import { Icon } from '@wordpress/icons';
import { KubioLoader, UpdateIcon } from '@kubio/icons';
import classnames from 'classnames';

const { shortcodeControlType } = properties;

const ShortcodeControls = ({
	dataHelper,
	isForPlaceholder = false,
	formListStore,
	useFormApi = _.noop,
	supportedPlugins = [],
}) => {
	const shortcode = {
		value: dataHelper.getAttribute('shortcode'),
		onChange: (newValue) => {
			dataHelper.setAttribute('shortcode', newValue);
			if (dataHelper.getAttribute('formId')) {
				dataHelper.setAttribute('formId', '');
			}
		},
	};

	const controlType = dataHelper.getContextProp('shortcodeControlType');
	const setControlType = (value) => {
		dataHelper.setContextProp('shortcodeControlType', value);
	};
	const { getFormOptions, getLoading } = useSelect((select) => {
		return select(formListStore);
	});

	const { retrieve: onRefreshFormList } = useFormApi();

	const formTypesOptions = getFormOptions();

	const isLoading = getLoading();

	const showShortcodeTextArea =
		controlType === shortcodeControlType.values.SHORTCODE;
	const showFormTypeDropdown =
		controlType === shortcodeControlType.values.FORM;

	const formIdValue = dataHelper.getAttribute('formId');
	const onFormSelect = formTypeCallback({
		options: formTypesOptions,
		onChangeShortcode: (newValue) => {
			dataHelper.setAttribute('shortcode', newValue);
		},
		onChangeFormType: (newValue) => {
			dataHelper.setAttribute('formId', newValue);
		},
	});

	const toggleLabel = !isForPlaceholder ? __('Add form', 'kubio') : undefined;

	return (
		<>
			<ToggleGroup
				label={toggleLabel}
				options={shortcodeControlType.options}
				value={controlType}
				onChange={setControlType}
			/>

			{showFormTypeDropdown && (
				<FormControl
					isForPlaceholder={isForPlaceholder}
					value={formIdValue}
					onChange={onFormSelect}
					supportedPlugins={supportedPlugins}
					options={formTypesOptions}
					isLoading={isLoading}
					onRefreshFormList={onRefreshFormList}
				/>
			)}
			{showShortcodeTextArea && (
				<ShortcodeTextAreaControl
					{...shortcode}
					isForPlaceholder={isForPlaceholder}
				/>
			)}
		</>
	);
};

function ShortcodeTextAreaControl({ isForPlaceholder, ...props }) {
	const Control = isForPlaceholder
		? ShortcodeCanvasTextAreaControl
		: ShortcodePanelTextAreaControl;

	return (
		<Control
			rows={2}
			placeholder={__('[Insert shortcode here]', 'kubio')}
			{...props}
		/>
	);
}

function ShortcodePanelTextAreaControl(props) {
	return <TextareaControl {...props} />;
}

function ShortcodeCanvasTextAreaControl({ ...props }) {
	const { value, onChange } = props;
	const [internalShortcode, setInternalShortcode] = useState(value);
	useEffect(() => {
		if (internalShortcode !== value) {
			setInternalShortcode(value);
		}
	}, [value]);
	const onUpdateShortcode = () => {
		onChange(internalShortcode);
	};

	return (
		<>
			<TextareaControl
				{...props}
				value={internalShortcode}
				onChange={setInternalShortcode}
				className={'kubio-ui-reset'}
			/>

			<BaseControl>
				<Button onClick={onUpdateShortcode} isPrimary>
					{__('Use shortcode', 'kubio')}
				</Button>
			</BaseControl>
		</>
	);
}

function FormControl({ ...props }) {
	const {
		options,
		isForPlaceholder,
		supportedPlugins,
		isLoading,
		onRefreshFormList,
	} = props;
	const noFormsInList = options.length === 0;
	const [internalLoading, setInternalLoading] = useState(false);
	const Control = isForPlaceholder ? CanvasFormControl : PanelFormControl;
	const onUpdateFormList = () => {
		setInternalLoading(true);
		onRefreshFormList();
	};

	useEffect(() => {
		if (isLoading !== internalLoading) {
			setInternalLoading(isLoading);
		}
	}, [isLoading]);

	return (
		<div
			className={classnames('kubio-block-placeholder-form__controls', {
				'kubio-block-placeholder-form__controls--sidebar': !isForPlaceholder,
			})}
		>
			{isLoading && <LoadingContent />}
			{!isLoading && (
				<>
					{noFormsInList && (
						<EmptyDropDownNotice
							supportedPlugins={supportedPlugins}
						/>
					)}
					{!noFormsInList && (
						<Control
							placeholder={__('Select a form', 'kubio')}
							onReset={onUpdateFormList}
							disabled={internalLoading}
							{...props}
						/>
					)}

					{noFormsInList && (
						<BaseControl>
							<Button
								onClick={onUpdateFormList}
								isPrimary
								disabled={internalLoading}
								className="w-100 justify-content-center kubio-form-shortcode-controls__loading-button"
							>
								<span>{__('Refresh form list', 'kubio')}</span>
							</Button>
						</BaseControl>
					)}
				</>
			)}
		</div>
	);
}

function LoadingContent() {
	return (
		<div className="kubio-block-placeholder-form__controls__kubio-loader">
			<Icon icon={KubioLoader} />
			<span className="kubio-block-placeholder-form__controls__kubio-loader__text">
				{__('Loading forms…', 'kubio')}
			</span>
		</div>
	);
}

function PanelFormControl({ ...props }) {
	return (
		<GutentagSelectControl
			{...props}
			allowReset={true}
			resetIcon={UpdateIcon}
			resetLabel={__('Refresh form list', 'kubio')}
		/>
	);
}

function CanvasFormControl({ ...props }) {
	const { value, onChange, options, onReset, disabled = false } = props;
	const [internalForm, setInternalForm] = useState(value);
	useEffect(() => {
		if (internalForm !== value) {
			setInternalForm(value);
		}
	}, [value]);
	const onFormUpdate = () => {
		if (internalForm === 'custom' || !internalForm) {
			return;
		}
		onChange(internalForm);
	};

	return (
		<>
			<GutentagSelectControl
				{...props}
				options={options}
				value={internalForm}
				onChange={setInternalForm}
				onReset={onReset}
				allowReset={true}
				resetIcon={UpdateIcon}
				resetLabel={__('Refresh form list', 'kubio')}
			/>
			<BaseControl>
				<Button
					onClick={onFormUpdate}
					isPrimary
					disabled={disabled || !internalForm}
				>
					{__('Use Form', 'kubio')}
				</Button>
			</BaseControl>
		</>
	);
}

function EmptyDropDownNotice({ supportedPlugins }) {
	const getPluginUrl = (keyWords) => {
		try {
			// eslint-disable-next-line camelcase
			const { admin_url } = window.kubioUtilsData;
			// eslint-disable-next-line camelcase
			const pluginPageUrl = new URL(`${admin_url}plugin-install.php`);
			const params = pluginPageUrl.searchParams;
			params.append('s', keyWords);
			params.append('tab', 'search');
			params.append('type', 'term');
			return pluginPageUrl.toString();
		} catch (e) {
			return '#';
		}
	};

	//links are disabled on canvas, we need to use js to redirect
	const onLinkClick = (item) => {
		const pluginUrl = getPluginUrl(item.value);
		if (pluginUrl) {
			window.open(pluginUrl, '_blank').focus();
		}
	};

	return (
		<ControlNotice
			content={
				<span className={'h-form-placeholder__notice'}>
					<b>{__('No forms detected.', 'kubio')}</b>
					&nbsp;
					<span>
						{__(
							'You can use forms from the following plugins: ',
							'kubio'
						)}
					</span>
					{supportedPlugins.map((item, index) => {
						return (
							<span key={item.value}>
								<a
									onClick={() => {
										onLinkClick(item);
									}}
									href={getPluginUrl(item.value)}
									target="_blank"
									rel="noreferrer"
								>
									{item.label}
								</a>
								{index !== supportedPlugins.length - 1 && (
									<span>,&nbsp;</span>
								)}
							</span>
						);
					})}
				</span>
			}
		/>
	);
}

export { ShortcodeControls };
