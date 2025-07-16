import { BaseControl, Button, Flex } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';
import { ColorIndicatorPopover, PopoverOptionsButton } from '../../components';
import { useDispatch } from '@wordpress/data';
import { STORE_KEY } from '@kubio/constants';
import { WithInheritedTypography } from '../../hocs/with-inherited-typography';
import _ from 'lodash';
import { applyFilters } from '@wordpress/hooks';

const showEditThemeDefaults = applyFilters(
	'kubio.style-controls.showEditThemeDefaults',
	true
);

const TypographyContainerControl = (props) => {
	const { clearSelectedBlock } = useDispatch('core/block-editor');

	let {
		onChange = _.noop,
		onReset = _.noop,
		value: currentValue = {},
		readValue,
		alpha = false,
	} = props;

	const { openSidebar } = useDispatch(STORE_KEY) || {};

	readValue = readValue || currentValue;

	const setValue = (path) => (event) => {
		const changes = _.set({}, `holders.${path}`, event);
		onChange(changes);
	};

	const getValue = (path) => {
		return _.get(readValue, `holders.${path}`);
	};

	const headings = [];
	for (let i = 1; i <= 6; i++) {
		headings.push({ tag: 'h' + i, label: `Heading ${i}` });
	}

	const setAllHeaders = (event) => {
		const newData = {};
		_.each(headings, (heading) => {
			const path = heading.tag + '.color';
			_.set(newData, `holders.${path}`, event);
		});

		onChange(newData);
	};

	const resetAllHeaders = () => {
		_.each(headings, (heading) => {
			const path = heading.tag + '.color';
			onReset(`holders.${path}`);
		});
	};

	const resetValue = (path) => () => {
		onReset(`holders.${path}`);
	};

	return (
		<BaseControl className={'kubio-typography-container-control-container'}>
			<ColorIndicatorPopover
				label={__('Text color', 'kubio')}
				color={getValue('p.color')}
				onChange={setValue('p.color')}
				onReset={resetValue('p.color')}
				showReset={true}
				disableAlpha={alpha}
			/>

			<Flex className={'color-indicator-with-cog'}>
				<ColorIndicatorPopover
					label={__('Heading color', 'kubio')}
					color={getValue('h1.color')}
					onChange={setAllHeaders}
					showReset={true}
					onReset={resetAllHeaders}
					disableAlpha={alpha}
				/>
				<div
					style={{
						marginBottom: '8px',
						position: 'absolute',
						right: 80,
					}}
				>
					<PopoverOptionsButton
						popupContent={
							<>
								{[1, 2, 3, 4, 5, 6].map((i) => (
									<ColorIndicatorPopover
										key={i}
										label={sprintf(
											/* translators: %s is replaced with the heading number */
											__(`Heading %s color`, 'kubio'),
											i
										)}
										color={getValue(`h${i}.color`)}
										onChange={setValue(`h${i}.color`)}
										showReset={true}
										onReset={resetValue(`h${i}.color`)}
										disableAlpha={alpha}
									/>
								))}
							</>
						}
					/>
				</div>
			</Flex>

			<ColorIndicatorPopover
				label={__('Link color', 'kubio')}
				color={getValue('a.color')}
				onChange={setValue('a.color')}
				showReset={true}
				onReset={resetValue('a.color')}
				disableAlpha={alpha}
			/>
			<ColorIndicatorPopover
				label={__('Hover link color', 'kubio')}
				color={getValue('a.states.hover.color')}
				onChange={setValue('a.states.hover.color')}
				showReset={true}
				onReset={resetValue('a.states.hover.color')}
				disableAlpha={alpha}
			/>
			{openSidebar && showEditThemeDefaults && (
				<div
					className={
						'kubio-typography-for-text-button-edit-theme-default'
					}
				>
					<Button
						isPrimary
						onClick={() => {
							clearSelectedBlock().then(() => {
								openSidebar(
									'document/general-settings/typography'
								);
							});
						}}
						className={'kubio-button-100'}
					>
						{__('Edit theme defaults', 'kubio')}
					</Button>
				</div>
			)}
		</BaseControl>
	);
};

export default WithInheritedTypography(TypographyContainerControl);
