import { PanelBody } from '@wordpress/components';
import { pure } from '@wordpress/compose';
import { useMemo } from '@wordpress/element';
import classnames from 'classnames';

const KubioPanelBody = pure(({ className, children, ...rest }) => {
	className = useMemo(
		() =>
			classnames(className || '', 'kubio-panel-body', 'kubio-control', {
				'kubio-is-kubio-editor': window.isKubioBlockEditor,
				'kubio-is-default-editor': !window.isKubioBlockEditor,
			}),
		[className]
	);

	return (
		<PanelBody {...rest} className={className}>
			{children}
		</PanelBody>
	);
});

export { KubioPanelBody };
