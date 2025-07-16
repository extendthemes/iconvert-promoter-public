import { CustomSelectControl } from './custom-select-control';
import classnames from 'classnames';
import { BaseControl, Button } from '@wordpress/components';
import _ from 'lodash';
import { ResetIcon } from '@kubio/icons';
import { __ } from '@wordpress/i18n';

const GutentagSelectControl = ({
	label = null,
	onReset = _.noop,
	inlineLabel = true,
	allowReset,
	resetIcon = ResetIcon,
	resetLabel = __('Reset', 'kubio'),
	...props
}) => {
	const showLabel = !!label;

	return (
		<BaseControl
			className={classnames([
				'kubio-select-control',
				{
					'kubio-select-control--inline': showLabel && inlineLabel,
					'kubio-select-control--row': showLabel && !inlineLabel,
					'kubio-select-control--no-label': !showLabel,
					'kubio-select-control--with-reset': allowReset,
				},
			])}
		>
			{showLabel && (
				<BaseControl.VisualLabel className="kubio-select-control__label">
					<label className="components-input-control__label">
						<span className="components-input-control__label__content">
							{label}
						</span>
					</label>
				</BaseControl.VisualLabel>
			)}

			<CustomSelectControl
				{...props}
				label={label}
				className="kubio-select-control__control"
			/>

			{allowReset && (
				<Button
					isSmall
					icon={resetIcon}
					label={resetLabel}
					className={
						'kubio-popover-options-icon kubio-color-indicator-popover-reset-icon kubio-select-control__reset'
					}
					// disabled={!isDirty}
					onClick={onReset}
				/>
			)}
		</BaseControl>
	);
};

export * from './variations';
export { GutentagSelectControl };
