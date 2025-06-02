/**
 * WordPress dependencies
 */
import { ToolbarGroup, ToolbarItem } from '@wordpress/components';
import { useBlockEditContext } from '../block-edit';
/**
 * Internal dependencies
 */
import BlockControls from '../block-controls';
import ImageEditingProvider from './context';
import Cropper from './cropper';
import ZoomDropdown from './zoom-dropdown';
import AspectRatioDropdown from './aspect-ratio-dropdown';
import RotationButton from './rotation-button';
import FormControls from './form-controls';
import {useMemo} from "@wordpress/element";


export default function ImageEditor( {
	id,
	url,
	width,
	height,
	clientWidth,
	naturalHeight,
	naturalWidth,
	onSaveImage,
	onFinishEditing,
	borderProps,
} ) {
	const { clientId } = useBlockEditContext();

	let realClientWidth = useMemo(() => {
		if(clientWidth) {
			return clientWidth
		}
		//can't use userOwnerDocument as it creates a dependency loop
		let iframe = document.querySelector('iframe');
		let ownerDocument =  iframe?.contentWindow?.document
		if(!ownerDocument) {
			return null;
		}
		let node = ownerDocument.querySelector(`[data-block="${clientId}"] img`);
		if(!node) {
			return null;
		}
		return node.offsetWidth;
	},[])

	return (
		<ImageEditingProvider
			id={ id }
			url={ url }
			naturalWidth={ naturalWidth }
			naturalHeight={ naturalHeight }
			onSaveImage={ onSaveImage }
			onFinishEditing={ onFinishEditing }
		>
			<Cropper
				borderProps={ borderProps }
				url={ url }
				width={ width }
				height={ height }
				clientWidth={ realClientWidth }
				naturalHeight={ naturalHeight }
				naturalWidth={ naturalWidth }
			/>
			<BlockControls>
				<ToolbarGroup>
					<ZoomDropdown />
					<ToolbarItem>
						{ ( toggleProps ) => (
							<AspectRatioDropdown toggleProps={ toggleProps } />
						) }
					</ToolbarItem>
					<RotationButton />
				</ToolbarGroup>
				<ToolbarGroup>
					<FormControls />
				</ToolbarGroup>
			</BlockControls>
		</ImageEditingProvider>
	);
}
