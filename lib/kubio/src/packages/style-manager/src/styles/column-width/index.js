import { addValueUnitString, createGroup } from '../../utils';
import { types } from '../../types';
import { LodashBasic } from '../../core/lodash-basic';

const columnWidthType = types.props.columnWidth;
const ColumnWidthTypes = columnWidthType.enums.types;

const columnWidthGroup = createGroup( {
	groupName: 'columnWidth',
	toStyle: ( style = {}, value, { options = {} } = {} ) => {
		const { htmlSupport = true } = options;
		const styleByType = columnWidthType.enums.typeToStyle[ value.type ];

		style = LodashBasic.merge( {}, style, styleByType );
		switch ( value.type ) {
			case ColumnWidthTypes.CUSTOM:
				style = addValueUnitString(
					style,
					'width',
					value[ ColumnWidthTypes.CUSTOM ]
				);
				return style;
			case ColumnWidthTypes.FLEX_GROW:
			case ColumnWidthTypes.FIT_TO_CONTENT:
				return styleByType;
		}
		return {};
	},
	default: columnWidthType.default,
} );

export default columnWidthGroup;
export { columnWidthGroup, columnWidthType, ColumnWidthTypes };
