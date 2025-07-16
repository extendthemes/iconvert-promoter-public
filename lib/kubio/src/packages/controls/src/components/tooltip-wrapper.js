import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { helpFilled, Icon } from '@wordpress/icons';

const TooltipWrapper = (props) => (
	<div style={{ position: 'relative' }}>
		{props.children}
		<div
			style={{
				position: 'absolute',
				left: props.leftPosition,
				top: '2px',
			}}
		>
			<Tooltip text={props.text} delay={100}>
				<span>
					<Icon size={16} icon={helpFilled} />
				</span>
			</Tooltip>
		</div>
	</div>
);

export { TooltipWrapper };
