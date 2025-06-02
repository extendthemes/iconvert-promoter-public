import { addProTagToItem, ProItem } from '@kubio/pro';
import { BlockSettingsMenuControls } from '@wordpress/block-editor';
import { MenuGroup, MenuItem } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _, { omit } from 'lodash';
import { generate as generateId } from 'shortid';
import { useKubioNotices } from '../../notices';

const noticeOptions = {
	isDismissable: true,
	duration: 10000,
};

const CopyPasteStyle = ( props ) => {
	const { createSuccessNotice } = useKubioNotices();
	const { onClose } = props;

	const onCopy = () => {
		copyStyle( props );
		createSuccessNotice(
			__( `Block style was copied`, 'kubio' ),
			noticeOptions
		);
		onClose();
	};

	const onPasteAndLink = () => {
		pasteStyle( props, true );
		createSuccessNotice(
			__(
				`Block style was applied and the blocks are now linked`,
				'kubio'
			),
			noticeOptions
		);
		onClose();
	};
	const onPaste = () => {
		pasteStyle( props, false );
		createSuccessNotice(
			__( `Block style was applied`, 'kubio' ),
			noticeOptions
		);
		onClose();
	};

	const item = addProTagToItem( {} );

	return (
		<MenuGroup className={ 'kubio-block-settings-control' }>
			<ProItem
				item={ item }
				tag={ MenuItem }
				onClick={ onCopy }
				urlArgs={ { source: 'toolbar', content: 'copy-style' } }
			>
				{ __( 'Copy style', 'kubio' ) }
			</ProItem>
			<ProItem
				item={ item }
				tag={ MenuItem }
				onClick={ onPasteAndLink }
				urlArgs={ { source: 'toolbar', content: 'page-style-link' } }
			>
				{ __( 'Paste style and link', 'kubio' ) }
			</ProItem>
			<ProItem
				item={ item }
				tag={ MenuItem }
				onClick={ onPaste }
				urlArgs={ { source: 'toolbar', content: 'page-style' } }
			>
				{ __( 'Paste style', 'kubio' ) }
			</ProItem>
		</MenuGroup>
	);
};

const COPY_STYLE_KEY = 'kubio/style/copy';

const blockStyleKey = ( name ) => {
	return COPY_STYLE_KEY + '/' + name;
};

const pasteStyle = ( { name, attributes, setAttributes }, link = false ) => {
	let value = window.localStorage.getItem( blockStyleKey( name ) );
	if ( value ) {
		value = JSON.parse( value );
		const styleRef = link ? value.styleRef : attributes?.kubio?.styleRef;
		value = omit( value, 'id', '_style', '_props' );
		setAttributes( {
			...attributes,
			kubio: {
				...value,
				styleRef: styleRef || generateId(),
				hash: generateId(),
			},
		} );
	}
};
const copyStyle = ( { name, attributes } ) => {
	window.localStorage.setItem(
		blockStyleKey( name ),
		JSON.stringify( attributes.kubio )
	);
};
const thirdPartyBlocksForStyleToolbar = [
	'core/calendar',
	'core/tag-cloud',
	'core/archives',
	'core/categories',
	'core/latest-comments',
	'core/latest-posts',
	'core/page-list',
	'core/rss',
	'core/search',
	'core/social-links',
	'core/tag-cloud',
];
function blockSupportsStyleToolbar( blockName = '' ) {
	if ( thirdPartyBlocksForStyleToolbar.includes( blockName ) ) {
		return true;
	}
	const blockNameParts = blockName.split( '/' );
	const themeName = _.get( blockNameParts, 0 );
	return themeName === 'kubio' || themeName === 'cspromo';
}

const withCopyStyleToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const supportsStyleToolbar = useMemo( () => {
			return blockSupportsStyleToolbar( props?.name );
		}, [ props.name ] );
		return (
			<>
				<BlockEdit { ...props } />
				{ props?.isSelected && supportsStyleToolbar && (
					<BlockSettingsMenuControls>
						{ ( { onClose } ) => (
							<CopyPasteStyle { ...props } onClose={ onClose } />
						) }
					</BlockSettingsMenuControls>
				) }
			</>
		);
	};
} );

export { withCopyStyleToolbar };
