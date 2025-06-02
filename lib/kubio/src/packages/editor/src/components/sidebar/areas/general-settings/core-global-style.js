import { STORE_KEY } from '@kubio/constants';
import { GlobalStylesUI } from '@kubio/wp-global-styles';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import SubSidebarArea from '../../subsidebar-area';

const CoreGlobalStylesArea = ({ parentAreaIdentifier }) => {
	const shouldRender = useSelect(
		(select) =>
			select(STORE_KEY).getEditorOpenedSidebar() ===
			`${parentAreaIdentifier}/core-global-styling`,
		[]
	);

	return (
		<SubSidebarArea
			title={__('WordPress globals', 'kubio')}
			label={__('WordPress globals', 'kubio')}
			parentAreaIdentifier={parentAreaIdentifier}
			areaIdentifier={`${parentAreaIdentifier}/core-global-styling`}
		>
			<div className={'kubio-core-global-styles'}>
				{shouldRender && <GlobalStylesUI />}
			</div>
		</SubSidebarArea>
	);
};

export default CoreGlobalStylesArea;
