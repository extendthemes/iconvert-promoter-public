import { StyleRender } from './style-render';
import { Config, Utils } from './core/utils';
import { styleManagerInstance } from './manager';
import { LodashBasic } from './core/lodash-basic';

class BlockStyleRender extends StyleRender {
	constructor( block, parentBlock, htmlSupport = true, document ) {
		const { blockData, blockType } = block;
		const normalized = Utils.normalizeBlockData( blockData, blockType );

		const {
			styledElementsByName,
			styledElements,
			styledElementsEnum,
			model,
		} = normalized;

		const wrapperElement = styledElements.find(
			( item ) => item?.wrapper
		)?.name;

		const prefixParents = [];
		const useParentPrefix = LodashBasic.get(
			blockType,
			`supports.${ Config.mainAttributeKey }.useParentPrefix`,
			false
		);

		if ( useParentPrefix && parentBlock ) {
			const { blockData: parentBlockData, blockType: parentBlockType } =
				parentBlock;

			if ( parentBlockData && parentBlockType ) {
				const parentStyleRenderer = new BlockStyleRender(
					parentBlock,
					null,
					htmlSupport,
					document
				);
				prefixParents.push(
					parentStyleRenderer.componentInstanceClass(
						parentStyleRenderer.wrapperElement,
						'shared',
						true
					)
				);
			}
		}

		super( {
			styledElementsByName,
			styledElementsEnum,
			model,
			wrapperElement,
			htmlSupport,
			document,
			useParentPrefix,
			prefixParents,
		} );

		this.blockType = blockType;
		this.parentBlockType = parentBlock;
	}

	render( dynamicStyle ) {
		const styleRef = this.model?.styleRef;
		const localId = this.model?.id;

		const styleManager = styleManagerInstance( this.document );

		if ( dynamicStyle ) {
			const dynamicRules = this.exportDynamicStyle( dynamicStyle );
			styleManager.updateDynamicRules( styleRef, dynamicRules );
		}

		const css = this.export();

		if ( localId && localId !== 'undefined' ) {
			styleManager.updateLocalRules( localId, css.local );
		}

		styleManager.updateSharedRules( styleRef, css.shared );
		styleManager.updateRules();
	}
}

export { BlockStyleRender };
