import { ControlNotice, CodeMirrorControl } from '@kubio/controls';
import { useCurrentPageBodyClasses } from '@kubio/editor-data';
import { useGlobalAdditionalCSS } from '@kubio/global-data';
import { STORE_KEY } from '@kubio/constants';
import { PanelBody, TextareaControl } from '@wordpress/components';
import { useDebounce } from '@wordpress/compose';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import SubSidebarArea from '../../subsidebar-area';
import { useSelect } from '@wordpress/data';

function AdditionalCSSPanel() {
	const bodyClasses = useCurrentPageBodyClasses();
	const { additionalCSS, setAdditionalCSS } = useGlobalAdditionalCSS();
	const [css, setCss] = useState(additionalCSS);

	useEffect(() => {
		if (additionalCSS !== css) {
			setCss(additionalCSS);
		}
	}, [additionalCSS]);

	const setAdditionalCSSDebounced = useDebounce(setAdditionalCSS, 300);

	const onChange = (nextValue) => {
		setAdditionalCSSDebounced(nextValue);
		setCss(nextValue);
	};

	return (
		<PanelBody initialOpen={true} title={__('Additional CSS', 'kubio')}>
			<CodeMirrorControl value={css} onChange={onChange} mode={'css'} />

			{bodyClasses && !!bodyClasses.length && (
				<ControlNotice
					content={
						<>
							<span>
								{__(
									'Current page has the following classes that can be used as top selectors:',
									'kubio'
								)}
							</span>
							<div>
								<strong>{bodyClasses.join(', ')}</strong>
							</div>
						</>
					}
				/>
			)}
		</PanelBody>
	);
}

const AditionalCSSWrapper = ({ areaIdentifier }) => {
	const currentSidebar = useSelect(
		(select) => select(STORE_KEY).getEditorOpenedSidebar(),
		[]
	);
	const shouldRender = currentSidebar?.endsWith(areaIdentifier);

	return <>{shouldRender && <AdditionalCSSPanel />}</>;
};

const AdditionalCSS = ({ parentAreaIdentifier }) => {
	return (
		<SubSidebarArea
			title={__('Additional CSS', 'kubio')}
			parentAreaIdentifier={parentAreaIdentifier}
			areaIdentifier={`${parentAreaIdentifier}/additional-css`}
		>
			<AditionalCSSWrapper
				areaIdentifier={`${parentAreaIdentifier}/additional-css`}
			/>
		</SubSidebarArea>
	);
};

export default AdditionalCSS;
