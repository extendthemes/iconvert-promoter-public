import { __ } from '@wordpress/i18n';
import { PlainText } from '@wordpress/block-editor';
import { useInstanceId } from '@wordpress/compose';
import { Icon, shortcode as shortcodeIcon } from '@wordpress/icons';
const ShortcodePlaceholder = ({ value, onChange }) => {
	const instanceId = useInstanceId(ShortcodePlaceholder);
	const inputId = `blocks-shortcode-input-${instanceId}`;
	return (
		<div className="wp-block-shortcode components-placeholder">
			<label htmlFor={inputId} className="components-placeholder__label">
				<Icon icon={shortcodeIcon} />
				{__('Shortcode', 'kubio')}
			</label>
			<PlainText
				className="blocks-shortcode__textarea"
				id={inputId}
				value={value}
				placeholder={__('Write shortcode here…', 'kubio')}
				onChange={onChange}
			/>
		</div>
	);
};

export { ShortcodePlaceholder };
