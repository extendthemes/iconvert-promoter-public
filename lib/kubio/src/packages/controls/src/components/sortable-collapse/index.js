import {
	SortableContainer,
	SortableElement,
	SortableHandle,
} from 'react-sortable-hoc';
import { noop } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faClone } from '@fortawesome/free-solid-svg-icons';
import { dragHandle, Icon } from '@wordpress/icons';
import { Button } from '@wordpress/components';
import { DeleteItemIcon, DuplicateItemIcon } from '@kubio/icons';
import { useState } from '@wordpress/element';
import classnames from 'classnames';
import { CanvasIcon } from '../canvas-icon';

const DragHandle = SortableHandle(() => (
	<Icon icon={dragHandle} className={'kubio-draggable-item'} />
));
const SortableGroupItem = SortableElement(
	({
		item,
		nrItems,
		onRemove = noop,
		onSelect = noop,
		onDuplicate = noop(),
		allowDuplicate,
	}) => {
		const ICON = item?.icon || false;
		return (
			// <div className={'sortable-collapse d-flex'}>
			// 	<DragHandle />
			// 	{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
			// 	<span
			// 		onClick={() => onSelect(item.id)}
			// 		className="sortable-collapse__title"
			// 	>
			// 		{item?.name}
			// 	</span>
			// 	<div className="sortable-collapse__icons align-items-center">
			// 		<FontAwesomeIcon
			// 			onClick={() => onDuplicate(item.id)}
			// 			icon={faClone}
			// 		/>
			// 		{nrItems > 1 && (
			// 			<FontAwesomeIcon
			// 				onClick={() => onRemove(item.id)}
			// 				icon={faTimesCircle}
			// 			/>
			// 		)}
			// 	</div>
			// </div>
			<div
				className={classnames([
					'kubio-sortable-accordion-container',
					{ 'is-selected': item.isSelected },
				])}
				onClick={() => {
					onSelect(item.id);
				}}
			>
				<div className="kubio-sortable-accordion-info">
					<DragHandle />
					<div className={'kubio-sortable-accordion-text'}>
						{ICON && (
							<CanvasIcon
								className={'kubio-sortable-accordion-icon'}
								name={ICON}
							/>
						)}

						{item?.name}
					</div>
				</div>
				<div className="kubio-sortable-acordion-icon-container">
					{allowDuplicate && (
						<Button
							isSmall
							icon={DuplicateItemIcon}
							className={'kubio-sortable-acordion-icon'}
							onClick={() => onDuplicate(item.id)}
						/>
					)}
					{nrItems > 1 && (
						<Button
							isSmall
							icon={DeleteItemIcon}
							className={'kubio-sortable-acordion-icon'}
							onClick={() => onRemove(item.id)}
						/>
					)}
				</div>
			</div>
		);
	}
);

const SortableCollapse = SortableContainer(({ items, ...props }) => {
	const nrItems = items.length;
	return (
		<div>
			{items?.map((item, index) => {
				return (
					<SortableGroupItem
						allowDuplicate
						item={item}
						{...props}
						key={item.id}
						index={index}
						nrItems={nrItems}
					/>
				);
			})}
		</div>
	);
});

export { SortableCollapse };
export default SortableCollapse;
