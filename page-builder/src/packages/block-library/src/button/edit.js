import { composeWithKubioDataAndStyle } from '@kubio/core';
import { getBlocksMap } from '@kubio/block-library';
import { Button } from './component.js';
import { Content } from './inspectors/content';
const BlocksMap = getBlocksMap();
const button = BlocksMap?.button;
const buttonComponents = button?.Components || {};
const { Style, ComponentParts } = buttonComponents;
const ReadMoreButton = ( props ) => {
	return (
		<>
			<Content />
			<Style />
			<Button { ...props } />
		</>
	);
};

export default composeWithKubioDataAndStyle( ReadMoreButton );
