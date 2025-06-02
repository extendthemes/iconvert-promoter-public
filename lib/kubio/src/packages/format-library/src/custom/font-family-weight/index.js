import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { applyFormat, removeFormat } from '@wordpress/rich-text';
import _ from 'lodash';
import { KubioRichTextToolbarButton } from '../toolbar-button';
import { getActivePropertyCssValue, isInsideKubioBlock } from '../utils';
import { InlineControl } from './inline';

const propertyName = 'font-family-weight';
const title = __( 'Font', 'kubio' );
const name = `kubio/${ propertyName }`;

const PropertyEdit = ( props ) => {
	const { value, onChange, contentRef } = props;
	const { isActive } = props;
	const [ refreshToken, setRefreshToken ] = useState( '' );
	const fontFamily = getActivePropertyCssValue( 'font-family', name, value );

	const fontWeight = getFontWeightValue( name, value );

	useEffect( () => {
		setRefreshToken( Math.random() );
	}, [ value ] );

	const mergedData = {
		fontFamily,
		fontWeight,
	};

	const onReset = () => {
		onChange( removeFormat( value, name ) );
	};

	const setStyle = ( path, newValue ) => {
		let mergedDataClone = window.structuredClone( mergedData );
		if ( path ) {
			_.set( mergedDataClone, path, newValue );
		} else {
			mergedDataClone = newValue;
		}

		onPropertyChange( mergedDataClone );
	};

	// eslint-disable-next-line no-shadow
	const onPropertyChange = ( { fontFamily, fontWeight } ) => {
		const styleArray = [];
		if ( fontFamily ) {
			styleArray.push( `font-family: ${ fontFamily }` );
		}
		if ( fontWeight ) {
			styleArray.push( `font-weight: ${ fontWeight }` );
		}
		const style = styleArray.join( ';' );
		onChange(
			applyFormat( value, {
				type: name,
				attributes: {
					style,
				},
			} )
		);
	};

	if ( ! isInsideKubioBlock( contentRef ) ) {
		return <></>;
	}

	return (
		<KubioRichTextToolbarButton name={ propertyName }>
			<InlineControl
				key={ refreshToken }
				formatValue={ value }
				onChange={ setStyle }
				value={ mergedData }
				isActive={ isActive }
				onReset={ onReset }
				contentRef={ contentRef }
			/>
		</KubioRichTextToolbarButton>
	);
};

function getFontWeightValue( formatName, formatValue ) {
	let value = getActivePropertyCssValue(
		'font-weight',
		formatName,
		formatValue
	);
	if ( ! isNaN( value ) ) {
		value = parseFloat( value );
	}
	return value;
}
const fontFamilyWeight = {
	name,
	title,
	slotId: propertyName,
	tagName: 'span',
	className: `kubio-has-inline-${ propertyName }`,
	attributes: {
		style: 'style',
	},
	edit: PropertyEdit,
};

export { fontFamilyWeight };
