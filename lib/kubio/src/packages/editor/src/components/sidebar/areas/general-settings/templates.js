import {
	GutentagSelectControl,
	ControlNotice,
	SeparatorHorizontalLine,
} from '@kubio/controls';
import { useDeepMemo, useTemplateData } from '@kubio/core';
import { STORE_KEY } from '@kubio/constants';
import SubSidebarArea from '../../subsidebar-area';
import { sprintf, __ } from '@wordpress/i18n';
import { BaseControl, PanelBody } from '@wordpress/components';
import _ from 'lodash';
import { useSelect } from '@wordpress/data';
const TemplatePartsPanel = ({ type }) => {
	const {
		templateOptions,
		templatePartsOptions,
		config,

		getTemplatePartBlockByTemplateId,
		getTemplatePartSlugByTemplateId,
		onChangeTemplatePartSlugByTemplateId,
	} = useTemplateData(type);
	const typeLabel = _.capitalize(_.get(config, 'label', 'Part'));
	const { coreTemplateOptions, customTemplateOptions } = useDeepMemo(() => {
		const coreOptions = templateOptions.filter(
			(item) => item.isCoreTemplate
		);
		const customOptions = templateOptions.filter(
			(item) => !item.isCoreTemplate
		);
		return {
			coreTemplateOptions: coreOptions,
			customTemplateOptions: customOptions,
		};
	}, [templateOptions]);

	const templateProps = {
		getTemplatePartSlugByTemplateId,
		onChangeTemplatePartSlugByTemplateId,
		getTemplatePartBlockByTemplateId,
		typeLabel,
		templatePartsOptions,
	};

	const hasCustomTemplates = customTemplateOptions.length > 0;
	return (
		<PanelBody title={typeLabel} initialOpen={false}>
			<div className="kubio-general-setting-templates">
				<Templates
					label={__('System templates', 'kubio')}
					templateOptions={coreTemplateOptions}
					{...templateProps}
				/>

				{hasCustomTemplates && (
					<>
						<SeparatorHorizontalLine />

						<Templates
							label={__('Custom templates', 'kubio')}
							templateOptions={customTemplateOptions}
							{...templateProps}
						/>
					</>
				)}
			</div>
		</PanelBody>
	);
};

function Templates({
	label = __('Templates', 'kubio'),
	templateOptions = [],
	getTemplatePartSlugByTemplateId,
	getTemplatePartBlockByTemplateId,
	onChangeTemplatePartSlugByTemplateId,
	typeLabel,
	templatePartsOptions,
}) {
	return (
		<BaseControl>
			<BaseControl.VisualLabel className={'kubio-template-list__label'}>
				{label}
			</BaseControl.VisualLabel>
			{templateOptions.map((templateOption) => {
				const value = getTemplatePartSlugByTemplateId(
					templateOption.value
				);
				const hasComponent = !!getTemplatePartBlockByTemplateId(
					templateOption.value
				);
				return (
					<div
						key={templateOption.value + hasComponent}
						className="kubio-general-setting-templates__item-container"
					>
						{hasComponent && (
							<GutentagSelectControl
								inlineLabel={false}
								label={templateOption.label}
								options={templatePartsOptions}
								value={value}
								onChange={onChangeTemplatePartSlugByTemplateId(
									templateOption.value
								)}
							/>
						)}
						{!hasComponent && (
							<BaseControl className="kubio-general-setting-templates__not-found-notice">
								<BaseControl.VisualLabel>
									{templateOption.label}
								</BaseControl.VisualLabel>
								<ControlNotice
									showLabel={false}
									content={sprintf(
										// translators: %s template type label
										__(
											`%s block not found in template`,
											'kubio'
										),
										typeLabel
									)}
								/>
							</BaseControl>
						)}
					</div>
				);
			})}
		</BaseControl>
	);
}

const TemplatesWrapper = ({ areaIdentifier }) => {
	const shouldRender = useSelect(
		(select) => select(STORE_KEY).isEditorSidebarOpened(areaIdentifier),
		[]
	);
	return (
		<>
			{shouldRender && (
				<>
					<TemplatePartsPanel type="header" />
					<TemplatePartsPanel type="footer" />
					<TemplatePartsPanel type="sidebar" />
				</>
			)}
		</>
	);
};

const TemplatesPanel = ({ parentAreaIdentifier }) => {
	const isKubioTheme = useSelect((select) => {
		return select('kubio/edit-site')?.getSettings()?.isKubioTheme;
	});

	if (!isKubioTheme) {
		return null;
	}

	return (
		<SubSidebarArea
			title={__('Templates', 'kubio')}
			parentAreaIdentifier={parentAreaIdentifier}
			areaIdentifier={`${parentAreaIdentifier}/templates`}
		>
			<TemplatesWrapper
				areaIdentifier={`${parentAreaIdentifier}/templates`}
			/>
		</SubSidebarArea>
	);
};
export default TemplatesPanel;
