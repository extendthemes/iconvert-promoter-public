import { ProItem } from '@kubio/pro';
import { RadioControl } from '@wordpress/components';
import _ from 'lodash';
import classnames from 'classnames';

const ProRadioControl = (props) => {
	return <ProItem tag={RadioControlItem} {...props} />;
};

const RadioControlItem = ({
	children,
	className,
	onClick,
	urlArgs,
	...props
}) => {
	let checkboxAttributes = {};
	checkboxAttributes = {
		disabled: true,
	};
	return (
		<RadioControlWrapper className={className} onClick={onClick}>
			<RadioControl {...props} {...checkboxAttributes} />
			{children}
		</RadioControlWrapper>
	);
};

const RadioControlWrapper = ({ children, className, onClick = _.noop }) => {
	return (
		<div
			onClick={onClick}
			className={classnames(
				className,
				'kubio-radio-control-wrapper position-relative'
			)}
		>
			{children}
		</div>
	);
};

export { ProRadioControl };
