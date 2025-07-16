import { ProItem } from '@kubio/pro';
import { CheckboxControl } from '@wordpress/components';
import _ from 'lodash';
import classnames from 'classnames';

const ProCheckboxControl = (props) => {
	return <ProItem tag={CheckboxItem} {...props} />;
};

const CheckboxItem = ({ children, className, onClick, ...props }) => {
	let checkboxAttributes = {};
	checkboxAttributes = {
		disabled: true,
	};
	return (
		<CheckboxControlWrapper className={className} onClick={onClick}>
			<CheckboxControl {...props} {...checkboxAttributes} />
			{children}
		</CheckboxControlWrapper>
	);
};

const CheckboxControlWrapper = ({ children, className, onClick = _.noop }) => {
	return (
		<div
			onClick={onClick}
			className={classnames(
				className,
				'kubio-checkbox-wrapper position-relative'
			)}
		>
			{children}
		</div>
	);
};

export { ProCheckboxControl };
