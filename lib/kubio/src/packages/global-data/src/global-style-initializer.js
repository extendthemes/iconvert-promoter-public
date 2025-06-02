import { useActiveMedia } from '@kubio/core';
import {
	useBlocksOwnerDocument,
	useOwnerDocumentChanged
} from '@kubio/editor-data';
import { styleManagerInstance } from '@kubio/style-manager';
import { __experimentalUseSimulatedMediaQuery as useSimulatedMediaQuery } from '@wordpress/block-editor';
// Initialize the global style without any need for a component
import { reactRender } from '@kubio/core';
import { pure } from '@wordpress/compose';
import { select as selectData, subscribe } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import _, { isFunction } from 'lodash';
import { KubioGlobalDataContextProvider } from './index';
import useGlobalAdditionalCSS from './use-global-additional-css';
import useGlobalDataColors from './use-global-data-colors';
import useGlobalDataFonts from './use-global-data-fonts';
import useGlobalDataStyle from './use-global-data-style';
import { useGlobalDataEntityRecord } from './with-global-style/use-global-data-entity';

const GlobalStyleInitializer = () => {
	const globalData = useGlobalDataEntityRecord();
	// wait until global data entity is available//
	if (_.isEmpty(globalData)) {
		return <></>;
	}
	return (
		<KubioGlobalDataContextProvider>
			<GlobalStyleInitializer_ globalData={globalData} />
		</KubioGlobalDataContextProvider>
	);
};

const GlobalStyleInitializer_ = pure(({ globalData }) => {
	const { initStyle, renderStyle } = useGlobalDataStyle();
	const { initColors, renderColors } = useGlobalDataColors();
	const { initFonts, renderFonts } = useGlobalDataFonts();
	const { initAdditionalCSS, renderAdditionalCSS } = useGlobalAdditionalCSS();
	const blocksOwnerDocument = useBlocksOwnerDocument();
	const media = useActiveMedia();

	// set style manager media
	useEffect(() => {
		if (top.isKubioBlockEditor && top.document === blocksOwnerDocument) {
			return;
		}

		styleManagerInstance(blocksOwnerDocument).setActiveMedia(media);
	}, [media, blocksOwnerDocument]);

	const mediaWidths = {
		tablet: 1023,
		mobile: 767,
		desktop: null,
	};

	// @WP59-ISSUE in wp 5.9 useSimulatedMediaQuery does not exists anymore
	if (isFunction(useSimulatedMediaQuery)) {
		useSimulatedMediaQuery('resizable-kubio-section', mediaWidths[media]);
	}
	useOwnerDocumentChanged((ownerDocument) => {
		if (top.isKubioBlockEditor && ownerDocument === top.document) {
			return;
		}

		renderColors(ownerDocument);
		initFonts();
		renderStyle(ownerDocument);
		renderAdditionalCSS();
	});

	useEffect(() => {
		if (!window.isKubioBlockEditor) {
			renderColors();
			renderFonts();
			renderAdditionalCSS();
		}
	}, [globalData]);

	useEffect(() => {
		if (!window.isKubioBlockEditor) {
			initStyle(); // Calls the renderStyle so it's handled by the renderStyle in kubio editor
			initColors(); // calls the renderColors so it's handled by the renderColors in the kubio editor
			initFonts();
			initAdditionalCSS(); // calls the renderAdditionalCSS so it's handled by the renderAdditionalCSS in the kubio editor
		}
	}, []);
	return <></>;
});

const initialize = () => {
	const unsubscribe = subscribe(() => {
		const { isResolving, getSettings } = selectData('core/block-editor');
		const editorSettings = selectData('core/editor')?.getEditorSettings();
		const settings = {
			...(editorSettings || {}),
			...getSettings(),
		};

		if (
			isResolving &&
			!isResolving() &&
			settings.kubioGlobalStyleEntityId
		) {
			unsubscribe();
			const container = document.createElement('div');
			reactRender(<GlobalStyleInitializer />, container);
		}
	});
};

export default initialize;
