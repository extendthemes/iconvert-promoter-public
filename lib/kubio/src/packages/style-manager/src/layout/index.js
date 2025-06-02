import { Utils } from '../core/utils';
import { FlexAlign } from '../core/properties/align';
import { LodashBasic } from '../core/lodash-basic';
import _ from 'lodash';
import { mediasById } from '../medias';
import { GapValues } from './gaps';

import { columnWidthType, ColumnWidthTypes } from '../styles/column-width';
import { types } from '../types';

class LayoutHelper {
	static computeColumnWidthClasses( columnWidthByMedia ) {
		const widthClassesByMedia = LodashBasic.mapValues(
			columnWidthByMedia,
			( width ) => columnWidthType.enums.typeToClass[ width.type ]
		);
		return Utils.composeClassesByMedia(
			widthClassesByMedia,
			'h-col',
			true
		);
	}

	constructor( layoutByMedia = {}, rowLayoutByMedia = {} ) {
		this.prefixes = types.definitions.layout.prefixes;
		this.layoutByMedia = layoutByMedia;
		this.rowLayoutByMedia = rowLayoutByMedia;
	}

	getSelfVAlignClasses() {
		const verticalAlignByMedia = LodashBasic.mapValues(
			this.layoutByMedia,
			'verticalAlign'
		);
		const verticalAlignClasses = FlexAlign.getVAlignClasses(
			verticalAlignByMedia,
			{
				self: true,
			}
		);
		return verticalAlignClasses;
	}

	get gridColumns() {
		return 12;
	}

	getColumnGridClasses() {
		const noColumnsByMedia = LodashBasic.mapValues(
			this.rowLayoutByMedia,
			( layout ) => Math.round( this.gridColumns / layout.itemsPerRow )
		);
		return Utils.composeClassesByMedia( noColumnsByMedia, 'h-col', true );
	}

	getColumnWidthClasses( columnWidthByMedia, canUseHtml = true ) {
		if ( ! canUseHtml ) {
			// use h-col-none so the h-col-* grid gutters apply
			return [ 'h-col-none' ];
		}
		const classes =
			LayoutHelper.computeColumnWidthClasses( columnWidthByMedia );
		return classes;
	}

	getColumnLayoutClasses( columnWidthByMedia, canUseHtml = true ) {
		const layout = this.rowLayoutByMedia.desktop || {};
		const equalWidth = layout.equalWidth;
		if ( equalWidth ) {
			return this.getColumnGridClasses();
		}
		return this.getColumnWidthClasses( columnWidthByMedia, canUseHtml );
	}

	getInheritedColumnVAlignClasses() {
		const verticalAlignByMedia_ = LodashBasic.mapValues(
			this.rowLayoutByMedia,
			'verticalAlign'
		);

		const equalHeightByMedia = LodashBasic.mapValues(
			this.rowLayoutByMedia,
			'equalHeight'
		);

		const verticalAlignByMedia = {};
		LodashBasic.each( equalHeightByMedia, ( stretch, media ) => {
			if ( ! stretch ) {
				verticalAlignByMedia[ media ] = verticalAlignByMedia_[ media ];
			}
		} );

		const verticalAlignClasses = FlexAlign.getVAlignClasses(
			verticalAlignByMedia,
			{
				self: true,
			}
		);

		return verticalAlignClasses;
	}

	getRowAlignClasses() {
		const verticalAlignByMedia_ = LodashBasic.mapValues(
			this.layoutByMedia,
			'verticalAlign'
		);
		const equalHeightByMedia = LodashBasic.mapValues(
			this.layoutByMedia,
			'equalHeight'
		);
		const verticalAlignByMedia = { ...verticalAlignByMedia_ };
		LodashBasic.each( equalHeightByMedia, ( stretch, media ) => {
			if ( stretch ) {
				verticalAlignByMedia[ media ] = 'stretch';
			}
		} );

		const hAlignByMedia = LodashBasic.mapValues(
			this.layoutByMedia,
			'horizontalAlign'
		);

		const classes = [].concat(
			FlexAlign.getVAlignClasses( verticalAlignByMedia ),
			FlexAlign.getHAlignClasses( hAlignByMedia )
		);
		return classes;
	}

	getRowGapClasses() {
		return this.mapGapClasses(
			this.prefixes.row.outer,
			this.layoutByMedia
		);
	}

	getRowGapInnerClasses() {
		return this.mapGapClasses(
			this.prefixes.row.inner,
			this.layoutByMedia
		);
	}
	getColumnInnerGapsClasses() {
		return this.mapGapClasses(
			this.prefixes.column,
			this.layoutByMedia,
			this.rowLayoutByMedia
		);
	}

	mapGapClasses( propsToSuffix, layoutByMedia, inheritedLayoutByMedia = {} ) {
		let classes = [];
		LodashBasic.each( layoutByMedia, ( layout, media ) => {
			LodashBasic.each( propsToSuffix, ( gapSuffix, path ) => {
				let value = LodashBasic.get( layout, path );

				if ( value === GapValues.INHERIT ) {
					const inheritedValue = LodashBasic.get(
						inheritedLayoutByMedia[ media ],
						path
					);
					value = inheritedValue;
				}
				classes = classes.concat(
					Utils.composeClassForMedia( media, value, gapSuffix )
				);
			} );
		} );
		return classes;
	}

	getColumnWidthType( equalWidth, columnWidth ) {
		return equalWidth
			? ColumnWidthTypes.EQUAL_WIDTH_COLUMNS
			: columnWidth.type;
	}

	getColumnContentFlexBasis( equalWidth, columnWidth ) {
		switch ( this.getColumnWidthType( equalWidth, columnWidth ) ) {
			case ColumnWidthTypes.FIT_TO_CONTENT:
				return 'flex-basis-auto';
			default:
				return 'flex-basis-100';
		}
	}

	inheritedRowInnerGaps( {
		horizontalInnerGapByMedia,
		verticalInnerGapByMedia,
		rowId,
	} ) {
		const classes = [];
		const directions = [
			{
				propByMedia: horizontalInnerGapByMedia,
				selector: 'horizontal-inner-gap',
			},
			{
				propByMedia: verticalInnerGapByMedia,
				selector: 'vertical-inner-gap',
			},
		];
		directions.forEach( ( direction ) => {
			const gapByMedia = direction.propByMedia;
			_.each( mediasById, ( media, mediaId ) => {
				const gapValue = _.get( gapByMedia, mediaId );
				if ( gapValue === GapValues.INHERIT ) {
					const prefix = media.gridPrefix
						? `-${ media.gridPrefix }`
						: '';
					const innerGapClass = `style-dynamic-${ rowId }-${ direction.selector }${ prefix }`;
					classes.push( innerGapClass );
				}
			} );
		} );
		return classes;
	}
}

export { LayoutHelper };
