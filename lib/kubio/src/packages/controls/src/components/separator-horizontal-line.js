import { BaseControl } from '@wordpress/components';

const SeparatorHorizontalLine = ({ fit = false, className = '' }) => {
	const _className = ['kubio-separator-line', fit ? 'fit' : '', className]
		.filter((item) => item)
		.join(' ');
	return (
		<BaseControl>
			<div className={_className} />
		</BaseControl>
	);
};

export default SeparatorHorizontalLine;
