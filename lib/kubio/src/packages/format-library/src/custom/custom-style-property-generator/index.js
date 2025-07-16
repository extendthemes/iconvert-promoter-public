import { useEffect, useState } from '@wordpress/element';
import { applyFormat } from '@wordpress/rich-text';
import { KubioRichTextToolbarButton } from '../toolbar-button';
import { getActivePropertyCssValue } from '../utils';

const generateFormat = ( {
	propertyName,
	title,
	InlineControl,
	getActivePropertyValue,
	propertyIcon,
} ) => {
	const name = `kubio/${ propertyName }`;

	const PropertyEdit = getPropertyEdit( {
		propertyName,
		name,
		InlineControl,
		getActivePropertyValue,
		propertyIcon,
	} );

	return {
		name,
		slotId: propertyName,
		title,
		tagName: 'span',
		className: `kubio-has-inline--${ propertyName }`,
		attributes: {
			style: 'style',
		},
		edit: PropertyEdit,
	};
};

function getPropertyEdit( {
	propertyName,
	name,
	InlineControl,
	getActivePropertyValue,
} ) {
	const PropertyEdit = ( { value, onChange } ) => {
		const [ showInlineProperty, setShowInlineProperty ] = useState( false );

		let propertyValue;

		if ( ! getActivePropertyValue ) {
			propertyValue = getActivePropertyCssValue(
				propertyName,
				name,
				value
			);
		} else {
			propertyValue = getActivePropertyValue( name, value );
		}

		useEffect( () => {
			if ( ! showInlineProperty && propertyValue ) {
				setShowInlineProperty( true );
			}
		}, [ propertyValue ] );

		const onPropertyChange = ( newPropertyValue ) => {
			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						style: `${ propertyName }: ${ newPropertyValue }`,
					},
				} )
			);
		};

		const inlineComponent = (
			<KubioRichTextToolbarButton name={ propertyName }>
				<InlineControl
					onChange={ onPropertyChange }
					value={ propertyValue }
				/>
			</KubioRichTextToolbarButton>
		);

		return { inlineComponent };
	};

	return PropertyEdit;
}

export { generateFormat };
