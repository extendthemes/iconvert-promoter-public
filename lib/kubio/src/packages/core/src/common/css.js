// import { styleManagerInstance } from '@kubio/style-manager';
//
// import { useEntityId } from '@wordpress/core-data';
// import { useDispatch, useSelect } from '@wordpress/data';
// import { getBlockCurrentData } from '../utils';
//
// const generateBlockCss = (block, blocksCss) => {
// 	const { model, styledComponents } = getBlockCurrentData(block) || {};
// 	if (model) {
// 		const blockCss = styleManagerInstance.getBlockCss({
// 			model,
// 			styledComponents,
// 		});
// 		blocksCss.push(blockCss);
// 	}
//
// 	block?.innerBlocks.forEach((block) => {
// 		generateBlockCss(block, blocksCss);
// 	});
// };
//
// const useGenerateBlocksCss = (blocks) => {
// 	const postId = useEntityId('postType', 'post');
// 	const templateId = useEntityId('postType', 'wp_template');
// 	const templatePartId = useEntityId('postType', 'wp_template_part');
//
// 	const blocksCss = [];
// 	blocks.forEach((block) => {
// 		generateBlockCss(block, blocksCss);
// 	});
//
// 	const entityType = templatePartId ? 'wp_template_part' : 'wp_template';
// 	const entityId = templatePartId ? templatePartId : templateId;
//
// 	const { editEntityRecord } = useDispatch('core');
//
// 	const oldValue = useSelect((select) =>
// 		select('core').getEntityRecord('postType', entityType, entityId)
// 	);
//
// 	if (oldValue !== JSON.stringify(blocksCss)) {
// 		editEntityRecord('postType', entityType, entityId, {
// 			meta: {
// 				colibri_css: JSON.stringify(blocksCss),
// 			},
// 		});
// 	}
//
// 	return blocksCss;
// };
//
// export { useGenerateBlocksCss };
