import { STORE_KEY } from '@kubio/constants';
import { useOwnerDocumentContext } from '@kubio/core';
import {
	BlockList,
	InnerBlocks,
	Inserter,
	store as blockEditorStore,
	useBlockEditContext,
} from '@wordpress/block-editor';
import { Popover } from '@wordpress/components';
import { useThrottle } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	createPortal,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	useContext,
} from '@wordpress/element';
import classNames from 'classnames';
import { first, last } from 'lodash';

const EDGE_THRESHOLD = 15;

const useOwnerDocument = () => {
	const element = useContext(BlockList.__unstableElementContext);
	return element?.ownerDocument;
};

const useKubioBlockAppender = ({
	clientId,
	isInserterForced,
	setIsInserterForced,
}) => {
	const [state, setState] = useState({
		display: false,
		edge: '',
		anchorRect: {},
	});

	const [isHovered, setIsHovered] = useState(false);
	const ownerDocument = useOwnerDocument();
	const blockListLayout = useRef();
	const { orientation } = useSelect(
		(select) => {
			const { getBlockListSettings } = select(blockEditorStore);

			return {
				orientation:
					getBlockListSettings(clientId)?.orientation || 'vertical',
			};
		},
		[clientId]
	);

	useEffect(() => {
		const blockElementListLayout = ownerDocument?.querySelector(
			`[data-block="${clientId}"]`
		);
		if (blockElementListLayout) {
			if (
				blockElementListLayout.classList.contains(
					'block-editor-block-list__layout'
				)
			) {
				blockListLayout.current = blockElementListLayout;
			} else {
				blockListLayout.current = blockElementListLayout.querySelector(
					'.block-editor-block-list__layout'
				);
			}
		}
	}, [clientId, ownerDocument]);

	const tempState = useRef({ edge: null, display: null });
	const updateState = useCallback(
		(nextState) => {
			if (isInserterForced) {
				return;
			}

			const { display = false } = nextState;
			if (!display) {
				setState({
					display,
					edge: '',
					anchorRect: {},
				});
				tempState.current = { edge: '', display };
				return;
			}

			if (
				nextState.edge !== tempState.current.edge ||
				nextState.display !== tempState.current.display
			) {
				setState({
					...nextState,
					anchorRect: {
						...nextState.anchorRect,
						width:
							nextState.anchorRect.right -
							nextState.anchorRect.left,
					},
				});
				tempState.current = {
					edge: nextState.edge,
					display: nextState.display,
				};
			}
		},
		[isInserterForced]
	);

	const setCurrentInserterPosition = useCallback(
		(event, target, currentTarget) => {
			const closestBlockList = target?.closest
				? target?.closest('.block-editor-block-list__layout')
				: target?.parentNode?.closest(
						'.block-editor-block-list__layout'
				  );

			const closestBlockClientId = closestBlockList
				?.closest('[data-block]')
				.getAttribute('data-block');

			// shift is for cases when appenders are two close ( e.g. https://www.screencast.com/t/B3PHxFDSRTj8 )
			let shift = 0;
			const anotherInserterIsShown =
				closestBlockClientId &&
				// eslint-disable-next-line no-undef
				!!top.document.querySelector('.kubio-appender') &&
				// eslint-disable-next-line no-undef
				top.document
					.querySelector('.kubio-appender')
					.getAttribute('data-kubio-inserter') ===
					closestBlockClientId;

			if (anotherInserterIsShown && clientId !== closestBlockClientId) {
				shift = 10;
			}

			const elChildren = currentTarget.children;

			const listLayoutRect = currentTarget.getBoundingClientRect();
			// eslint-disable-next-line no-unused-vars
			const offsetLeft = event.clientX - listLayoutRect.left;

			const firstChildRect = elChildren.item(0).getBoundingClientRect();
			const lastChildRect = elChildren
				.item(elChildren.length - 1)
				.getBoundingClientRect();

			const firstChildTop = firstChildRect.top - listLayoutRect.top;
			const lastChildBottom = lastChildRect.bottom - listLayoutRect.top;
			const mouseTop = event.clientY - listLayoutRect.top;
			const mouseTopRelativeToFirstChild = mouseTop - firstChildTop;

			// set threshold between 5 and EDGE_THRESHOLD depending on the height of block-editor-block-list__layout
			// if height < 100 - use 10 else use EDGE_THRESHOLD
			const threshold = Math.min(
				Math.max(5, listLayoutRect.height / 3),
				EDGE_THRESHOLD
			);

			if (orientation === 'vertical') {
				if (mouseTopRelativeToFirstChild <= threshold) {
					updateState({
						display: true,
						edge: 'top',
						anchorRect: {
							top: firstChildRect.top - 15 - shift,
							left: firstChildRect.left,
							right: firstChildRect.right,
							bottom: firstChildRect.top - 10 - shift,
						},
					});
				} else if (threshold >= lastChildBottom - mouseTop) {
					updateState({
						display: true,
						edge: 'bottom',
						anchorRect: {
							top:
								lastChildRect.top +
								lastChildRect.height -
								5 +
								shift,
							left: lastChildRect.left,
							right: lastChildRect.right,
							bottom:
								lastChildRect.top +
								lastChildRect.height +
								shift,
						},
					});
				} else {
					updateState({
						display: false,
					});
				}
			}

			if (orientation === 'horizontal') {
				// eslint-disable-next-line no-console
				console.warn('Kubio - not yet ready. Do we really need it');
				updateState({
					display: false,
				});
			}
		},
		[updateState]
	);

	const handleMouseMove = useCallback(
		(event) => {
			if (!isHovered) {
				updateState({
					display: false,
				});
				return;
			}

			if (isInserterForced) {
				return;
			}

			// `currentTarget` is only available while the event is being
			// handled, so get it now and pass it to the thottled function.
			// https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget
			setCurrentInserterPosition(
				event,
				event.target,
				event.currentTarget
			);
		},
		[isHovered, isInserterForced]
	);

	const onDocumentMouseMove = useCallback(
		(event) => {
			const nextValue = blockListLayout?.current.contains(event.target);

			if (isInserterForced) {
				return;
			}

			if (!isHovered && nextValue) {
				setIsHovered(true);
			}

			if (isHovered && !nextValue) {
				setIsHovered(false);
				updateState({
					display: false,
				});
			}
		},
		[blockListLayout, isHovered, isInserterForced]
	);

	const onDocumentClickOutside = useCallback(
		(event) => {
			if (!blockListLayout.current.contains(event.target)) {
				setIsInserterForced(false);
			}
		},
		[blockListLayout]
	);

	const onDocumentScroll = useThrottle(
		useCallback(() => {
			if (state.display) {
				setIsHovered(false);
				updateState({
					display: false,
				});
			}
		}, [state, setIsHovered, updateState]),
		100
	);

	useEffect(() => {
		if (state.display) {
			ownerDocument.defaultView?.addEventListener(
				'scroll',
				onDocumentScroll
			);
		} else {
			ownerDocument.defaultView?.removeEventListener(
				'scroll',
				onDocumentScroll
			);
		}

		return () =>
			ownerDocument.defaultView?.removeEventListener(
				'scroll',
				onDocumentScroll
			);
	}, [state, ownerDocument]);

	useEffect(() => {
		if (blockListLayout.current) {
			const element = blockListLayout.current;
			element.addEventListener('mousemove', handleMouseMove);

			return () => {
				element.removeEventListener('mousemove', handleMouseMove);
			};
		}
	}, [blockListLayout, handleMouseMove]);

	const onBlockDragStart = useCallback((event) => {
		if (
			event.target.closest &&
			!event.target.closest('.block-editor-block-mover')
		) {
			return;
		}

		updateState({
			display: false,
		});
	}, []);

	useEffect(() => {
		if (blockListLayout.current && ownerDocument) {
			ownerDocument.addEventListener('mousemove', onDocumentMouseMove);
			ownerDocument.addEventListener('click', onDocumentClickOutside);

			window.document.addEventListener('dragstart', onBlockDragStart);

			return () => {
				ownerDocument.removeEventListener(
					'mousemove',
					onDocumentMouseMove
				);

				ownerDocument.removeEventListener(
					'click',
					onDocumentClickOutside
				);

				window.document.removeEventListener(
					'dragstart',
					onBlockDragStart
				);
			};
		}
	}, [ownerDocument, onDocumentMouseMove, onDocumentClickOutside]);

	return useMemo(
		() => ({
			...state,
			blockListLayout: blockListLayout.current,
			orientation,
		}),
		[state]
	);
};

