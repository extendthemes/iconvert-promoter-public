import {
	BaseControl,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	Tooltip,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalStyleProvider as StyleProvider,
} from '@wordpress/components';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { isEmpty, lowerFirst, noop, unset } from 'lodash';
import { useTransformLinkControlValue, pascalCase } from '@kubio/utils';
import { edit as editIcon } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
// import { GutentagInputControl as InputControl } from '../input-control';
import { LinkSearchInputControl } from './link-search-input-control';
import SeparatorHorizontalLine from '../separator-horizontal-line';
import { ToggleControl } from '../toggle-control/toggle-control';
import { GutentagInputControl as InputControl } from '../input-control';
import classNames from 'classnames';
import { decodeEntities } from '@wordpress/html-entities';

const getEntityName = (entity) => {
	if (entity?.name) {
		return entity?.name;
	}

	return entity?.title?.rendered;
};

const MenuItemOptions = ({
	onChange,
	item,
	updateLabel = __('Update item', 'kubio'),
	afterUpdateClick = noop,
	displayLabelOption = true,
	isAdd = false,
}) => {
	const convertLinkValue = useTransformLinkControlValue();

	const [state, setState] = useState(item);
	const [isLinkEditing, setIsLinkEditing] = useState(isAdd);
	const [searchValue, setSearchValue] = useState(state.url);
	const suggestionsRef = useRef();

	const toggleLinkEditing = () => {
		setIsLinkEditing(!isLinkEditing);
	};

	const labels = useSelect(
		(select) => {
			if (!state?.id) {
				return {};
			}

			const entity = select('core').getEntityRecord(
				lowerFirst(pascalCase(state.type)),
				state.object,
				state.objectId
			);

			const siteURL = (select('core').getSite()?.url || '')
				.split('://')
				.pop();

			const kind = select('core').getEntity(
				lowerFirst(pascalCase(state.type)),
				state.object
			);

			let label = getEntityName(entity) || state.url;
			let entityLabel = kind?.label || __('Custom link', 'kubio');

			if (
				siteURL &&
				label.indexOf(siteURL) !== -1 &&
				label.indexOf('#') !== -1
			) {
				label = label.split('://').pop();
				label = label.replace(siteURL, '');
				entityLabel = __('Section', 'kubio');
			}

			return {
				entityLabel: decodeEntities(label),
				entityTypeLabel: entityLabel,
			};
		},
		[state]
	);

	const {
		entityLabel = state.url,
		entityTypeLabel = __('Custom link', 'kubio'),
	} = labels ?? {};

	const onLinkValueChange = (newValue) => {
		const transformedValue = convertLinkValue(newValue);

		// do no get the target element from converted link value
		unset(transformedValue, 'target');

		if (!isEmpty(state.label)) {
			unset(transformedValue, 'label');
		}

		const newItem = {
			...state,
			...transformedValue,
		};
		setState(newItem);
	};
	const onLinkSearchChange = (newValue) => {
		onLinkValueChange(newValue);
		setSearchValue(newValue);
	};

	const onSuggestionSelect = (newValue) => {
		setIsLinkEditing(false);
		onLinkValueChange(newValue);
	};

	const onUpdateClick = () => {
		onChange(state);
		afterUpdateClick();
	};

	return (
		<StyleProvider document={document}>
			<div
				className={classNames(
					'kubio-menu-item-options',
					'kubio-control'
				)}
			>
				<BaseControl>
					{displayLabelOption && (
						<BaseControl.VisualLabel>
							{__('Item link', 'kubio')}
						</BaseControl.VisualLabel>
					)}
					<Flex className={'kubio-item-link-flex'}>
						<FlexBlock>
							{!isLinkEditing && (
								<Flex>
									<FlexItem>
										<span
											className={
												'kubio-menu-item-options--entity-label'
											}
										>
											{entityTypeLabel}:
										</span>
									</FlexItem>
									<FlexBlock>
										<Tooltip text={state.url}>
											<a
												target={'_blank'}
												rel={'noreferrer'}
												href={state.url}
												className={
													'kubio-menu-item-options--label'
												}
												onClick={(event) => {
													event.preventDefault();
													toggleLinkEditing();
												}}
											>
												{entityLabel}
											</a>
										</Tooltip>
									</FlexBlock>
								</Flex>
							)}
							{isLinkEditing && (
								<LinkSearchInputControl
									value={searchValue}
									onChange={onLinkSearchChange}
									onSelect={onSuggestionSelect}
									suggestionsPortalContainerRef={
										suggestionsRef
									}
									// eslint-disable-next-line jsx-a11y/no-autofocus
									autoFocus={true}
								/>
							)}
						</FlexBlock>
						<FlexItem>
							<Button
								icon={editIcon}
								label={__('Edit link', 'kubio')}
								isSmall
								isPressed={isLinkEditing}
								className={
									'kubio-menu-item-options--edit-toggle'
								}
								onClick={toggleLinkEditing}
							/>
						</FlexItem>
					</Flex>
				</BaseControl>
				<BaseControl>
					<div ref={suggestionsRef} />
				</BaseControl>
				{displayLabelOption && (
					<>
						<BaseControl>
							<InputControl
								label={__('Item label', 'kubio')}
								value={state.label}
								onChange={(label) => {
									setState({
										...state,
										label,
									});
								}}
							/>
						</BaseControl>
					</>
				)}
				<SeparatorHorizontalLine fit={true} />
				<ToggleControl
					label={__('Open in new tab', 'kubio')}
					value={state.target === '_blank'}
					onChange={(nextValue) => {
						setState({
							...state,
							target: nextValue ? '_blank' : '_self',
						});
					}}
				/>
				<BaseControl>
					<Button
						className={'kubio-button-100'}
						isPrimary
						onClick={onUpdateClick}
					>
						{updateLabel}
					</Button>
				</BaseControl>
			</div>
		</StyleProvider>
	);
};

export { MenuItemOptions };
