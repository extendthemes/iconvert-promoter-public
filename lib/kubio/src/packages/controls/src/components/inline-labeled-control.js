import { BaseControl } from '@wordpress/components';

const InlineLabeledControl = ({ label, children, className }) => {
	return (
		<BaseControl>
			<div className={`kubio-inlined-label-control ${className}`}>
				<div className={'kubio-inlined-label-control__label'}>
					<BaseControl.VisualLabel>{label}</BaseControl.VisualLabel>
				</div>

				<div className={'kubio-inlined-label-control__control'}>
					{children}
				</div>
			</div>
		</BaseControl>
	);
};

export default InlineLabeledControl;