const KubioAppender = ({ clientId: rootClientId }) => {
	const [isInserterForced, setIsInserterForced] = useState(false);
	const ownerDocument = useOwnerDocument();
	const { isTyping, isBlockInsertionPointVisible } = useSelect((select) => {
		const {
			isTyping: _isTyping,
			isBlockInsertionPointVisible: _isBlockInsertionPointVisible,
		} = select(blockEditorStore);
		return {
			isTyping: _isTyping(),
			isBlockInsertionPointVisible: _isBlockInsertionPointVisible(),
		};
	}, []);

	const { hideInsertionPoint } = useDispatch(blockEditorStore);

	const { orientation, ...appenderState } = useKubioBlockAppender({
		clientId: rootClientId,
		isInserterForced,
		setIsInserterForced,
	});

	const getAnchorRect = useCallback(() => appenderState.anchorRect, [
		appenderState.anchorRect,
	]);

	const updateisInserterForced = useCallback(
		(value) => {
			setIsInserterForced(value);
		},
		[setIsInserterForced]
	);

	const { getChildrenIds } = useSelect(
		(select) => {
			return {
				getChildrenIds: () =>
					select(blockEditorStore).getBlockOrder(rootClientId),
			};
		},
		[rootClientId]
	);

	const style = useMemo(() => {
		if (orientation === 'vertical') {
			return {
				width: appenderState?.anchorRect?.width,
				height: 16,
			};
		}

		return {
			width: 26,
			height: 30,
		};
	}, [appenderState, orientation]);

	const kubioInsertPosition = useMemo(() => {
		const { edge } = appenderState;

		switch (edge) {
			case 'top':
			case 'left':
				return 'begin';

			case 'bottom':
			case 'right':
				return 'end';
		}
	}, [appenderState]);

	const clientId = useMemo(() => {
		if (kubioInsertPosition === 'begin') {
			return first(getChildrenIds());
		}
		return last(getChildrenIds());
	}, [kubioInsertPosition, getChildrenIds()]);

	const ref = useRef();
	const onFocus = (event) => {
		// Only handle click on the wrapper specifically, and not an event
		// bubbled from the inserter itself.
		if (event.target !== ref.current) {
			setIsInserterForced(true);
		}
	};

	useEffect(() => {
		const isQuickInserterOpened = !!window.document.querySelector(
			'.block-editor-inserter__quick-inserter'
		);
		if (
			appenderState.display &&
			isBlockInsertionPointVisible &&
			!isQuickInserterOpened
		) {
			hideInsertionPoint();
		}
	}, [
		appenderState.display,
		isBlockInsertionPointVisible,
		hideInsertionPoint,
	]);

	const content = !isTyping && appenderState.display && (
		<Popover
			noArrow
			animate={false}
			getAnchorRect={getAnchorRect}
			focusOnMount={false}
			className="block-editor-block-list__insertion-point-popover"
			__unstableSlotName="block-toolbar"
		>
			<div
				onFocus={onFocus}
				ref={ref}
				tabIndex={-1}
				className={classNames(
					'block-editor-block-list__insertion-point',
					'is-with-inserter',
					'kubio-appender',
					'is-' + orientation
				)}
				data-kubio-inserter={rootClientId}
				style={style}
			>
				<div className="block-editor-block-list__insertion-point-indicator" />

				<div
					className={classNames(
						'block-editor-block-list__insertion-point-inserter'
					)}
				>
					<Inserter
						position="bottom center"
						kubioInsertPosition={kubioInsertPosition}
						rootClientId={rootClientId}
						clientId={clientId}
						__experimentalIsQuick
						onToggle={updateisInserterForced}
						onSelectOrClose={() => updateisInserterForced(false)}
					/>
				</div>
			</div>
		</Popover>
	);

	if (!ownerDocument?.body) {
		return <></>;
	}

	/**
	 *  move evryting to body - to make sure there is nothing left on block list area
	 */
	return ownerDocument && createPortal(content, ownerDocument.body);
};

