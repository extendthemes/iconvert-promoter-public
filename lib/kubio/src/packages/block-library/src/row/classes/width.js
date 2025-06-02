import { WidthTypesClasses, WidthTypesEnum } from '../../section/config';

const getRowContainerWidthClasses = (parentWidthType) => {
	const classes = [];
	if (parentWidthType === WidthTypesEnum.BOXED) {
		classes.push(WidthTypesClasses[WidthTypesEnum.BOXED]);
	}
	return classes;
};

export { getRowContainerWidthClasses };
