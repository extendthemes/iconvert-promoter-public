import { PanelRow } from '@wordpress/components';
import classnames from 'classnames';

const uiClass = (className) => {
	return `kubio-${className}`;
};

const RowControls = (props) => {
	const { children } = props;
	return (
		<PanelRow
			className={classnames(uiClass('row-controls'), 'kubio-control')}
		>
			{children}
		</PanelRow>
	);
};

export { RowControls };
