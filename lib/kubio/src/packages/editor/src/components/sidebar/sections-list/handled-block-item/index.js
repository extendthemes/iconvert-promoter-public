import { useOnClickOutside } from '@kubio/core';
import { useBlocksOwnerDocument } from '@kubio/editor-data';
import { DeleteItemIcon } from '@kubio/icons';
import { getPreviewElementByModelId, getUniqueSlug } from '@kubio/utils';
import { Button } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cog } from '@wordpress/icons';
import _ from 'lodash';
import getSlug from 'speakingurl';
import { useHoveredSection } from '../../../providers';
import { DragHandle } from '../drag-handle';
import { MenuToggleIcon } from './menu-toggle-icon';

const HandledBlockItem = ({ onRemove, onSelect, dataHelper }) => {
	const { selectBlock, toggleBlockHighlight } = useDispatch(
		'core/block-editor'
	);

	const storeId = dataHelper.getAttribute('anchor');
	const storeName = dataHelper.getAttribute('attrs.name');
	const [isClicked, setIsClicked] = useState(false);
	const [currentId, setCurrentId] = useState(storeId);
	const [currentName, setCurrentName] = useState(storeName);
	const ownerDocument = useBlocksOwnerDocument();
	useEffect(() => {
		if (currentId !== storeId) {
			setCurrentId(storeId);
		}
		if (currentName !== storeName) {
			setCurrentName(storeName);
		}
	}, [storeId, storeName]);

	const ref = useRef();
	const containerRef = useRef();

	const setNormalizedSectionId = _.debounce((id) => {
		id = id ? id : currentId;
		let slug = getSlug(id);
		slug = getUniqueSlug(slug, ownerDocument);

		if (!slug) {
			return;
		}
		if (slug !== currentId) {
			setCurrentId(slug);
		}
		if (slug !== storeId) {
			dataHelper.setAttribute('anchor', slug);
		}
	}, 100);

	const { clientId: hoveredClientId } = useHoveredSection();

	const containerStyling = (booleanValue) => {
		const className = ['kubio-section-list-item'];
		if (booleanValue) {
			className.push('list-item-full-height');
		}

		if (hoveredClientId === dataHelper.clientId) {
			className.push('hovered');
		}

		return className.join(' ');
	};

	const onNameChange = (event) => {
		const value = event.target.value;
		setCurrentName(value);
	};
	const onNameInputBlur = () => {
		if (currentName !== storeName) {
			dataHelper.setAttribute('attrs.name', currentName);
			setNormalizedSectionId(currentName);
		}
	};
	const onIdInputBlur = () => {
		if (currentId !== storeId || currentName !== storeName) {
			setNormalizedSectionId();
		}
	};
	const onNameInputsFocus = () => {
		if (!isClicked) {
			setIsClicked(true);
		}
	};
	const onClickOutsideContainer = useCallback(() => {
		if (isClicked) {
			setIsClicked(false);
		}
	}, [isClicked, setIsClicked]);

	const scrollBlockIntoView = (dataHelperBlock) => {
		const clientId = dataHelperBlock?.clientId;
		const node = getPreviewElementByModelId(clientId, ownerDocument);

		if (node) {
			node.scrollIntoView();
		}
		toggleBlockHighlight(clientId, true);
	};

	useOnClickOutside(ref, onClickOutsideContainer);

	return (
		<div ref={containerRef} className={'page-section-item'}>
			<div className={containerStyling(isClicked)}>
				<div className="align-items-center drag-icon">
					<DragHandle />
				</div>
				<div className={'input-container'} ref={ref}>
					<div className="input-drag-text">
						<input
							type={'text'}
							value={currentName}
							className={'input-name'}
							onChange={onNameChange}
							onFocus={(event) => {
								scrollBlockIntoView(dataHelper, event);
								onNameInputsFocus(event);
							}}
							onBlur={onNameInputBlur}
						/>
					</div>

					{isClicked && (
						<div className={'id-div'}>
							ID:#
							<input
								type={'text'}
								value={currentId}
								className={'input-name input-id'}
								onFocus={(event) => {
									scrollBlockIntoView(dataHelper, event);
								}}
								onChange={(event) => {
									setCurrentId(event.target.value);
								}}
								onBlur={onIdInputBlur}
							/>
						</div>
					)}
				</div>
				{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
				<div
					onClick={() => {
						selectBlock(dataHelper?.clientId);
					}}
					className="page-section-item__select-area"
					role={'button'}
					tabIndex={0}
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

					<MenuToggleIcon
						dataHelper={dataHelper}
						containerRef={containerRef}
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

export { HandledBlockItem };
