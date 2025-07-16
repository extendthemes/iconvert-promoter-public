import { useSelect } from '@wordpress/data';
import { SectionsListArea } from '../index';

function KubioSectionList(props) {
	const { templateParts, selectBlock, removeBlocks, reorderBlocks } = props;
	const { blockTypes } = useSelect((select) => ({
		blockTypes: select('core/blocks').getBlockTypes(),
		getBlocks: select('core/block-editor').getBlocks,
	}));

	return (
		<>
			{templateParts.map((templatePart, index) => {
				const { name, clientId: templatePartClientId } = templatePart;

				const sectionsListAreaProps = {
					selectBlock,
					removeBlocks,
					reorderBlocks,
					name,
					templatePart,
					templatePartClientId,
					blockTypes,
				};
				return (
					<SectionsListArea
						key={'template-sections-' + index}
						{...sectionsListAreaProps}
					/>
				);
			})}
		</>
	);
}

export { KubioSectionList };
