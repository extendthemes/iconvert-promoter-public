import { useSelect } from '@wordpress/data';
import NamesOfBlocks from '../../blocks-list';
import { AddNewColumn } from './add-new-column';
import { EqualColumnsToggle } from './equal-columns-toggle';

const Toolbar = ({ dataHelper }) => {
	const { canInsertBlockType } = useSelect(
		(select) => select('core/block-editor'),
		[]
	);

	const canInsert = canInsertBlockType(
		NamesOfBlocks.COLUMN,
		dataHelper.clientId
	);

	return (
		<>
			<EqualColumnsToggle dataHelper={dataHelper} />
			{canInsert && <AddNewColumn dataHelper={dataHelper} />}
		</>
	);
};

export { Toolbar };
