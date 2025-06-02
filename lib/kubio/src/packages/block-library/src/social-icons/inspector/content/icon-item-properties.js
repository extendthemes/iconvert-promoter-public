import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { IconPickerWithPath, LinkControlWithData } from '@kubio/controls';
import { properties } from '../style/config';

const Panel = ( props ) => {
	const { computed } = props;
	const { afterIconChange } = computed;
	return (
		<>
			<IconPickerWithPath
				path="icon.name"
				type={ WithDataPathTypes.ATTRIBUTE }
				afterIconChange={ afterIconChange }
			/>

			<LinkControlWithData />
		</>
	);
};

const useComputed = ( dataHelper, ownProps ) => {
	const parentDataHelper = dataHelper.withParent();
	const type = parentDataHelper.getProp( 'styleType', 'shared' );

	const afterIconChange = ( newIcon ) => {
		const iconName = newIcon.split( '/' ).pop();

		if ( type === 'official' ) {
			const colorProp = properties.objectColorIcons.find( ( elem ) =>
				iconName.startsWith( elem.name )
			);

			if ( typeof colorProp.color === 'undefined' ) {
				return;
			}

			dataHelper.setAttribute( 'icon.name', newIcon );
			dataHelper.setStyle( 'fill', colorProp.color, {
				styledComponent: 'icon',
			} );
		}
	};

	return {
		afterIconChange,
	};
};
const IconItemProperties = withComputedData( useComputed )( Panel );

export { IconItemProperties };
