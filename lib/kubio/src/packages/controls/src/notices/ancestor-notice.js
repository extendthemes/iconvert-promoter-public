import { useDataHelperDefaultOptionsContext } from '@kubio/core';
import { PanelBody } from '@wordpress/components';

const AncestorNotice = () => {
	const { defaultOptions } = useDataHelperDefaultOptionsContext();
	const ancestor = defaultOptions?.ancestor;
	return (
		<>
			{ ancestor && (
				<PanelBody title={ '' }>
					<span>You are editing { ancestor } state</span>
				</PanelBody>
			) }
		</>
	);
};

export { AncestorNotice };
