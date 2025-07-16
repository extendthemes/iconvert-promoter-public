import { getBlocksMap } from '@kubio/block-library';
import { withComputedData } from '@kubio/core';
import {
	DataHelperContextFromClientId,
	StyleInspectorControls,
} from '@kubio/inspectors';
import _ from 'lodash';

const BlocksMap = getBlocksMap();
const icon = BlocksMap?.icon;
const ElementsEnum = icon?.ElementsEnum;
const Components = BlocksMap?.icon?.Components?.style || {};
const styledElement = ElementsEnum.INNER;
const { BackgroundAndBorderSection = null, IconSection = null } = Components;

const Component_ = ( { computed } ) => {
	const { iconClientId } = computed;
	return (
		<>
			<DataHelperContextFromClientId clientId={ iconClientId }>
				<IconSection styledElement={ styledElement } />
				<BackgroundAndBorderSection styledElement={ styledElement } />
			</DataHelperContextFromClientId>
		</>
	);
};

const useComputed = ( dataHelper ) => {
	const iconClientId = _.get( dataHelper.withChildren(), [
		'0',
		'clientId',
	] );
	return {
		iconClientId,
	};
};

const ComposedComponent = withComputedData( useComputed )( Component_ );
const Component = () => {
	return (
		<StyleInspectorControls>
			<ComposedComponent />
		</StyleInspectorControls>
	);
};

export default Component;
