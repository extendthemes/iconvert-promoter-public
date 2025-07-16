import _, { each } from 'lodash';
import { typographyConfig } from './styles';

const { parseHolders } = typographyConfig;
const dynamicStylesTransforms = {
	hSpaceParent: ( spaceByMedia ) => {
		const objGroup = {};
		_.each( spaceByMedia, ( space, media ) => {
			if ( ! isNaN( space?.value ) ) {
				const halfSpace = parseInt( parseInt( space.value ) / 2 );
				objGroup[ media ] = {
					marginLeft: '-' + halfSpace + 'px',
					marginRight: '-' + halfSpace + 'px',
				};
			}

			/*
			this triggers unwanted dynamic style rendering - other transforms do not have this
			else {
				objGroup[media] = {};
			}
			*/
		} );
		return objGroup;
	},

	hSpace: ( spaceByMedia ) => {
		const obj = {};
		_.each( spaceByMedia, ( space, media ) => {
			if ( ! isNaN( space?.value ) ) {
				const halfSpace = parseInt( parseInt( space.value ) / 2 );
				obj[ media ] = {
					paddingLeft: halfSpace + 'px',
					paddingRight: halfSpace + 'px',
				};
			}
		} );
		return obj;
	},

	vSpace: ( spaceByMedia, negative = false, top = false ) => {
		const obj = {};
		each( spaceByMedia, ( mediaSpace, media ) => {
			if ( ! isNaN( mediaSpace?.value ) ) {
				obj[ media ] = {
					[ top ? 'marginTop' : 'marginBottom' ]:
						( negative ? '-' : '' ) + mediaSpace.value + 'px',
				};
			}
		} );
		return obj;
	},
	typographyHolders: ( typographyHoldersByMedia ) => {
		const typographyCssByMedia = {};
		_.each(
			window.structuredClone( typographyHoldersByMedia ),
			( typography, media ) => {
				typographyCssByMedia[ media ] = parseHolders(
					typography,
					null,
					{
						isDynamicStyle: true,
					}
				);
			}
		);
		return typographyCssByMedia;
	},
};

export { dynamicStylesTransforms };
