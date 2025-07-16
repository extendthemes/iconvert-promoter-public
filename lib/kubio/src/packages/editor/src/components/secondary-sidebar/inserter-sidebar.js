/**
 * WordPress dependencies
 */
import { getNamesOfBlocks } from '@kubio/block-library';
import { STORE_KEY } from '@kubio/constants';
import { useOnClickOutside } from '@kubio/core';
import { useBlocksOwnerDocument } from '@kubio/editor-data';
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { useUIVersion } from '@kubio/core-hooks';
import { __experimentalLibrary as Library } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { usePrevious, useViewportMatch } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { close, closeSmall, plus } from '@wordpress/icons';
import { isUndefined } from 'lodash';

const HIDE_INSERTER_CLASS = 'kubio-dragging-from-inserter--active';

const removeSidebarHideClass = () => {
	setTimeout(() => {
		const topBody = top.document.querySelector('body');
		if (topBody.classList.contains(HIDE_INSERTER_CLASS)) {
			topBody.classList.remove(HIDE_INSERTER_CLASS);
		}
	}, 10);
};

const InserterSidebar = () => {
	const { setOpenInserter } = useDispatch(STORE_KEY);

	const { insertionPoint, currentSelectedBlock } = useSelect(
		(select) => ({
			insertionPoint: select(STORE_KEY).getOpenedInserter(),
			currentSelectedBlock:
				select('core/block-editor').getSelectedBlockClientId() || null,
		}),
		[]
	);

	const previousSelectedBlock = usePrevious(currentSelectedBlock);
	const { uiVersion: KUBIO_UI_VERSION } = useUIVersion();

	// V2 UI - hide inserter when block selection changes
	useEffect(() => {
		if (
			KUBIO_UI_VERSION === 2 &&
			previousSelectedBlock !== undefined &&
			previousSelectedBlock !== currentSelectedBlock
		) {
			setOpenInserter(false);
			removeSidebarHideClass();
		}
	}, [previousSelectedBlock, currentSelectedBlock, KUBIO_UI_VERSION]);

	const ownerDocument = useBlocksOwnerDocument();

	const isMobile = useViewportMatch('medium', '<');

	const inserterDialogRef = useRef();

	const onClickOutside = useCallback(
		(event) => {
			if (insertionPoint === false) {
				return;
			}

			// UI V2 button class
			if (
				event.target.closest('.kubio-inserter-button') ||
				event.target.closest('.kubio-sidebar-add-section-button')
			) {
				return;
			}
			if (
				event.target.classList.contains(
					'edit-site-header-toolbar__inserter-toggle'
				) ||
				event.target.closest(
					'.edit-site-header-toolbar__inserter-toggle'
				) ||
				event.target.closest('.kubio-inserter-ignore-click-outisde')
			) {
				return;
			}

			setOpenInserter(false);
		},
		[insertionPoint, setOpenInserter]
	);

	useOnClickOutside(inserterDialogRef, onClickOutside);

	return (
		<div
			ref={inserterDialogRef}
			className="edit-site-editor__inserter-panel"
		>
			<div className="edit-site-editor__inserter-panel-header">
				<Button icon={close} onClick={() => setOpenInserter(false)} />
			</div>
			<div className="edit-site-editor__inserter-panel-content">
				{insertionPoint && (
					<Library
						shouldFocusBlock={isMobile}
						shouldSelectBlock={KUBIO_UI_VERSION === 1}
						rootClientId={insertionPoint?.rootClientId}
						__experimentalInsertionIndex={
							insertionPoint?.insertionIndex
						}
						ownerDocument={ownerDocument}
						insertionPoint={insertionPoint}
						isAppender={insertionPoint?.isAppender}
					/>
				)}
			</div>
		</div>
	);
};

const NamesOfBlocks = getNamesOfBlocks();
const allowedBlocks = [
	'core/column',
	'core/post-content',
	'core/template-part',
	NamesOfBlocks.HEADER,
	NamesOfBlocks.FOOTER,
	NamesOfBlocks.SIDEBAR,
	NamesOfBlocks.COLUMN,
	NamesOfBlocks.LOOP_ITEM,
	NamesOfBlocks.SLIDER_CONTENT,
];

const AddBlockButton = ({
	variant = 'secondary',
	className = 'edit-site-header-toolbar__inserter-toggle',
}) => {
	const { rootClientId, isInserterOpen } = useSelect((select) => {
		const {
			getBlockListSettings,
			getSelectedBlockClientId,
			getBlockRootClientId,
			getBlock,
			getBlockIndex,
		} = select('core/block-editor');

		let rootClientId_ = getSelectedBlockClientId();

		// if block does not accept innerblocks go up
		let currentBlockListSettings = getBlockListSettings(rootClientId_);
		let _insertionIndex;
		if (
			isUndefined(currentBlockListSettings) ||
			currentBlockListSettings.templateLock
		) {
			_insertionIndex = getBlockIndex(rootClientId_);
			rootClientId_ = getBlockRootClientId(rootClientId_);
			currentBlockListSettings = getBlockListSettings(rootClientId_);
		}

		const hasRootClientId =
			rootClientId_ &&
			allowedBlocks.includes(getBlock(rootClientId_)?.name) &&
			(isUndefined(currentBlockListSettings) ||
				!currentBlockListSettings.templateLock);

		return {
			isInserterOpen: select(STORE_KEY).getOpenedInserter(),
			rootClientId: hasRootClientId ? rootClientId_ : null,
			insertionIndex: _insertionIndex,
		};
	}, []);
	const { setOpenInserter } = useDispatch(STORE_KEY);
	const { selectBlock } = useDispatch('core/block-editor');
	const inserterButton = useRef();
	const { uiVersion: KUBIO_UI_VERSION } = useUIVersion();

	const closeInserter = useCallback((event) => {
		// Focusing the inserter button closes the inserter popover

		inserterButton.current.focus();
		event.preventDefault();
		event.stopPropagation();
	}, []);

	const onToggleInserter = useCallback(
		(event) => {
			const nextState = isInserterOpen ? false : 'block-inserter';

			if (KUBIO_UI_VERSION === 2) {
				if (nextState) {
					setOpenInserter('pattern-inserter/content', null);
					removeSidebarHideClass();
				} else {
					closeInserter(event);
					setOpenInserter(false, null);
				}
				return;
			}

			if (nextState) {
				selectBlock(null);
			} else {
				closeInserter(event);
			}
			setOpenInserter(nextState, rootClientId);
			top.document.body.classList.remove(
				'kubio-dragging-from-inserter--active'
			);
		},
		[isInserterOpen, rootClientId]
	);

	const getLabelText = (isOpen) => {
		return isOpen ? __('Close', 'kubio') : __('Add block', 'kubio');
	};

	return (
		<>
			<Button
				ref={inserterButton}
				variant={variant}
				isPressed={isInserterOpen}
				className={className}
				onClick={onToggleInserter}
				icon={isInserterOpen ? closeSmall : plus}
				onMouseDown={(event) => {
					event.preventDefault();
				}}
				label={getLabelText(isInserterOpen)}
			/>
		</>
	);
};

export { AddBlockButton, InserterSidebar };