const KubioBlockAppender = ({
	clientId: _clientId,
	showSeparator,
	isFloating,
	onAddBlock,
}) => {
	const { clientId: contextClientId } = useBlockEditContext();
	const { ownerDocument } = useOwnerDocumentContext();
	const [enableKubioAppender, toggleEnableKubioAppender] = useState(false);

	const clientId = useMemo(() => _clientId || contextClientId, [
		_clientId,
		contextClientId,
	]);

	const onMouseMove = useCallback(
		(event) => {
			// fix closest on Firefox (text nodes in FF don't have the closest fn )
			const closestBlock = event.target?.closest
				? event.target?.closest('[data-block]')
				: event.target?.parentNode?.closest('[data-block]');
			const isCurrentBlock =
				closestBlock?.getAttribute('data-block') === clientId;

			if (!isCurrentBlock && enableKubioAppender) {
				toggleEnableKubioAppender(false);
			} else if (isCurrentBlock && !enableKubioAppender) {
				toggleEnableKubioAppender(true);
			}
		},
		[ownerDocument, clientId]
	);

	useEffect(() => {
		// eslint-disable-next-line no-undef
		if (ownerDocument === top.document) {
			return;
		}

		ownerDocument?.addEventListener('mousemove', onMouseMove);

		return () =>
			ownerDocument?.removeEventListener('mousemove', onMouseMove);
	}, [ownerDocument, onMouseMove]);

	const { isEmpty, isGutentagEditor } = useSelect(
		(select) => {
			const innerBlocks = select(blockEditorStore).getBlocks(clientId);
			const gutentagStore = select(STORE_KEY);

			return {
				isEmpty: innerBlocks.length === 0,
				isGutentagEditor: !!gutentagStore,
			};
		},
		[clientId]
	);

	if (isEmpty) {
		return (
			<div className={classNames('block-list-appender', 'wp-block')}>
				<InnerBlocks.ButtonBlockAppender
					clientId={clientId}
					showSeparator={showSeparator}
					isFloating={isFloating}
					onAddBlock={onAddBlock}
				/>
			</div>
		);
	}

	if (!isGutentagEditor) {
		return (
			<InnerBlocks.DefaultBlockAppender
				clientId={clientId}
				showSeparator={showSeparator}
				isFloating={isFloating}
				onAddBlock={onAddBlock}
			/>
		);
	}

	return (
		<>
			{enableKubioAppender && (
				<KubioAppender
					clientId={clientId}
					showSeparator={showSeparator}
					isFloating={isFloating}
					onAddBlock={onAddBlock}
				/>
			)}
		</>
	);
};

KubioBlockAppender.displayName = 'KubioBlockAppender';

export { KubioBlockAppender };
