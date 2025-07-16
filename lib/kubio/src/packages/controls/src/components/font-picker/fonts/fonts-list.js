import { useGlobalDataFonts } from '@kubio/global-data';
import { useMemo, useRef, useState } from '@wordpress/element';
import { List } from 'react-virtualized';
import { loadGoogleFonts } from '@kubio/utils';
import { BaseControl, Button } from '@wordpress/components';
import filterFonts from './filter-fonts';
import FontListItem from './font-list-item';
import { FontSearch } from './font-search';
import { __ } from '@wordpress/i18n';

const FontsList = ( {
	value,
	onChange,
	displayFonts = 10,
	fontItemHeight = 30,
} ) => {
	const [ search, setSearch ] = useState( '' );

	const { getTypeKitUsedFonts, getAvailableGoogleFonts } =
		useGlobalDataFonts();

	const typeKitFonts = getTypeKitUsedFonts();

	const { getGoogleFonts, addGoogleFont } = useGlobalDataFonts();
	const usedFonts = getGoogleFonts();
	const notUsedFonts = useMemo( () => {
		const usedFamilies = usedFonts.map( ( font ) => font.family );

		return getAvailableGoogleFonts().filter(
			( font ) => usedFamilies.indexOf( font.family ) === -1
		);
	}, [ usedFonts ] );

	const filteredUsedFonts = useMemo(
		() => filterFonts( usedFonts, search ),
		[ search, usedFonts ]
	);

	const filteredNotUsedFonts = useMemo(
		() => filterFonts( notUsedFonts, search ),
		[ search, notUsedFonts ]
	);

	const filteredTypeKitFonts = useMemo( () =>
		filterFonts( typeKitFonts, search )
	);

	const finalList = useMemo( () => {
		return [].concat(
			filteredUsedFonts,
			filteredUsedFonts.length ? [ { separator: true } ] : [], // add separator only if the are usedFonts
			filteredTypeKitFonts,
			filteredTypeKitFonts.length ? [ { separator: true } ] : [],
			filteredNotUsedFonts
		);
	}, [ filteredUsedFonts, filteredNotUsedFonts ] );

	const onFontClicked = ( { family, variants, fontType } ) => {
		loadGoogleFonts( [ { family, variants } ] );
		if ( fontType === 'google' ) {
			addGoogleFont( { family, variants } );
		}

		onChange( family );
	};

	const pastSeparator = useRef( false );
	const renderRow = ( props ) => {
		if ( props.index === 0 ) {
			pastSeparator.current = false;
		}
		const item = finalList[ props.index ];
		const isSelected = item.family === value;
		if ( item.separator && ! pastSeparator.current ) {
			pastSeparator.current = true;
		}

		const {key,...itemProps} = props;

		return (
			<FontListItem
				key={ props.key || props.index }
				{ ...itemProps }
				item={ item }
				isSelected={ isSelected }
				onClick={ onFontClicked }
				load={ loadGoogleFonts }
				pastSeparator={ pastSeparator.current }
				isScrolling={ props.isScrolling }
				isVisible={ props.isVisible }
			/>
		);
	};

	const onReset = () => {};
	return (
		<BaseControl>
			<FontSearch value={ search } onChange={ setSearch } />

			<List
				width={ 250 }
				rowHeight={ fontItemHeight }
				rowCount={ finalList.length }
				rowRenderer={ renderRow }
				height={ displayFonts * fontItemHeight }
			/>
		</BaseControl>
	);
};

export { FontsList };
