import { dragHandle, Icon } from '@wordpress/icons';
import { SortableHandle } from 'react-sortable-hoc';
import { Tooltip } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const DragHandle = SortableHandle(() => (
	<Tooltip text={__('Move', 'kubio')}>
		<div className={'d-flex'}>
			<Icon icon={dragHandle} className={'draggable-item'} />
		</div>
	</Tooltip>
));

export { DragHandle };
