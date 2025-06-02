import { KubioBlockAppender } from '@kubio/block-library';

import {
	useGetGlobalSessionProp,
	useGlobalSessionProp,
} from '@kubio/editor-data';
import {
	BlockList,
	MediaUpload,
	MediaUploadCheck,
	store as blockEditorStore,
	useSetting,
	WritingFlow,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import {
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from '@wordpress/element';
import classNames from 'classnames';
import { handleLoadScript } from '../../utils/load-scripts';
import { getShowInternalFeatures } from '@kubio/utils';

const IframeContent = ( props ) => {
	const { children, className } = props;
	const editorContentRef = useRef();
	const containerBgMediaUploadRef = useRef();

	const [ modalProps, setModalProps ] = useGlobalSessionProp(
		'containerBgMediaUploadRef',
		{
			dataHelper: null,
			ref: null,
			blockId: null,
			value: null,
		}
	);

	useEffect( () => {
		if ( containerBgMediaUploadRef.current !== null ) {
			setModalProps( { ...modalProps, ref: containerBgMediaUploadRef } );
		}
	}, [ containerBgMediaUploadRef.current ] );

	const isReady = useGetGlobalSessionProp( 'ready', false );
	useLayoutEffect( () => {
		const element = editorContentRef.current;
		if ( element && isReady ) {
			const scripts = element.ownerDocument
				.querySelector( '#kubio-scripts-template' )
				?.content.querySelectorAll( 'script' );

			if ( scripts ) {
				handleLoadScript(
					element.ownerDocument.head,
					Array.from( scripts )
						.map( ( { src } ) => src )
						.filter( Boolean )
				);
			}
		}
	}, [ isReady ] );

	const content = (
		<>
			<div ref={ editorContentRef } />
			<WritingFlow>
				<BlockList
					className={ classNames(
						className,
						'edit-site-block-editor__block-list',
						'kubio-block-editor__block-list'
					) }
					renderAppender={ KubioBlockAppender }
				/>
				{ children }
			</WritingFlow>
			<MediaUploadCheck>
				<MediaUpload
					allowedTypes={ [ 'image', 'video' ] }
					value={ modalProps.value }
					onSelect={ ( image ) => {
						const { dataHelper } = modalProps;

						if ( ! dataHelper ) {
							return;
						}

						const background = dataHelper.getStyle( 'background' );

						if (
							background.type === 'image' &&
							image.type === 'image'
						) {
							background.image[ 0 ].source.url = image.url;
						} else if (
							background.type === 'video' &&
							image.type === 'video'
						) {
							background.video.internal.url = image.url;
						}
						dataHelper.setStyle( 'background', background );
					} }
					render={ ( { open } ) => (
						// eslint-disable-next-line jsx-a11y/click-events-have-key-events
						<div
							ref={ containerBgMediaUploadRef }
							onClick={ open }
						></div>
					) }
				/>
			</MediaUploadCheck>
		</>
	);

	return content;
};

export { IframeContent };
