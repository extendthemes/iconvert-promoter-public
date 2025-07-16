import { Button, Flex, FlexBlock, FlexItem } from '@wordpress/components';
import {
	dragHandle,
	Icon,
	lineSolid,
	plusCircleFilled,
} from '@wordpress/icons';
import { Component } from '@wordpress/element';
import classnames from 'classnames';
import { noop } from 'lodash';

class NestableItem extends Component {
	render() {
		const {
			item,
			isCopy,
			options,
			index,
			collapsable,
			itemsNo,
			active = false,
			isActive = noop,
		} = this.props;
		const { dragItem, renderItem, handler, childrenProp } = options;

		const isCollapsed = options.isCollapsed(item);
		const isDragging = !isCopy && dragItem && dragItem.id === item.id;
		const hasChildren = item[childrenProp] && item[childrenProp].length > 0;

		let rowProps = {};
		let handlerProps = {};
		let Handler;

		if (!isCopy) {
			if (dragItem) {
				rowProps = {
					...rowProps,
					onMouseEnter: (e) => options.onMouseEnter(e, item),
				};
			} else {
				handlerProps = {
					...handlerProps,
					draggable: true,
					onDragStart: (e) => options.onDragStart(e, item),
				};
			}
		}

		if (handler) {
			Handler = (
				<div className="nestable-item-handler" {...handlerProps}>
					<Icon size={14} icon={dragHandle} />
				</div>
			);
		} else {
			rowProps = {
				...rowProps,
				...handlerProps,
			};
		}

		const collapseIcon =
			collapsable && hasChildren ? (
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events
				<Button
					onClick={() => options.onToggleCollapse(item)}
					icon={isCollapsed ? plusCircleFilled : lineSolid}
					iconSize={16}
					isSmall
				/>
			) : null;

		const baseClassName = 'nestable-item';
		const itemProps = {
			className: classnames(
				baseClassName,
				baseClassName + '-' + item.id,
				{
					[baseClassName + '-copy']: isCopy,
					'nestable-is-dragging': isDragging,
					[baseClassName + '--with-children']: hasChildren,
					[baseClassName + '--children-open']:
						hasChildren && !isCollapsed,
					[baseClassName + '--children-collapsed']:
						hasChildren && isCollapsed,
					'has-next-items': index + 1 < itemsNo,
				}
			),
		};

		const content = renderItem({
			item,
			collapseIcon,
			index,
			className: 'nestable-item-container',
		});

		if (!content) return null;

		return (
			<li {...itemProps}>
				{hasChildren && !isCollapsed && (
					<div className={'nestable-item-name--children-linkage'} />
				)}
				<div className={'nestable-item-name--leaf-link'} />
				<div className="nestable-item-name" {...rowProps}>
					<Flex
						className={classnames('nestable-item-container', {
							'nestable-item-container--active': isActive(item),
						})}
					>
						{Handler && (
							<FlexItem className={'nestable-handler-container'}>
								{Handler}
							</FlexItem>
						)}
						{collapseIcon && (
							<FlexItem className={'nestable-collapse-container'}>
								{collapseIcon}
							</FlexItem>
						)}
						<FlexBlock>{content}</FlexBlock>
					</Flex>
				</div>

				{hasChildren && !isCollapsed && (
					<ol className="nestable-list">
						{item[childrenProp].map((subItem, i) => {
							return (
								<NestableItem
									key={i}
									index={i}
									itemsNo={item[childrenProp].length}
									item={subItem}
									options={options}
									isCopy={isCopy}
									isActive={isActive}
								/>
							);
						})}
					</ol>
				)}
			</li>
		);
	}
}

export default NestableItem;
