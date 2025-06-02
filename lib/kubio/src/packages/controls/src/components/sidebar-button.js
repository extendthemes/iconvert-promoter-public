import { Button } from '@wordpress/components';
import { forwardRef } from '@wordpress/element';

const SidebarButton = forwardRef(
	({ onClick, children, ...otherProps }, ref) => {
		return (
			<Button ref={ref} isPrimary onClick={onClick} {...otherProps}>
				{children}
			</Button>
		);
	}
);

export { SidebarButton };
