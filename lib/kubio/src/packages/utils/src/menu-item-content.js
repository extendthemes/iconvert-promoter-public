import { useSelect } from '@wordpress/data';
import { isString } from 'lodash';
import isEqual from 'react-fast-compare';

const useTransformLinkControlValue = () => {
	const postTypes = useSelect(
		( select ) =>
			( select( 'core' ).getPostTypes() || [] ).map(
				( postType ) => postType.slug
			),
		[]
	);

	return ( nextValue = {} ) => {
		if ( isString( nextValue ) ) {
			nextValue = {
				url: nextValue,
				nextType: 'URL',
			};
		}

		const {
			title: nextLabel,
			url: newURL,
			opensInNewTab: newOpensInNewTab,
			id: newId,
			type: nextType,
			taxonomy: newTaxonomy,
		} = nextValue;

		if ( isEqual( Object.keys( nextValue ), [ 'url', 'opensInNewTab' ] ) ) {
			return {
				url: encodeURI( newURL ),
				target: nextValue.opensInNewTab ? '_blank' : '_self',
			};
		}

		let newObject = 'custom';
		let newObjectId = null;
		let newType = 'custom';
		let newLabel = nextLabel;

		if ( newTaxonomy ) {
			newObject = newTaxonomy;
			newObjectId = newId;
			newType = 'taxonomy';
		} else if ( postTypes.indexOf( nextType ) !== -1 ) {
			newType = 'post_type';
			newObject = nextType;
			newObjectId = newId;
		}

		if ( nextType === 'URL' ) {
			const urlObject = new URL( newURL );
			const host = urlObject.host.replace( /\.(.*?)$/, '' );
			newLabel = host ?? null;
		}

		const newAttributes = {
			url: encodeURI( newURL ),
			object: newObject,
			target: newOpensInNewTab ? '_blank' : '_self',
			type: newType,
		};

		if ( newLabel ) {
			newAttributes.label = newLabel;
		}

		if ( newObjectId ) {
			newAttributes.objectId = newObjectId;
		}

		return newAttributes;
	};
};

export { useTransformLinkControlValue };
