import { Button } from '@wordpress/components';
import { forwardRef } from '@wordpress/element';

const OptionsIconButton_ = (props, ref) => {
	return (
		<Button
			ref={ref}
			icon="admin-generic"
			iconSize={12}
			{...props}
			style={{ color: 'blue' }}
		/>
	);
};

const OptionsIconButton = forwardRef(OptionsIconButton_);

export { OptionsIconButton };
