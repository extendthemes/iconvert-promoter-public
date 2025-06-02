import {
	Card,
	CardBody,
	__experimentalGrid as Grid,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useContext, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ENTER } from '@wordpress/keycodes';
import classnames from 'classnames';
import isEqual from 'react-fast-compare';
import { GlobalStylesContext } from './context';
/**
 * Internal dependencies
 */
import { mergeBaseAndUserConfigs } from './global-styles-provider';
import ScreenHeader from './header';
import StylesPreview from './preview';

function compareVariations(a, b) {
	return isEqual(a.styles, b.styles) && isEqual(a.settings, b.settings);
}

function Variation({ variation }) {
	const { base, user, setUserConfig } = useContext(GlobalStylesContext);
	const context = useMemo(() => {
		return {
			user: {
				settings: variation.settings ?? {},
				styles: variation.styles ?? {},
			},
			base,
			merged: mergeBaseAndUserConfigs(base, variation),
			setUserConfig: () => {},
		};
	}, [variation, base]);

	const selectVariation = () => {
		setUserConfig(() => {
			return {
				settings: variation.settings,
				styles: variation.styles,
			};
		});
	};

	const selectOnEnter = (event) => {
		if (event.keyCode === ENTER) {
			event.preventDefault();
			selectVariation();
		}
	};

	const isActive = useMemo(() => {
		return compareVariations(user, variation);
	}, [user, variation]);

	return (
		<GlobalStylesContext.Provider value={context}>
			<div
				className={classnames(
					'edit-site-global-styles-variations_item',
					{
						'is-active': isActive,
					}
				)}
				role="button"
				onClick={selectVariation}
				onKeyDown={selectOnEnter}
				tabIndex="0"
			>
				<StylesPreview height={100} />
			</div>
		</GlobalStylesContext.Provider>
	);
}

function ScreenStyleVariations() {
	const { variations } = useSelect((select) => {
		return {
			variations: select(
				coreStore
			).__experimentalGetCurrentThemeGlobalStylesVariations(),
		};
	}, []);

	const withEmptyVariation = useMemo(() => {
		return [
			{
				name: __('Default', 'kubio'),
				settings: {},
				styles: {},
			},
			...variations,
		];
	}, [variations]);

	return (
		<>
			<ScreenHeader
				back="/"
				title={__('Other styles', 'kubio')}
				description={__(
					'Choose a different style combination for the theme styles',
					'kubio'
				)}
			/>

			<Card size="small" isBorderless>
				<CardBody>
					<Grid columns={2}>
						{withEmptyVariation?.map((variation, index) => (
							<Variation key={index} variation={variation} />
						))}
					</Grid>
				</CardBody>
			</Card>
		</>
	);
}

export default ScreenStyleVariations;
