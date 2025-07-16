/**
 * External dependencies
 */
import {
	useOnClickOutside,
	useOwnerDocumentContext,
	usePopupNestingContext,
} from '@kubio/core';
import {
	ProBadge,
	proItemOnFree,
	proItemOnFreeClass,
	useProModal,
} from '@kubio/pro';
import { createPopper } from '@popperjs/core';
/**
 * Internal dependencies
 */
import { Button, Tooltip } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import {
	createPortal,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
/**
 * WordPress dependencies
 */
import { chevronDown, Icon } from '@wordpress/icons';
import classnames from 'classnames';
import { useSelect } from 'downshift';
import _ from 'lodash';

function CustomSelectControl({
	className,
	label = null,
	options: items,
	placeholder = __('Select…', 'kubio'),
	onChange = _.noop,
	itemRenderer = null,
	disabled = false,
	value,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const popperInstance = useRef();
	const [ProModal, showProModal] = useProModal();
	const { ownerDocument } = useOwnerDocumentContext();
	const anchorRef = useRef();
	const instanceIdClass = useInstanceId(
		CustomSelectControl,
		'CustomSelectControl'
	);

	//we only need to call this hook so it adds it instance id to the popup nesting context. We won't be adding any other
	//popups inside it. Because of that we don't need its return value
	usePopupNestingContext(instanceIdClass);

	const onItemChange = (data) => {
		if (!proItemOnFree(data.selectedItem)) {
			const newValue = _.get(data, 'selectedItem.value');
			onChange(newValue);
			setIsOpen(false);
		} else {
			anchorRef.current = data;
			showProModal(true);
		}
	};

	const itemsWithSubItems = useMemo(() => {
		let elements = [];
		items.forEach((item) => {
			if (item.items && Array.isArray(item.items)) {
				elements = elements.concat(item.items);
				return;
			}
			elements.push(item);
		});

		return elements;
	}, [items]);
	let currentItem = itemsWithSubItems.find((item) => {
		return item.value === value;
	});

	//downshift checks if a prop is undefined than the library will manage the state, sometimes the initial value is undefined
	//but downshift will consider that it needs to handle internal state, but we will manage it from thie component
	//because of this we send the null value for when no item is selected so we can handle state from this block
	if (currentItem === undefined) {
		currentItem = null;
	}

	const {
		getToggleButtonProps,
		getMenuProps,
		getItemProps,
		highlightedIndex,
		selectedItem,
	} = useSelect({
		// initialSelectedItem: itemsWithSubItems[0],
		items: itemsWithSubItems,
		itemToString,
		isOpen,
		onSelectedItemChange: onItemChange,
		selectedItem: currentItem,
		stateReducer,
	});
	const buttonRef = useRef();
	const popperRef = useRef();

	const popoverSlotNode = useMemo(() => {
		return buttonRef.current ? getPopoverSlotNode(buttonRef.current) : null;
	}, [buttonRef.current]);

	const inIframe = useMemo(() => {
		return buttonRef.current
			? getSelectIsInsideIframe(buttonRef.current)
			: false;
	}, [buttonRef.current]);

	const menuProps = getMenuProps(
		{
			className: 'h-select-control__menu',
			'aria-hidden': !isOpen,
		},
		{ suppressRefError: true }
	);
	// We need this here, because the null active descendant is not
	// fully ARIA compliant.
	if (
		menuProps['aria-activedescendant'] &&
		menuProps['aria-activedescendant'].slice(0, 'downshift-null'.length) ===
			'downshift-null'
	) {
		delete menuProps['aria-activedescendant'];
	}
	const buttonWidth = buttonRef.current?.offsetWidth;
	const noItemSelected = selectedItem === undefined || selectedItem === null;
	const onClickOutside = useCallback(
		(e) => {
			if (!e.target && isOpen) {
				setIsOpen(false);
				return;
			}
			const button = e?.target?.closest(
				'.h-select-control__button__container'
			);

			//if the user clicks the toggle button let the button handle the open state
			if (button && button === buttonRef.current) {
				return;
			}
			if (isOpen) {
				setIsOpen(false);
			}
		},
		[isOpen, setIsOpen, buttonRef.current]
	);
	useEffect(() => {
		if (popperInstance.current) {
			popperInstance.current.destroy();
		}
		if (!(popperRef.current && buttonRef.current && isOpen)) {
			return;
		}

		const documentForOverflow = inIframe ? ownerDocument : document;

		const frameElement =
			buttonRef.current?.ownerDocument?.defaultView?.frameElement;

		//remove the last popper
		popperInstance.current?.destroy();

		popperInstance.current = createPopper(
			buttonRef?.current,
			popperRef.current,
			{
				placement: 'bottom-end',
				//strategy: 'fixed',
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: ({ placement }) => {
								if (!inIframe) {
									return [0, 10];
								}

								const iframeRect = frameElement.getBoundingClientRect();

								const skidding = 0;
								let distance = 10;

								if (placement.startsWith('top')) {
									distance = -1 * iframeRect.top + 10;
								}

								if (placement.startsWith('bottom')) {
									distance = iframeRect.top + 10;
								}

								return [iframeRect.left, distance];
							},
						},
					},
					{
						name: 'preventOverflow',
						options: {
							boundary: documentForOverflow,
						},
					},
				],
			}
		);
		return () => {
			if (popperInstance.current) {
				popperInstance.current.destroy();
			}
		};
	}, [popperRef.current, buttonRef.current, isOpen]);
	useOnClickOutside(popperRef, onClickOutside);
	const minWidth = buttonWidth;

	//set a maxWidth so the dropdown menu does not gets too big, if the menu is so much bigger than the button then
	//it probably is a design issue.
	const maxWidth = buttonWidth * 3;

	const popupContent = (
		<div
			ref={popperRef}
			className={classnames('h-select-control__popover', instanceIdClass)}
			style={{
				minWidth: `${minWidth}px`,
				maxWidth: `${maxWidth}px`,
			}}
		>
			<ul {...menuProps}>
				<SelectOptions
					getItemProps={getItemProps}
					itemRenderer={itemRenderer}
					items={items}
					selectedItem={selectedItem}
					highlightedIndex={highlightedIndex}
				/>
			</ul>
		</div>
	);

	return (
		<>
			<div className={classnames('h-select-control', className)}>
				<div className="kubio-select-control__control--wrapper">
					<Tooltip
						text={itemToString(selectedItem) || placeholder}
						position={'top center'}
					>
						<span
							className={'h-select-control__button__container'}
							ref={buttonRef}
						>
							<Button
								{...getToggleButtonProps({
									// This is needed because some speech recognition software don't support `aria-labelledby`.
									'aria-label': label,
									'aria-labelledby': undefined,
									className: classnames([
										'h-select-control__button',
										{
											'h-select-control__button--placeholder': noItemSelected,
										},
									]),
									isSmall: true,
								})}
								disabled={disabled}
								onClick={() => {
									setIsOpen(!isOpen);
								}}
							>
								{noItemSelected && placeholder}
								{!noItemSelected && (
									<span> {itemToString(selectedItem)}</span>
								)}
								<Icon
									icon={chevronDown}
									className="h-select-control__button-icon"
								/>
							</Button>
							<ProModal />
						</span>
					</Tooltip>
				</div>
			</div>

			{isOpen &&
				popoverSlotNode &&
				createPortal(popupContent, popoverSlotNode)}
		</>
	);
}

