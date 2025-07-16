import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalLinkControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__unstableEditorStyles as EditorStyles,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__unstableUseMouseMoveTypingReset as useMouseMoveTypingReset,
} from '@wordpress/block-editor';
import { compose, createHigherOrderComponent, pure } from '@wordpress/compose';
import { useEntityBlockEditor } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';
import { STORE_KEY } from '../../store/constants';
import NavigateToLink from '../navigate-to-link';
import { SidebarInspectorFill } from '../sidebar';
import AdvancedBlockInspector from '../sidebar/advanced-block-inspector';
import { Iframe } from './iframe';
import { IframeContent } from './iframe-content';
import { IframeWrapper } from './iframe-wrapper';
import { iframeStyle } from './utils';

import { useSiteEditorSettings } from './use-site-editor-settings';

const withCurrentEditorEntity = createHigherOrderComponent(
	( WrappedComponent ) => ( ownProps ) => {
		const { templateType, page, deviceType, templateId } = useSelect(
			( select ) => {
				const {
					getTemplateType,
					getTemplateId,
					getPage,
					__experimentalGetPreviewDeviceType,
				} = select( STORE_KEY );
				return {
					templateType: getTemplateType(),
					templateId: getTemplateId(),
					page: getPage(),
					deviceType: __experimentalGetPreviewDeviceType(),
				};
			},
			[]
		);

		const settings = useSiteEditorSettings();

		const newProps = {
			settings,
			templateType,
			page,
			deviceType,
			templateId,
		};

		return page || templateType ? (
			<WrappedComponent { ...ownProps } { ...newProps } />
		) : null;
	},
	'currentEditorEntity'
);

function FSEThemeBlockEditor( {
	settings,
	templateType,
	page,
	deviceType,
	templateId,
} ) {


	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		templateType,
		{ id: templateId }
	);

	const { setPage } = useDispatch( STORE_KEY );

	const ref = useMouseMoveTypingReset();

	const headHTML = window.__kubioEditorStyles.html + iframeStyle;

	const isKubioTemplate = useSelect(
		( select ) => {
			const source = select( STORE_KEY ).getCurrentKubioTemplateSource();

			return source?.startsWith( 'kubio' );
		},
		[ templateType, templateId ]
	);

	const styles = useMemo( () => {
		if ( ! isKubioTemplate ) {
			return settings.styles;
		}
		return settings.styles /* .filter(
			(style) => style.__unstableType !== 'theme'
		) */;
	}, [ isKubioTemplate, settings.styles ] );

	const iframe = useCallback(
		( mergedRefs ) => (
			<Iframe
				headHTML={ headHTML }
				ref={ ref }
				head={ <EditorStyles styles={ styles } /> }
				contentRef={ mergedRefs }
			>
				<IframeContent />
			</Iframe>
		),
		[ ref, headHTML, styles ]
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
							activePage={ page }
							onActivePageChange={ setPage }
						/>
					),
					[ page ]
				) }
			</__experimentalLinkControl.ViewerFill>
			<SidebarInspectorFill>
				<AdvancedBlockInspector />
			</SidebarInspectorFill>
			<IframeWrapper deviceType={ deviceType } iframe={ iframe } />
		</BlockEditorProvider>
	);
}

export default compose( withCurrentEditorEntity, pure )( FSEThemeBlockEditor );
