import { flatten, get } from 'lodash';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { select } from '@wordpress/data';
import Fuse from 'fuse.js';
import { __ } from '@wordpress/i18n';
import debouncePromise from 'debounce-promise';
import { STORE_KEY } from '@kubio/constants';
import { decodeEntities } from '@wordpress/html-entities';

const apiSearch = ( search, { perPage = 5, type, subtype } = {} ) => {
	return apiFetch( {
		path: addQueryArgs( '/wp/v2/search', {
			per_page: perPage,
			search,
			type,
			subtype,
		} ),
	} ).then( ( posts ) =>
		Promise.all(
			posts.map( ( post ) =>
				apiFetch( { url: post._links.self[ 0 ].href } )
			)
		)
	);
};

const fetchLinkSuggestionsBase = (
	search,
	{ isInitialSuggestions, type, subtype } = {}
) => {
	const perPage = isInitialSuggestions ? 3 : 5;

	const pageURL = select( STORE_KEY )?.getPage()?.link || '';

	const queries = [];

	if ( ! type || type === 'post' ) {
		queries.push(
			apiSearch( search, {
				perPage,
				type: 'post',
				subtype,
			} )
		);
	}

	if ( ! type || type === 'term' ) {
		queries.push(
			apiSearch( search, {
				perPage,
				type: 'term',
				subtype,
			} )
		);
	}

	if ( ! type || type === 'page-section' ) {
		queries.push(
			new Promise( ( resolve ) => {
				const blocks = select(
					'core/block-editor'
				).getBlocksByClientId(
					select( 'core/block-editor' ).getClientIdsWithDescendants()
				);
				const gutentagSection = blocks.filter(
					( { name, attributes } ) =>
						[ 'kubio/section', 'kubio/section' ].indexOf( name ) !==
							-1 && attributes.anchor
				);

				const entries = gutentagSection.map(
					( { name, attributes } ) => ( {
						block: name,
						url: pageURL + '#' + attributes.anchor,
						slug: attributes.anchor,
						title: get(
							attributes,
							'attrs.name',
							__( 'Unnamed section', 'kubio' )
						),
						type: '',
					} )
				);

				const fuse = new Fuse( entries, {
					threshold: 0.5,
					location: 0,
					distance: 1,
					keys: [ 'slug', 'title' ],
				} );

				resolve( fuse.search( search ).map( ( found ) => found.item ) );
			} )
		);
	}

	return Promise.all( queries )
		.then( ( posts ) => Promise.resolve( flatten( posts ) ) )
		.then( ( entries ) =>
			// eslint-disable-next-line array-callback-return
			entries.map( ( entry ) => {
				if ( entry.type ) {
					return {
						url: entry.link,
						type: entry.type,
						id: entry.id,
						slug: entry.slug,
						title: decodeEntities(
							entry.title.rendered || __( '(no title)', 'kubio' )
						),
					};
				}

				if ( entry.taxonomy ) {
					return {
						url: entry.link,
						taxonomy: entry.taxonomy,
						id: entry.id,
						slug: entry.slug,
						title: decodeEntities( entry.name ),
						type: '',
					};
				}

				return { ...entry, title: decodeEntities( entry.title ) };
			} )
		);
};

const fetchLinkSuggestions = debouncePromise( fetchLinkSuggestionsBase, 300 );

export { fetchLinkSuggestions };
