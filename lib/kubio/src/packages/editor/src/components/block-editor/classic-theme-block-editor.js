import { LayoutPicker } from '@kubio/controls';
import {
	useGetGlobalSessionProp,
	useSetGlobalSessionProp,
} from '@kubio/editor-data';
import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalLinkControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__unstableUseMouseMoveTypingReset as useMouseMoveTypingReset,
} from '@wordpress/block-editor';
import { useEntityBlockEditor } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import isEqual from 'react-fast-compare';
import { STORE_KEY } from '../../store/constants';
import NavigateToLink from '../navigate-to-link';
import { SidebarInspectorFill } from '../sidebar';
import AdvancedBlockInspector from '../sidebar/advanced-block-inspector';
import { Iframe } from './iframe';
import { IframeContent } from './iframe-content';
import { IframeWrapper } from './iframe-wrapper';
import { iframeStyle } from './utils';

import { useSiteEditorSettings } from './use-site-editor-settings';

function ClassicThemeBlockEditor() {

	const { setOpenInserter } = useDispatch( STORE_KEY );
	const [ currentPage, setCurrentPage ] = useState( {} );
	// const [render, setRender] = useState(false);

	const { page, deviceType, classicTemplateId } = useSelect(
		( select ) => {
			const {
				getEntity,
				getPage,
				getClassicTemplateId,
				__experimentalGetPreviewDeviceType,
			} = select( STORE_KEY );

			return {
				entity: getEntity(),
				page: getPage(),
				classicTemplateId: getClassicTemplateId(),
				deviceType: __experimentalGetPreviewDeviceType(),
			};
		},
		[ setOpenInserter ]
	);
	const settings = useSiteEditorSettings();

	useEffect( () => {
		if ( ! isEqual( page, currentPage ) ) {
			setCurrentPage( page );
		}
	}, [ page ] );

	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		currentPage?.context?.postType,
		{
			id: currentPage?.context?.postId,
		}
	);

	const { setPage } = useDispatch( STORE_KEY );

	const ref = useMouseMoveTypingReset();

	const setReady = useSetGlobalSessionProp( 'ready' );
	const onIframeLoad = ( iframeWindow, iframeDocument ) => {
		iframeDocument.body.id = 'kubio';
		setReady( true );
	};

	const headHTML = window.__kubioEditorStyles.html + iframeStyle;
	const blockEditorRootClasses = useGetGlobalSessionProp(
		'blockEditorRootClasses',
		''
	);
	const iframe = useCallback(
		( mergedRefs ) =>
			currentPage?.path && (
				<Iframe
					headHTML={ headHTML }
					ref={ ref }
					// head={<EditorStyles styles={settings.styles} />}
					contentRef={ mergedRefs }
					src={ addQueryArgs( currentPage?.path, {
						'__kubio-site-edit-iframe-preview': true,
						'__kubio-site-edit-iframe-classic-template':
							classicTemplateId,
					} ) }
					contentHolderSelector={ '#kubio-site-edit-content-holder' }
					assetsHolderSelector={ '#kubio-site-edit-assets-holder' }
					onLoad={ onIframeLoad }
					execStylesheetCompat={ false }
				>
					<IframeContent className={ blockEditorRootClasses }>
						<LayoutPicker />
					</IframeContent>
				</Iframe>
			),
		[
			currentPage?.path,
			ref,
			headHTML,
			headHTML,
			settings.styles,
			blockEditorRootClasses,
		]
	);

	return (
		<BlockEditorProvider
			settings={ settings }
			value={ blocks }
			onInput={ onInput }
			onChange={ onChange }
			useSubRegistry={ false }
		>
			<BlockEditorKeyboardShortcuts />
			<__experimentalLinkControl.ViewerFill>
				{ useCallback(
					( fillProps ) => (
						<NavigateToLink
							{ ...fillProps }
							activePage={ currentPage }
							onActivePageChange={ setPage }
						/>
					),
					[ currentPage, setPage ]
				) }
			</__experimentalLinkControl.ViewerFill>
			<SidebarInspectorFill>
				<AdvancedBlockInspector />
			</SidebarInspectorFill>
			<IframeWrapper deviceType={ deviceType } iframe={ iframe } />
		</BlockEditorProvider>
	);
}

export default ClassicThemeBlockEditor;
