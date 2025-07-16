import { addQueryArgs } from '@wordpress/url';
import { getStringValueWithId } from './strings-by-id';

const noticeMessage = ( props ) => {
	let msg =
		props.title ||
		getStringValueWithId(
			props.msgid ? props.msgid : 'pro.infobox.default'
		);
	const propsList = props.include ? props.include.join( ', ' ) : '';
	msg = msg.replace( '{{props}}', propsList );
	msg = msg.replace( /\[pro-link\]([\w]+)\[\/pro-link\]/, '' );
	return msg;
};

const upgradeToProURL = ( urlArgs = {} ) => {
	const { source, content, ...rest } = urlArgs;
	return addQueryArgs( getStringValueWithId( 'pro.pricing_link', '_blank' ), {
		utm_medium: 'editor',
		utm_source: source,
		utm_content: content,
		upgrade_key: top.kubioAIUpgradeKey || '',
		...rest,
	} );
};

const upgradeToPro = ( urlArgs = {} ) => {
	const win = window.open( upgradeToProURL( urlArgs ) );
	win?.focus?.();
};

const tryOnlinePrepareURL = ( urlArgs = {} ) => {
	let url = getStringValueWithId( 'pro.try.link' );

	if ( top.kubioUtilsData.last_imported_starter ) {
		const [ base, query ] =
			top.kubioUtilsData.try_starter_site.split( '?' );
		url =
			base.replace( /\/+$/, '' ) +
			`/${ top.kubioUtilsData.last_imported_starter }?${ query }`;
	}

	const { source, content, ...rest } = urlArgs;

	url = addQueryArgs( url, {
		utm_medium: 'editor',
		utm_source: source,
		utm_content: content,
		...rest,
	} );

	return url;
};

let tryOnlineWindow = null;
const tryOnline = ( urlArgs = {} ) => {
	if ( ! tryOnlineWindow || tryOnlineWindow.closed ) {
		const url = tryOnlinePrepareURL( urlArgs );
		tryOnlineWindow = window.open( url, '_blank' );
	}

	tryOnlineWindow?.focus?.();
};

export {
	noticeMessage,
	upgradeToPro,
	tryOnline,
	upgradeToProURL,
	getStringValueWithId,
};
