import _ from 'lodash';

const kubioBlockPrefix = 'cspromo';

const replaceKubioBlockName = ( blockName ) => {
	if ( typeof blockName !== 'string' ) {
		return blockName;
	}
	const nameParts = blockName.split( '/' );
	const packageName = nameParts[ 0 ];
	if ( packageName === 'kubio' ) {
		const oldName = nameParts[ 1 ];
		const newName = `${ kubioBlockPrefix }/${ oldName }`;
		return newName;
	}

	return blockName;
};

/*
	block Array [name, attributes, innerBlocks]
 */
const replaceKubioArrayBlockPrefix = ( block ) => {
	if (
		! block ||
		! Array.isArray( block ) ||
		( Array.isArray( block ) && _.isEmpty( block ) )
	) {
		return block;
	}

	block[ 0 ] = replaceKubioBlockName( block[ 0 ] );
	const innerBlocks = block[ 2 ] || [];
	innerBlocks.forEach( ( innerBlock ) => {
		replaceKubioArrayBlockPrefix( innerBlock, kubioBlockPrefix );
	} );

	return block;
};

/*
	Object with the form {
	 name: string,
	 innerBlocks: [name, attributes, innerBlocks]
	}
 */
const replaceKubioObjectBlockPrefix = ( block ) => {
	if ( ! block || ! _.isObject( block ) ) {
		return block;
	}

	block.name = replaceKubioBlockName( block.name );
	const innerBlocks = block.innerBlocks || [];
	innerBlocks.forEach( ( innerBlock ) => {
		replaceKubioArrayBlockPrefix( innerBlock );
	} );

	return block;
};

export {
	replaceKubioBlockName,
	replaceKubioArrayBlockPrefix,
	replaceKubioObjectBlockPrefix,
};
