import { BaseControl } from '@wordpress/components';

const InlineLabeledControl = ({ label, children, className }) => {
	return (
		<BaseControl className="kubio-control">
			<div className={`kubio-inlined-label-control ${className}`}>
				{label && (
					<div className={'kubio-inlined-label-control__label'}>
						<BaseControl.VisualLabel>
							{label}
						</BaseControl.VisualLabel>
					</div>
				)}

				<div className={'kubio-inlined-label-control__control'}>
					{children}
				</div>
			</div>
		</BaseControl>
	);
};

export { InlineLabeledControl };
