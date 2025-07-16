import _ from 'lodash';
const axisPaths = [ 'translate', 'scale', 'rotate', 'skew' ];

//use paths like transform.translate.x . Majority of the transform properties use arrays this hook is used so you
//can easily tell translate.x path and don't care the x axis index.
const useTransformStyle = ( dataHelper ) => {
	const getter = ( path, defaultValue, options = {} ) => {
		const transform = dataHelper.getStyle( 'transform', {}, options );

		const pathParts = path.split( '.' );
		const property = _.get( pathParts, '[1]' );
		const axis = _.get( pathParts, '[2]' );
		if ( ! axisPaths.includes( property ) || ! axis ) {
			return dataHelper.getStyle( path, defaultValue, options );
		}

		//the remaining path also contains the axis because we'll make an object by axis like in colibri
		const remainingProperties = pathParts.slice( 2 );
		const subPath = remainingProperties.join( '.' );
		const propertyValue = _.get( transform, property, [] );
		const keyByValue = {};
		propertyValue.forEach( ( item ) => {
			_.set( keyByValue, item?.axis, item?.value );
		} );
		return _.get( keyByValue, subPath, defaultValue );
	};

	const setter = ( path, value, options = {} ) => {
		const transform = dataHelper.getStyle( 'transform', {}, options );
		const { unset, unsetValue } = options;
		const pathParts = path.split( '.' );
		const property = _.get( pathParts, '[1]' );
		const axis = _.get( pathParts, '[2]' );
		if ( ! axisPaths.includes( property ) || ! axis ) {
			return null;
		}
		const propertyValue = _.get( transform, property, [] );
		const index = _.findIndex( propertyValue, ( item ) => {
			return item.axis === axis;
		} );

		//if nothing is set update the initial data
		if ( index === -1 && value !== null ) {
			const initialData = [ 'x', 'y', 'z' ].map( ( item ) => {
				return {
					axis: item,
				};
			} );
			dataHelper.setStyle(
				`transform.${ property }`,
				initialData,
				options
			);
			setter( path, value, options );
			return;
		}
		let convertedPath = `[${ index }].value`;

		//the remaining path continues after the axis
		const remainingProperties = pathParts.slice( 3 );
		const subPath = remainingProperties.join( '.' );
		if ( subPath ) {
			convertedPath = `${ convertedPath }.${ subPath }`;
		}
		if ( ! unset ) {
			_.set( propertyValue, convertedPath, value );
		} else {
			_.set( propertyValue, convertedPath, unsetValue );
		}

		if ( unset ) {
			try {
				delete options.unset;
			} catch ( e ) {}
		}

		const newPath = `transform.${ property }`;
		if ( convertedPath ) {
			//we need to set all the array because if you set default for transform from block.json, it won't merge
			//the first time you set some changes
			dataHelper.setStyle( newPath, propertyValue, options );
		} else {
			dataHelper.setStyle( path, value, options );
		}
	};
	const getStyle = ( path, defaultValue, options = {} ) => {
		return getter( path, defaultValue, options );
	};
	const setStyle = ( path, value, options = {} ) => {
		dataHelper.setStyle( path, value, options );
	};

	const useStylePath = ( path, options = {}, defaultValue ) => {
		return {
			value: getter( path, defaultValue, options ),
			onChange: ( newValue ) => setter( path, newValue, options ),
			onReset: () => setter( path, null, { unset: true, ...options } ),
		};
	};
	return { getStyle, setStyle, useStylePath };
};

export { useTransformStyle };
