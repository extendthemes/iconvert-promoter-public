import { BaseControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ControlNotice = ( {
	showLabel = true,
	label = __( 'Note:', 'kubio' ),
	content = '',
	...rest
} ) => {
	return (
		<BaseControl { ...rest }>
			<div className={ 'h-control-notice' }>
				{ showLabel && (
					<span className="h-control-notice__label">{ label }</span>
				) }
				<div className={ 'h-control-notice__content' }>{ content }</div>
			</div>
		</BaseControl>
	);
};

export { ControlNotice };
