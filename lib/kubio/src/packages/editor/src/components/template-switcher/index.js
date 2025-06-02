// import {
// 	DropdownMenu,
// 	MenuGroup,
// 	MenuItem,
// 	MenuItemsChoice,
// 	Tooltip,
// } from '@wordpress/components';
// import { useRegistry, useSelect } from '@wordpress/data';
// import { useEffect, useState } from '@wordpress/element';
// import { __ } from '@wordpress/i18n';
// import { home, Icon, plus, undo } from '@wordpress/icons';
// import { findTemplate } from '../../utils';
//
// const TEMPLATE_OVERRIDES = {
// 	page: (slug) => `page-${slug}`,
// 	category: (slug) => `category-${slug}`,
// 	post: (slug) => `single-post-${slug}`,
// };
//
// function TemplateLabel({ template, homeId }) {
// 	return (
// 		<>
// 			{template.slug}{' '}
// 			{template.id === homeId && (
// 				<Tooltip text={__('Home', 'kubio')}>
// 					<div className="edit-site-template-switcher__label-home-icon">
// 						<Icon icon={home} />
// 					</div>
// 				</Tooltip>
// 			)}
// 			{template.status !== 'auto-draft' && (
// 				<Tooltip text={__('Customized', 'kubio')}>
// 					<span className="edit-site-template-switcher__label-customized-dot" />
// 				</Tooltip>
// 			)}
// 		</>
// 	);
// }
//
// export default function TemplateSwitcher({
// 	page,
// 	activeId,
// 	activeTemplatePartId,
// 	isTemplatePart,
// 	onActiveIdChange,
// 	onActiveTemplatePartIdChange,
// 	onAddTemplate,
// 	onRemoveTemplate,
// }) {
// 	const registry = useRegistry();
// 	const [homeId, setHomeId] = useState();
//
// 	useEffect(() => {
// 		findTemplate(
// 			'/',
// 			registry.__experimentalResolveSelect('core').getEntityRecords
// 		).then(
// 			(newHomeId) => setHomeId(newHomeId),
// 			() => setHomeId(null)
// 		);
// 	}, [registry]);
//
// 	const { currentTheme, template, templateParts } = useSelect(
// 		(select) => {
// 			const {
// 				getCurrentTheme,
// 				getEntityRecord,
// 				getEntityRecords,
// 			} = select('core');
//
// 			const _template = getEntityRecord(
// 				'postType',
// 				'wp_template',
// 				activeId
// 			);
//
// 			return {
// 				currentTheme: getCurrentTheme(),
// 				template: _template,
// 				templateParts: _template
// 					? getEntityRecords('postType', 'wp_template_part', {
// 							resolved: true,
// 							template: _template.slug,
// 					  })
// 					: null,
// 			};
// 		},
// 		[activeId]
// 	);
//
// 	const templateItem = {
// 		label: template ? (
// 			<TemplateLabel template={template} homeId={homeId} />
// 		) : (
// 			__('Loading…', 'kubio')
// 		),
// 		value: activeId,
// 		slug: template ? template.slug : __('Loading…', 'kubio'),
// 		content: template?.content,
// 	};
//
// 	const templatePartItems = templateParts?.map((templatePart) => ({
// 		label: <TemplateLabel template={templatePart} />,
// 		value: templatePart.id,
// 		slug: templatePart.slug,
// 	}));
//
// 	const overwriteSlug =
// 		TEMPLATE_OVERRIDES[page.type] &&
// 		page.slug &&
// 		TEMPLATE_OVERRIDES[page.type](page.slug);
// 	const overwriteTemplate = () =>
// 		onAddTemplate({
// 			slug: overwriteSlug,
// 			title: overwriteSlug,
// 			status: 'publish',
// 			content: templateItem.content.raw,
// 		});
// 	const revertToParent = async () => {
// 		onRemoveTemplate(activeId);
// 	};
// 	return (
// 		<>
// 			<DropdownMenu
// 				popoverProps={{
// 					className: 'edit-site-template-switcher__popover',
// 					position: 'bottom right',
// 				}}
// 				icon={null}
// 				label={__('Switch Template', 'kubio')}
// 				toggleProps={{
// 					children: (isTemplatePart
// 						? templatePartItems
// 						: [templateItem]
// 					).find(
// 						(choice) =>
// 							choice.value ===
// 							(isTemplatePart ? activeTemplatePartId : activeId)
// 					).slug,
// 				}}
// 			>
// 				{() => (
// 					<>
// 						<MenuGroup label={__('Template', 'kubio')}>
// 							<MenuItem
// 								onClick={() => onActiveIdChange(activeId)}
// 							>
// 								{templateItem.label}
// 							</MenuItem>
// 							{overwriteSlug &&
// 								overwriteSlug !== templateItem.slug && (
// 									<MenuItem
// 										icon={plus}
// 										onClick={overwriteTemplate}
// 									>
// 										{__('Overwrite Template', 'kubio')}
// 									</MenuItem>
// 								)}
// 							{overwriteSlug === templateItem.slug && (
// 								<MenuItem icon={undo} onClick={revertToParent}>
// 									{__('Revert to Parent', 'kubio')}
// 								</MenuItem>
// 							)}
// 						</MenuGroup>
// 						<MenuGroup label={__('Template Parts', 'kubio')}>
// 							<MenuItemsChoice
// 								choices={templatePartItems}
// 								value={
// 									isTemplatePart
// 										? activeTemplatePartId
// 										: undefined
// 								}
// 								onSelect={onActiveTemplatePartIdChange}
// 							/>
// 						</MenuGroup>
// 						<MenuGroup label={__('Current theme', 'kubio')}>
// 							<MenuItem>{currentTheme.name}</MenuItem>
// 						</MenuGroup>
//
// 						<div className="edit-site-template-switcher__footer" />
// 					</>
// 				)}
// 			</DropdownMenu>
// 		</>
// 	);
// }
