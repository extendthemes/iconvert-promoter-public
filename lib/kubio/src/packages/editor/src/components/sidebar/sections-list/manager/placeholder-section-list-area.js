import { ControlNotice } from '@kubio/controls';
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { Fragment, useRef } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';
import classnames from 'classnames';
import _ from 'lodash';
import {
	INSERTER_TYPES_BY_AREA,
	LABEL_BY_TEMPLATE_PART_AREA,
	TEMPLATE_PARTS_AREAS,
} from '../index';

const STORE_KEY = 'kubio/edit-site';
const PlaceholderSectionListArea = ({ name: templatePartName = '', area }) => {
	const ref = useRef();

	const { setOpenInserter } = useDispatch(STORE_KEY);

	const openedInserter = useSelect((select) => {
		select(STORE_KEY).getOpenedInserter();
	});

	const label = LABEL_BY_TEMPLATE_PART_AREA[area];

	const buttonStyling = (name, extraClasses = []) => {
		if (area === TEMPLATE_PARTS_AREAS.HEADER) {
			return ['btn-primary', 'header-button']
				.concat(extraClasses)
				.join(' ');
		}

		return ['btn-primary'].concat(extraClasses).join(' ');
	};

	const buttonContent = () => {
		switch (area) {
			case TEMPLATE_PARTS_AREAS.HEADER:
				return __('Choose header design', 'kubio');
			case TEMPLATE_PARTS_AREAS.FOOTER:
				return __('Choose footer design', 'kubio');
			case TEMPLATE_PARTS_AREAS.SIDEBAR:
				return __('Add section', 'kubio');
			default:
				return __('Add predesigned section', 'kubio');
		}
	};

	const addSection = async (sectionArea = area) => {
		const patternInserterType = _.get(
			INSERTER_TYPES_BY_AREA,
			sectionArea,
			INSERTER_TYPES_BY_AREA[TEMPLATE_PARTS_AREAS.CONTENT]
		);

		const nextOpenedInserter = `pattern-inserter/${patternInserterType}`;

		if (openedInserter !== nextOpenedInserter) {
			await setOpenInserter(false, null);
		}

		setOpenInserter(nextOpenedInserter, area);
	};
	function addContentSection() {
		addSection(TEMPLATE_PARTS_AREAS.CONTENT);
	}

	const containerClasses = [
		'kubio-full-section',
		'kubio-full-section--placeholder',
	];

	const labelLowercase = label?.toLowerCase();

	return (
		<Fragment>
			<div ref={ref} className={containerClasses.join(' ')}>
				<div className={'kubio-subsidebar-container'}>
					<div
						className={classnames(
							'components-panel__header',
							'interface-complementary-area-header',
							'kubio-subsidebar-title',
							'kubio-subsidebar-title-header'
						)}
						tabIndex={-1}
					>
						<div className={'kubio-sidebar-title-text'}>
							{label}
						</div>
						<div className="dummy-column" />

						<div className="section-list-header-buttons-holder">
							<Button
								isSmall
								icon={plus}
								className={'section-icon-container'}
								onClick={addContentSection}
								showTooltip
								tooltipPosition={'top left'}
								label={__('Add block/section', 'kubio')}
							/>
						</div>
					</div>
				</div>
				<ControlNotice
					content={sprintf(
						__(
							'The current page uses the theme %s. Use the button below to replace it with a Kubio %s',
							'kubio'
						),
						labelLowercase,
						labelLowercase
					)}
				/>
				<Button
					isPrimary
					onClick={() => addSection()}
					className={buttonStyling(templatePartName, [
						'kubio-button-add-blocks',
					])}
				>
					<span
						className={classnames(
							'kubio-header-section-main-button',
							{
								'header-button':
									templatePartName ===
									TEMPLATE_PARTS_AREAS.HEADER,
							}
						)}
					>
						{buttonContent(templatePartName)}
					</span>
				</Button>
			</div>
		</Fragment>
	);
};

export { PlaceholderSectionListArea };
