import Fuse from 'fuse.js';

const filterFonts = ( list, search ) => {
	if ( ! search ) {
		return list;
	}

	const fuse = new Fuse( list, {
		threshold: 0.5,
		location: 0,
		distance: 1,
		keys: [ 'family' ],
	} );

	return fuse.search( search ).map( ( found ) => found.item );
};

export default filterFonts;
