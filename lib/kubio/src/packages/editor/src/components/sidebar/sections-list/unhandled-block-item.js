import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { cog } from '@wordpress/icons';
import { DeleteItemIcon } from '@kubio/icons';
import { useEffect, useRef } from '@wordpress/element';
import classNames from 'classnames';
import { find } from 'lodash';
import { useHoveredSection } from '../../providers';
import { DragHandle } from './drag-handle';

const UnhandledBlockItem = ({ onRemove, onSelect, item, dataHelper }) => {
	const { blockTypes } = useSelect((select) => ({
		blockTypes: select('core/blocks').getBlockTypes(),
	}));

	const { selectBlock } = useDispatch('core/block-editor');

	const getBlockTitle = (name) => {
		const found = find(blockTypes, { name });
		return found?.title || name;
	};

	const { clientId: hoveredClientId } = useHoveredSection();

	const listItemClass = classNames('kubio-section-list-item', {
		hovered: hoveredClientId === item.clientId,
	});

	const pageSectionRef = useRef();
	useEffect(() => {
		if (hoveredClientId === item.clientId) {
			pageSectionRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest',
			});
		}
	}, [hoveredClientId]);

	return (
		<div ref={pageSectionRef} className={'page-section-item'}>
			<div className={listItemClass}>
				<div className="align-items-center">
					<DragHandle />
				</div>
				<div className={'input-container'}>
					<span className={'input-name'}>
						<span className={'input-name-text'}>
							{getBlockTitle(item.name)}
						</span>
					</span>
				</div>
				{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
				<div
					onClick={() => {
						selectBlock(dataHelper?.clientId);
					}}
					className="page-section-item__select-area"
					role="button"
					tabIndex="0"
				/>
				<div className="align-items-center">
					<Button
						isSmall
						icon={DeleteItemIcon}
						className={'icon-close'}
						onClick={onRemove}
						showTooltip
						tooltipPosition={'top left'}
						label={__('Remove', 'kubio')}
					/>
					<Button
						isSmall
						icon={cog}
						className={'icon-settings'}
						onClick={onSelect}
						showTooltip
						tooltipPosition={'top left'}
						label={__('Settings', 'kubio')}
					/>
				</div>
			</div>
		</div>
	);
};

export { UnhandledBlockItem };