function SelectOptions(props) {
	const {
		getItemProps,
		itemRenderer,
		items,
		selectedItem,
		highlightedIndex,
		startIndex = 0,
	} = props;
	const getItemContent = (item = {}) => {
		const { label } = item;
		if (itemRenderer && typeof itemRenderer === 'function') {
			return itemRenderer(item);
		}
		return <span className="h-select-control__item-content">{label}</span>;
	};

	let currentIndex = startIndex;
	return items.map((item, index) => {
		const { items: subItems, label } = item;
		if (subItems) {
			const jsx = (
				<ul
					key={`list-${index}`}
					className="h-select-control__item__group"
				>
					<div className="h-select-control__item__group-heading">
						{label}
					</div>
					<SelectOptions
						{...props}
						items={subItems}
						startIndex={currentIndex}
					/>
				</ul>
			);
			currentIndex += subItems.length;
			return jsx;
		}

		const jsx = (
			<li
				key={item.value}
				{...getItemProps({
					index: currentIndex,
					item,
					className: classnames(
						item.className,
						'h-select-control__item',
						{
							'is-highlighted': currentIndex === highlightedIndex,
							'is-active': item?.value === selectedItem?.value,
						},
						proItemOnFreeClass(item)
					),
				})}
			>
				{getItemContent(item)}
				<ProBadge item={item} />
			</li>
		);
		currentIndex++;
		return jsx;
	});
}

function itemToString(item) {
	if (typeof item === 'object') {
		return item?.label;
	}
	return item;
}

// This is needed so that in Windows, where
// the menu does not necessarily open on
// key up/down, you can still switch between
// options with the menu closed.
function stateReducer(
	{ selectedItem, ...rest },
	{ type, changes, props: { items } }
) {
	switch (type) {
		case useSelect.stateChangeTypes.ToggleButtonKeyDownArrowDown:
			// If we already have a selected item, try to select the next one,
			// without circular navigation. Otherwise, select the first item.
			return {
				selectedItem:
					items[
						selectedItem
							? Math.min(
									items.indexOf(selectedItem) + 1,
									items.length - 1
							  )
							: 0
					],
			};
		case useSelect.stateChangeTypes.ToggleButtonKeyDownArrowUp:
			// If we already have a selected item, try to select the previous one,
			// without circular navigation. Otherwise, select the last item.
			return {
				selectedItem:
					items[
						selectedItem
							? Math.max(items.indexOf(selectedItem) - 1, 0)
							: items.length - 1
					],
			};
		default:
			return changes;
	}
}
function getSelectIsInsideIframe(buttonEl) {
	return buttonEl.ownerDocument.defaultView !== top;
}
function getPopoverSlotNode(buttonEl) {
	const rootBaseSlotSelector = 'body';
	let slot = top.document.querySelector(
		`${rootBaseSlotSelector} > .kubio-popper`
	);

	if (!slot) {
		slot = top.document.createElement('div');
		slot.setAttribute('class', 'kubio-popper');
		slot.setAttribute(
			'style',
			'position:absolute;top:0;left:0;z-index:999999997'
		);

		const node =
			top.document.querySelector(rootBaseSlotSelector) ||
			top.document.body;
		node?.append(slot);
	}

	return slot;
}

export { CustomSelectControl };
