import { STORE_KEY as KUBIO_STORE_KEY } from '@kubio/constants';
import { isKubioEditor, useDeepMemo } from '@kubio/core';
import { useBlockProps } from '@wordpress/block-editor';
import { useDebounce, useInstanceId } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import classnames from 'classnames';
import _ from 'lodash';
import { TemplateLockPopup } from '../template-lock-popup';
import { useTemplatePartLock } from '../utils';

const TemplatePartOverlay = (props) => {
	const {
		templatePart,
		children,
		clientId,
		initialLockOverlay = true,
		isNavigation = false,
		isStickyNav = false,
		stickyPadding = {},
		from,
	} = props;
	const { isUnlocked } = useTemplatePartLock(templatePart);
	const [isHovered, setIsHovered] = useState(false);
	const [isWizardShown, setIsWizardShown] = useState(false);
	const [position, setPosition] = useState('center center');
	const disabled = isNavigation && !isStickyNav;
	const instanceId = useInstanceId(
		TemplatePartOverlay,
		'kubio-template-part-overlay'
	);
	const containerClass = classnames('h-template-part-overlay__container', {
		'h-template-part-overlay__container--hovered': isHovered && !disabled,
	});

	const ref = useRef();
	const contentRef = useRef();
	//For a smooth transition we render the overlay even if it's disabled. Because if we rendered the children the same
	//as when it's unlocked the header/footer would have been rerendered from scratch and it would have been an ugly transition
	const [disableLockOverlay, setDisableLockOverlay] = useState(
		initialLockOverlay
	);
	const { clearSelectedBlock } = useDispatch('core/block-editor');

	const {
		shouldShowLockOverly,
		elementOrDescendantsSelected,
		currentPageId,
	} = useSelect((select) => {
		const { getSelectedBlockClientId, getBlockParents } = select(
			'core/block-editor'
		);
		const { getPage = _.noop } = select(KUBIO_STORE_KEY) || {};
		const selectedClientId = getSelectedBlockClientId();
		const selectedBlockParents = getBlockParents(selectedClientId);

		const isSelected = selectedClientId === clientId;
		const descendantIsSelected = selectedBlockParents?.includes(clientId);
		const elementOrDescendantsSelected = isSelected || descendantIsSelected;
		const shouldShowLockOverly = elementOrDescendantsSelected;

		const currentPage = getPage();
		const currentPageId = _.get(currentPage, ['context', 'postId']);

		return {
			elementOrDescendantsSelected,
			shouldShowLockOverly,
			currentPageId,
		};
	}, []);

	useEffect(() => {
		setPosition(calculatePosition(ref.current));
	}, [ref.current]);

	//workout for page change. This all isHovered logic needs a solid refactoring because it's so buggy because of the
	//sticky nav.
	useEffect(() => {
		if (elementOrDescendantsSelected && isHovered && !isUnlocked) {
			clearSelectedBlock();
		}
	}, [elementOrDescendantsSelected, isUnlocked, disableLockOverlay]);

	useEffect(() => {
		if (!disableLockOverlay) {
			setDisableLockOverlay(initialLockOverlay);
		}
	}, [currentPageId]);

	useEffect(() => {
		if (!isUnlocked && shouldShowLockOverly && disableLockOverlay) {
			setDisableLockOverlay(false);
			clearSelectedBlock();
			setIsHovered(true);
		}
	}, [shouldShowLockOverly]);

	useEffect(() => {
		if (
			elementOrDescendantsSelected &&
			isUnlocked &&
			!disableLockOverlay &&
			!isHovered
		) {
			setIsHovered(true);
		}
	}, [elementOrDescendantsSelected, isUnlocked, disableLockOverlay]);

	const getIsPartOfOverlay = useCallback(
		(node, nativeEvent) => {
			if (!node) {
				return false;
			}
			let isPartOfOverlay =
				ref.current?.isSameNode(node) ||
				ref.current?.contains(node) ||
				node?.closest?.(
					[
						`[data-kubio-template-overlay="${instanceId}-overalay"]`,
						`.${instanceId}-popover`,
					].join(',')
				);
			if (
				!isPartOfOverlay &&
				node?.classList?.contains('kubio-iframe') &&
				['dragenter', 'dragleave'].includes(nativeEvent?.type)
			) {
				isPartOfOverlay = true;
			}
			return !!isPartOfOverlay;
		},
		[instanceId]
	);

	const onMouseOverLogic = useDebounce(
		useCallback(
			(nativeEvent) => {
				const isPartOfOverlayRelated = getIsPartOfOverlay(
					nativeEvent?.target,
					nativeEvent
				);
				if (!isPartOfOverlayRelated) {
					return;
				}

				setPosition(calculatePosition(ref.current));
				setIsHovered(true);
			},
			[disableLockOverlay, setPosition, setIsHovered, getIsPartOfOverlay]
		),
		100
	);

	const onMouseOutLogic = useDebounce(
		useCallback(
			(nativeEvent) => {
				const isPartOfOverlayRelated = getIsPartOfOverlay(
					nativeEvent?.relatedTarget,
					nativeEvent
				);

				if (isPartOfOverlayRelated) {
					//|| !nativeEvent?.relatedTarget) {
					return;
				}
				//	console.log('onMouseOut logic', nativeEvent.relatedTarget);
				setIsHovered(false);
			},
			[getIsPartOfOverlay, setIsHovered, disableLockOverlay]
		),
		100
	);

	const onMouseOver = useCallback(
		(e) => {
			const nativeEvent = e?.nativeEvent ? e?.nativeEvent : e;

			if (disabled || disableLockOverlay) {
				return;
			}

			// console.log(
			// 	'onMouseOver',
			// 	from,
			// 	nativeEvent?.type,
			// 	nativeEvent.target
			// );
			onMouseOutLogic.cancel();
			nativeEvent.preventDefault();
			nativeEvent.stopPropagation();
			nativeEvent?.stopImmediatePropagation();
			onMouseOverLogic(nativeEvent);
		},
		[onMouseOverLogic, onMouseOutLogic, disabled, disableLockOverlay]
	);

	const onMouseOut = useCallback(
		(e) => {
			if (disabled || disableLockOverlay) {
				return;
			}
			const nativeEvent = e?.nativeEvent ? e?.nativeEvent : e;
			// console.log(
			// 	'onMouseOut',
			// 	from,
			// 	nativeEvent?.type,
			// 	nativeEvent.relatedTarget
			// );
			onMouseOverLogic.cancel();
			nativeEvent.preventDefault();
			nativeEvent.stopPropagation();
			nativeEvent?.stopImmediatePropagation();
			onMouseOutLogic(nativeEvent);
		},
		[onMouseOutLogic, onMouseOverLogic, disabled, onMouseOverLogic]
	);

	const onDragEnter = useCallback(
		(e) => {
			const nativeEvent = e?.nativeEvent ? e?.nativeEvent : e;

			//if you drag over a template part that is not showing overlay yet then start showing the overlay
			if (
				disableLockOverlay &&
				!disabled &&
				nativeEvent?.type === 'dragenter'
			) {
				nativeEvent.stopPropagation();
				nativeEvent?.stopImmediatePropagation();
				setDisableLockOverlay(false);
				setPosition(calculatePosition(ref.current));
				setIsHovered(true);
				onMouseOutLogic.cancel();
			}

			if (disabled || disableLockOverlay) {
				return;
			}
			nativeEvent.stopPropagation();
			nativeEvent?.stopImmediatePropagation();

			if (isHovered) {
				return;
			}
			setPosition(calculatePosition(ref.current));
			setIsHovered(true);
		},
		[disableLockOverlay, disabled, isHovered, setPosition, setIsHovered]
	);

	const onDragEnd = useCallback(
		(e) => {
			if (disabled || disableLockOverlay || !isHovered) {
				return;
			}
			setIsHovered(false);
		},
		[disableLockOverlay, disabled, isHovered]
	);

	useEffect(() => {
		if (isHovered && isNavigation && !isStickyNav) {
			setIsHovered(false);
		}
	}, [isNavigation, isStickyNav]);

	useEffect(() => {
		const node = ref.current;
		if (node && isNavigation) {
			node.addEventListener('mouseover', onMouseOver, true);
			node.addEventListener('mouseout', onMouseOut, true);
		}

		return () => {
			const node = ref.current;
			if (node && isNavigation) {
				node.removeEventListener('mouseover', onMouseOver, true);
				node.removeEventListener('mouseout', onMouseOut, true);
			}
		};
	}, [ref.current, isNavigation, onMouseOver, onMouseOut]);

	useEffect(() => {
		const node = ref.current;
		if (node && isNavigation) {
			node.addEventListener('dragenter', onDragEnter, true);
		}
		document.addEventListener('dragend', onDragEnd, true);

		return () => {
			const node = ref.current;
			if (node && isNavigation) {
				node.removeEventListener('dragenter', onDragEnter, true);
			}

			document.removeEventListener('dragend', onDragEnd, true);
		};
	}, [ref.current, isNavigation, onDragEnter, onDragEnd]);

	const style = useDeepMemo(() => {
		return computeStickyPadding(stickyPadding);
	}, [stickyPadding]);

	const commonProps = {
		className: containerClass,
		style,
		'data-kubio-template-overlay': `${instanceId}-overalay`,
		ref,
	};

	let containerProps = {};

	if (!isNavigation) {
		let eventsListeners = {
			onMouseOver,
			onMouseOut,
		};
		if (!isNavigation) {
			eventsListeners = {
				...eventsListeners,
				onDragEnter,
			};
		}
		const blockProps = useBlockProps({
			...eventsListeners,
			...commonProps,
		});
		containerProps = blockProps;
	} else {
		containerProps = commonProps;
	}

	function onClose() {
		setIsHovered(false);
	}

	if (isUnlocked || !isKubioEditor()) {
		return children;
	}

	return (
		<div {...containerProps}>
			<div className="h-template-part-overlay__content">{children}</div>
			{!disableLockOverlay && (
				<div className="h-template-part-overlay">
					<div className="h-template-part-overlay__controls">
						<TemplateLockPopup
							isHovered={isHovered && !disabled}
							position={position}
							instanceId={instanceId}
							onMouseOver={onMouseOver}
							onMouseOut={onMouseOut}
							onDragEnter={onDragEnter}
							{...props}
							isWizardShown={isWizardShown}
							setIsWizardShown={setIsWizardShown}
							onClose={onClose}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

const preventDefaults = (event) => {
	event.preventDefault();
	event.stopPropagation();
};
function computeStickyPadding(stickyPadding) {
	const style = {};
	if (!_.isEmpty(stickyPadding)) {
		const sides = ['top', 'bottom', 'left', 'right'];
		sides.forEach((side) => {
			const sideStyle = _.get(stickyPadding, side);
			const value = _.get(sideStyle, 'value');
			const unit = _.get(sideStyle, 'unit');
			if (value !== undefined && unit !== undefined) {
				const cssValue = `${value}${unit}`;
				const marginCssProperty = `margin${_.capitalize(side)}`;
				const paddingCssProperty = `padding${_.capitalize(side)}`;
				_.set(style, marginCssProperty, `-${cssValue}`);
				_.set(style, paddingCssProperty, `${cssValue}`);
			}
		});
	}

	return style;
}
const calculatePosition = (element) => {
	if (!element) {
		return 'center center';
	}
	const rect = element.getBoundingClientRect();
	const pageHeight = element.ownerDocument.documentElement.getBoundingClientRect()
		.height;
	if (rect.height >= 400) {
		return 'bottom center';
	}

	// is at the document end
	if (rect.top + rect.height + 10 >= pageHeight) {
		return 'top center';
	}

	return 'top center';
};
export { TemplatePartOverlay, calculatePosition, preventDefaults };
