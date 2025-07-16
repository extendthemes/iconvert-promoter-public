import { deepmergeAll } from '@kubio/utils';
import { useMemo } from '@wordpress/element';
import _ from 'lodash';
import { useKubioGlobalStyleContext } from './with-global-style/global-style-context';
import { useKubioInheritedStyleContext } from './with-global-style/inherited-style-context';

const getInheritableStyle = (dataHelper, options) => {
	const typography = dataHelper.getStyle(
		'typography',
		{},
		{
			...options,
			styledComponent: dataHelper.defaultStyledComponent,
		}
	);

	const textAlign = dataHelper.getStyle('textAlign', null, {
		...options,
		styledComponent: dataHelper.defaultStyledComponent,
	});

	return _.pickBy(
		{
			typography,
			textAlign,
		},
		_.identity
	);
};

const useGlobalStyleInherited = () => {
	const generalDataStyle = useKubioGlobalStyleContext();

	let typography = {};

	if (!_.isEmpty(generalDataStyle)) {
		typography = generalDataStyle.globalStyle.getStyle(
			'typography',
			{},
			{ styledComponent: 'body' }
		);
	}

	const style = useMemo(() => {
		return {
			typography,
		};
	}, [typography]);

	return {
		style,
	};
};

const useInheritedTypographyValue = (elementType = '', path = '') => {
	let globalStyle = useGlobalStyleInherited();
	globalStyle = globalStyle.style;

	const inherited = useKubioInheritedStyleContext();

	const finalStyle = useMemo(() => {
		return deepmergeAll([{}, globalStyle, inherited]);
	}, [globalStyle, inherited]);

	// Build and get typo value
	const typo = _.get(
		finalStyle,
		_.filter(
			['typography', elementType ? 'holders' : '', elementType, path],
			_.identity
		).join('.'),
		{}
	);

	return typo;
};

const useGlobalFormStyleInherited = (options = {}) => {
	const generalDataStyle = useKubioGlobalStyleContext();

	//let the component pass the styled component. Because in most cases you'll want to get only one styled component.
	const formStyle = generalDataStyle.globalStyle.getStyle('', {}, options);

	const style = useMemo(() => {
		return formStyle;
	}, [formStyle]);

	return style;
};

const useInheritedTextAlign = () => {
	const inherited = useKubioInheritedStyleContext();
	return _.get(inherited, 'textAlign');
};

export {
	getInheritableStyle,
	useInheritedTypographyValue,
	useInheritedTextAlign,
	useGlobalStyleInherited,
	useGlobalFormStyleInherited,
};
