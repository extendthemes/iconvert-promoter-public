/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalGetSettings as getDateSettings } from '@wordpress/date';
import { timezones } from './timezones-simplified';
/**
 * Internal dependencies
 */
import { Tooltip } from '@wordpress/components';

function wpTimezoneChoice( selectedUtc, serverUtc ) {
	// Do manual UTC offsets.
	const structure = [];
	const options = [
		{
			utcOffset: 0,
			offset: 0,
			offsetName: __( 'Select timezone', 'iconvert-promoter' ),
		},
	];

	if ( selectedUtc.length < 10 ) {
		selectedUtc = Intl.DateTimeFormat( 'en' ).resolvedOptions().timeZone;
	}

	timezones.forEach( ( item, index ) => {
		const tz = Object.keys( item )[ 0 ];
		options.push( {
			utcOffset: '',
			offset: tz,
			offsetName: tz,
		} );
	} );
	options.forEach( buildOptions );

	function buildOptions( item, index ) {
		const { offset, offsetName, utcOffset } = item;

		let selected = '';

		if ( offset === selectedUtc ) {
			selected = 'selected="selected" ';
		}

		structure.push(
			'<option ' +
				selected +
				' value="' +
				offset +
				'">' +
				offsetName +
				'</option>'
		);
	}

	return structure.join( '\n' );
}
/**
 * Displays timezone information when user timezone is different from site timezone.
 *
 * @param root0
 * @param root0.offsetTimezone
 * @param root0.onchange
 */
const TimeZone = ( { offsetTimezone, onchange } ) => {
	const { timezone } = getDateSettings();

	//Overwrite - Default Wp
	if ( offsetTimezone && onchange ) {
		return (
			<select
				onChange={ onchange }
				dangerouslySetInnerHTML={ {
					__html: wpTimezoneChoice( offsetTimezone, timezone.offset ),
				} }
			></select>
		);
	}

	//Default Wp
	const offsetSymbol = timezone.offset >= 0 ? '+' : '';
	const zoneAbbr =
		'' !== timezone.abbr && isNaN( timezone.abbr )
			? timezone.abbr
			: `UTC${ offsetSymbol }${ timezone.offset }`;

	const timezoneDetail =
		'UTC' === timezone.string
			? __( 'Coordinated Universal Time', 'iconvert-promoter' )
			: `(${ zoneAbbr }) ${ timezone.string.replace( '_', ' ' ) }`;

	return (
		<Tooltip position="top center" text={ timezoneDetail }>
			<div className="components-datetime__timezone">{ zoneAbbr }</div>
		</Tooltip>
	);
};

export default TimeZone;
