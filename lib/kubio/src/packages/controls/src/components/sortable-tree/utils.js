export const objectType = (obj) => {
	return Object.prototype.toString.call(obj).slice(8, -1);
};
export const isDefined = (param) => {
	return typeof param !== 'undefined';
};
export const isUndefined = (param) => {
	return typeof param === 'undefined';
};
export const isFunction = (param) => {
	return typeof param === 'function';
};
export const isNumber = (param) => {
	return typeof param === 'number' && !isNaN(param);
};
export const isString = (str) => {
	return objectType(str) === 'String';
};
export const isArray = (arr) => {
	return objectType(arr) === 'Array';
};

export const closest = (target, selector) => {
	// closest(e.target, '.field')
	while (target) {
		if (target.matches && target.matches(selector)) return target;
		target = target.parentNode;
	}
	return null;
};

export const getOffsetRect = (elem) => {
	// (1)
	const box = elem.getBoundingClientRect();

	const body = document.body;
	const docElem = document.documentElement;

	// (2)
	const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
	const scrollLeft =
		window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

	// (3)
	const clientTop = docElem.clientTop || body.clientTop || 0;
	const clientLeft = docElem.clientLeft || body.clientLeft || 0;

	// (4)
	const top = box.top + scrollTop - clientTop;
	const left = box.left + scrollLeft - clientLeft;

	return { top: Math.round(top), left: Math.round(left) };
};

export const getTotalScroll = (elem) => {
	let top = 0;
	let left = 0;

	while ((elem = elem.parentNode)) {
		top += elem.scrollTop || 0;
		left += elem.scrollLeft || 0;
	}

	return { top, left };
};

export const getTransformProps = (x, y) => {
	return {
		transform: 'translate(' + x + 'px, ' + y + 'px)',
	};
};

export const listWithChildren = (list, childrenProp) => {
	return list.map((item) => {
		return {
			...item,
			[childrenProp]: item[childrenProp]
				? listWithChildren(item[childrenProp], childrenProp)
				: [],
		};
	});
};

export const getAllNonEmptyNodesIds = (items, childrenProp) => {
	let childrenIds = [];
	const ids = items
		.filter((item) => item[childrenProp].length)
		.map((item) => {
			childrenIds = childrenIds.concat(
				getAllNonEmptyNodesIds(item[childrenProp], childrenProp)
			);
			return item.id;
		});

	return ids.concat(childrenIds);
};
