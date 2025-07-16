import classnames from 'classnames';
import SidebarArea from './sidebar-area';

import { useDispatch, useSelect } from '@wordpress/data';
import { Animate, Button } from '@wordpress/components';
import { arrowRight, Icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { isFunction } from 'lodash';
import { STORE_KEY } from '../../store/constants';
import { useEffect, useLayoutEffect } from '@wordpress/element';
import { ArrowRight } from '@kubio/icons';
import { renderSidebars } from './sidebars-registry';

const preloadedAreas = [];

export default function SubSidebarArea({
	title,
	label,
	children,
	areaIdentifier,
	className,
	backCallback,
	parentAreaIdentifier,
	onOpen,
}) {
	const { clearSelectedBlock } = useDispatch('core/block-editor');
	const { openSidebar } = useDispatch(STORE_KEY);

	const back = () => {
		openSidebar(parentAreaIdentifier || `document`);
		clearSelectedBlock();
	};

	const returnFunction = backCallback ? () => backCallback(back) : back;

	const hasSubsidebar = useSelect(
		(select) => select(STORE_KEY).getSubSidebars[areaIdentifier]
	);
	const { addSubSidebar } = useDispatch(STORE_KEY);

	useLayoutEffect(() => {
		if (!hasSubsidebar) {
			addSubSidebar({
				areaIdentifier,
				sidebar: (
					<Animate type={'slide-in'}>
						{/* eslint-disable-next-line no-shadow */}
						{({ className }) => (
							<SidebarArea
								title={title}
								backCallback={returnFunction}
								areaIdentifier={areaIdentifier}
								className={`${className} kubio-subsidebar-content`}
							>
								{children}
								{renderSidebars(areaIdentifier)}
							</SidebarArea>
						)}
					</Animate>
				),
			});
			preloadedAreas.push(areaIdentifier);
		}
	}, [hasSubsidebar]);

	return (
		<>
			<div className={'kubio-subsidebar-container'}>
				<div
					className={classnames(
						'components-panel__header',
						'interface-complementary-area-header',
						'kubio-subsidebar-title',
						className
					)}
					tabIndex={-1}
				>
					<Button
						label={__('Open', 'kubio')}
						onClick={() => {
							clearSelectedBlock();
							openSidebar(areaIdentifier);
							if (isFunction(onOpen)) onOpen();
						}}
					>
						<strong>{label || title}</strong>
						<Icon
							icon={ArrowRight}
							className={
								'components-panel__arrow arrow_general_settings'
							}
						/>
					</Button>
				</div>
			</div>

			{/*Preload SubSidebar content to register nested sidebars*/}
			<div style={{ display: 'none' }}>{children}</div>
		</>
	);
}
