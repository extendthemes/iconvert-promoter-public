// import { useRegistry, withSelect } from '@wordpress/data';
// import { compose } from '@wordpress/compose';
// import {
// 	DropdownMenu,
// 	MenuGroup,
// 	MenuItem,
// 	MenuItemsChoice,
// 	Tooltip,
// } from '@wordpress/components';
// import { __ } from '@wordpress/i18n';
// import { plus } from '@wordpress/icons';
// import { useCallback, useEffect, useState } from '@wordpress/element';
//
// import { AddTemplate } from './add-template';
// import { findTemplate } from '../../utils';
//
// function EntityLabel({ entity, homeId }) {
// 	return (
// 		<>
// 			{entity.slug} {/*{entity.id === homeId && (*/}
// 			{/*	<Tooltip text={__('Home')}>*/}
// 			{/*		<div className="edit-site-template-switcher__label-home-icon">*/}
// 			{/*			<Icon icon={home}/>*/}
// 			{/*		</div>*/}
// 			{/*	</Tooltip>*/}
// 			{/*)}*/}
// 			{entity.status !== 'auto-draft' && (
// 				<Tooltip text={__('Customized', 'kubio')}>
// 					<span className="edit-site-template-switcher__label-customized-dot" />
// 				</Tooltip>
// 			)}
// 		</>
// 	);
// }
//
// const mapEntity = (entities, { getEntityRecord, type, homeId }) => {
// 	if (!entities) return [];
// 	return entities.map((id) => {
// 		const entity = getEntityRecord('postType', type, id);
// 		return {
// 			label: entity ? (
// 				<EntityLabel entity={entity} homeId={homeId} />
// 			) : (
// 				__('Loading…', 'kubio')
// 			),
// 			value: id,
// 			slug: entity ? entity.slug : __('Loading…', 'kubio'),
// 		};
// 	});
// };
//
// const EntitiesPicker = ({
// 	entity,
// 	onActiveEntityChange,
// 	onAddEntity,
// 	onRemoveEntity,
// 	onSelect,
// 	pages = [],
// 	isRequesting,
// 	currentEntities,
// 	templateIds,
//
// 	onAddTemplate,
// 	onRemoveTemplate,
// }) => {
// 	if (!currentEntities) return <></>;
//
// 	const { activeEntityId, activeEntityType } = entity;
//
// 	const {
// 		currentTheme,
// 		openedTemplates,
// 		openedTemplateParts,
// 		openedPages,
// 	} = currentEntities;
//
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
// 	const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
//
// 	const pagesList = pages
// 		? pages.map((item) => ({
// 				id: item.id,
// 				value: item.id,
// 				label: item.title.raw,
// 		  }))
// 		: [];
//
// 	const EntityTypes = [
// 		{
// 			type: 'page',
// 			label: __('Pages', 'kubio'),
// 			choices: openedPages,
// 		},
// 		{
// 			type: 'wp_template',
// 			label: __('Templates', 'kubio'),
// 			choices: openedTemplates,
// 		},
// 		{
// 			type: 'wp_template_part',
// 			label: __('Template Parts', 'kubio'),
// 			choices: openedTemplateParts,
// 		},
// 	];
//
// 	return (
// 		<>
// 			<DropdownMenu
// 				icon={'ellipsis'}
// 				label={'Open Page or Template'}
// 				controls={pagesList}
// 				onChange={onSelect}
// 			>
// 				{({ onClose }) => (
// 					<>
// 						{EntityTypes.map((entityType) => {
// 							return (
// 								<MenuGroup
// 									key={entityType.type}
// 									label={entityType.label}
// 								>
// 									<MenuItemsChoice
// 										choices={entityType.choices}
// 										value={activeEntityId}
// 										onSelect={(id) => {
// 											onActiveEntityChange({
// 												id,
// 												type: entityType.type,
// 											});
// 										}}
// 									/>
// 									<MenuItem
// 										icon={plus}
// 										onClick={() => {
// 											onClose();
// 										}}
// 									>
// 										{__('New', 'kubio')}
// 									</MenuItem>
// 								</MenuGroup>
// 							);
// 						})}
// 						<MenuGroup label={__('Current theme', 'kubio')}>
// 							<MenuItem>{currentTheme.name}</MenuItem>
// 						</MenuGroup>
// 					</>
// 				)}
// 			</DropdownMenu>
//
// 			{isAddTemplateOpen && (
// 				<AddTemplate
// 					ids={templateIds}
// 					onAddTemplateId={onAddTemplate}
// 					onRequestClose={useCallback(
// 						() => setIsAddTemplateOpen(false),
// 						[]
// 					)}
// 					isOpen={isAddTemplateOpen}
// 				/>
// 			)}
// 		</>
// 	);
// };
//
// const withPages = () => {
// 	return withSelect((select, ownProps) => {});
// };
//
// const EntitySwitcher = compose(
// 	withSelect((select, ownProps) => {
// 		const {
// 			templateIds = [],
// 			templatePartIds = [],
// 			pagesIds = [],
// 			homeId = [],
// 		} = ownProps;
// 		const { getEntityRecords, getCurrentTheme, getEntityRecord } = select(
// 			'core'
// 		);
//
// 		const currentEntities = {
// 			currentTheme: getCurrentTheme(),
// 			openedPages: mapEntity(pagesIds, {
// 				type: 'page',
// 				getEntityRecord,
// 				homeId,
// 			}),
// 			openedTemplates: mapEntity(templateIds, {
// 				type: 'wp_template',
// 				getEntityRecord,
// 				homeId,
// 			}),
// 			openedTemplateParts: mapEntity(templatePartIds, {
// 				type: 'wp_template_part',
// 				getEntityRecord,
// 				homeId,
// 			}),
// 		};
//
// 		const { isResolving } = select('core/data');
// 		const query = {};
// 		const pages = getEntityRecords('postType', 'post', query);
//
// 		return {
// 			currentEntities,
// 			pages,
// 			...ownProps,
// 			isRequesting: isResolving('core', 'getEntityRecords', [
// 				'postType',
// 				'post',
// 				query,
// 			]),
// 		};
// 	})
// )(EntitiesPicker);
//
// export { EntitySwitcher };
