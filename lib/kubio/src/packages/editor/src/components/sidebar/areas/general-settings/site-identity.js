import { STORE_KEY } from '@kubio/constants';
import {
	InputControl,
	MediaPicker,
	SeparatorHorizontalLine,
} from '@kubio/controls';
import { useSiteLogoImages } from '@kubio/global-data';
import { BaseControl, PanelBody } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import SubSidebarArea from '../../subsidebar-area';

const SiteIdentityPanel = () => {
	const {
		logoImage,
		alternateLogoImage,
		setLogoImage,
		setAlternateLogoImage,
	} = useSiteLogoImages();

	const [siteName, setSiteName] = useEntityProp('root', 'site', 'title');

	const [siteTagline, setSiteTagline] = useEntityProp(
		'root',
		'site',
		'description'
	);

	const [siteIcon, setSiteIcon] = useEntityProp('root', 'site', 'site_icon');

	const { siteIconUrl } = useSelect((select) => {
		const { getMedia } = select('core');
		return {
			siteIconUrl: getMedia(siteIcon)?.source_url || '',
		};
	});

	return (
		<PanelBody
			title={__('Site Identity', 'kubio')}
			className={'kubio-site-identity-panel'}
		>
			<BaseControl
				label={__('Site title', 'kubio')}
				id={'site-title-control'}
			>
				<InputControl
					value={siteName || ''}
					onChange={(nextValue) => setSiteName(nextValue)}
				/>
			</BaseControl>

			<BaseControl label={__('Tagline', 'kubio')} id={'tagline-control'}>
				<InputControl
					value={siteTagline || ''}
					onChange={(nextValue) => setSiteTagline(nextValue)}
				/>
			</BaseControl>

			<SeparatorHorizontalLine />

			<BaseControl
				label={__('Logo image', 'kubio')}
				id={'logo-image-control'}
			>
				<MediaPicker
					value={logoImage}
					type={'image'}
					showButton
					onReset={() => {
						setLogoImage(null);
					}}
					buttonLabel={__('Change image', 'kubio')}
					removeButtonLabel={__('Reset image', 'kubio')}
					onChange={(image) => setLogoImage(image.id)}
				/>
			</BaseControl>

			<BaseControl
				label={__('Alternate logo image', 'kubio')}
				id={'alternate-logo-image-control'}
			>
				<MediaPicker
					value={alternateLogoImage}
					type={'image'}
					showButton
					showRemoveButton
					onReset={() => {
						setAlternateLogoImage(null);
					}}
					buttonLabel={__('Change alternate image', 'kubio')}
					removeButtonLabel={__('Reset image', 'kubio')}
					onChange={(image) => setAlternateLogoImage(image.url)}
				/>
			</BaseControl>

			<SeparatorHorizontalLine />

			<BaseControl
				label={__('Site Icon', 'kubio')}
				id={'site-icon-control'}
				help={__(
					'Site Icons are what you see in browser tabs, bookmark bars, and within the WordPress mobile apps. Upload one here!',
					'kubio'
				)}
			>
				<MediaPicker
					value={siteIconUrl !== '' ? siteIconUrl : null}
					type={'image'}
					showButton
					showRemoveButton
					onReset={() => {
						setSiteIcon(null);
					}}
					buttonLabel={__('Set site icon', 'kubio')}
					onChange={(image) => setSiteIcon(image.id)}
				/>
			</BaseControl>
		</PanelBody>
	);
};

const SiteIdentityWrapper = ({ areaIdentifier }) => {
	const currentSidebar = useSelect(
		(select) => select(STORE_KEY).getEditorOpenedSidebar(),
		[]
	);
	const shouldRender = currentSidebar?.endsWith(areaIdentifier);

	return <>{shouldRender && <SiteIdentityPanel />}</>;
};

export default function SiteIdentity({ parentAreaIdentifier }) {
	return (
		<SubSidebarArea
			title={__('Site Identity', 'kubio')}
			parentAreaIdentifier={parentAreaIdentifier}
			areaIdentifier={`${parentAreaIdentifier}/site-identity`}
		>
			<SiteIdentityWrapper
				areaIdentifier={`${parentAreaIdentifier}/site-identity`}
			/>
		</SubSidebarArea>
	);
}
