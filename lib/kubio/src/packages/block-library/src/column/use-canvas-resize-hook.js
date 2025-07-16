import { useUndoTrapDispatch } from '@kubio/core';
import { useCallback, useMemo, useRef } from '@wordpress/element';
import { get } from 'lodash';
import { ColumnElementsEnum } from './elements';

const columnWidthOptions = {
	local: true,
	styledComponent: ColumnElementsEnum.CONTAINER,
};

const updateResizedWithValue = (dataHelper, nextWidth, parent) => {
	const currentWidth = dataHelper.getStyle(
		'columnWidth',
		{},
		columnWidthOptions
	);
	const unit = get(currentWidth, 'custom.unit', '%');

	if (unit === 'px') {
		dataHelper.setStyle(
			'columnWidth',
			{
				type: 'custom',
				custom: {
					value: parseFloat(nextWidth),
					unit: 'px',
				},
			},
			columnWidthOptions
		);
	} else {
		const parentWidth = parent
			.closest('[data-kubio*="/row"]')
			.getBoundingClientRect().width;

		const nextValue = 100 * (parseFloat(nextWidth) / parentWidth);

		dataHelper.setStyle(
			'columnWidth',
			{
				type: 'custom',
				custom: {
					value: parseFloat(
						(Math.floor(nextValue * 100) / 100).toFixed(2)
					),
					unit: '%',
				},
			},
			columnWidthOptions
		);
	}
};

const useOnResizeChange = (dataHelper) => {
	const dataHelperRef = useRef();
	const containerRef = useRef();
	const applyUndoTrap = useUndoTrapDispatch();

	const currentWidth = dataHelper.getStyle(
		'columnWidth',
		{},
		columnWidthOptions
	);
	const unit = get(currentWidth, 'custom.unit', '%');

	const referance = useMemo(
		() => dataHelper.getStyle('columnWidth', {}, columnWidthOptions),
		[dataHelper]
	);

	dataHelperRef.current = dataHelper;

	const onChange = useCallback(({ current, sibling }) => {
		const currentHelper = dataHelperRef.current;
		const container = containerRef.current;
		let siblingHelper = null;

		if (sibling) {
			const siblingBlockEl = sibling.element?.closest('[data-block]');
			const siblingClientId = siblingBlockEl?.getAttribute('data-block');
			if (siblingClientId) {
				siblingHelper = currentHelper.withClientId(siblingClientId);
			}
		}

		applyUndoTrap(() => {
			updateResizedWithValue(currentHelper, current, container);
			if (siblingHelper) {
				updateResizedWithValue(
					siblingHelper,
					sibling.current,
					container
				);
			}
		});
	}, []);

	return {
		containerRef,
		referance,
		onChange,
		unit,
	};
};

export { useOnResizeChange };
