import { ArrowLeft } from '@kubio/icons';
import { Button } from '@wordpress/components';
import { Icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { ComplementaryArea } from '@wordpress/interface';
import classnames from 'classnames';
import { useUIVersion } from '@kubio/core-hooks';
import { STORE_KEY } from '../../store/constants';
import { AddBlockButton } from '../secondary-sidebar/inserter-sidebar';
import { renderSidebars } from './sidebars-registry';

export default function SidebarArea({
	areaIdentifier,
	title,
	backCallback = null,
	children,
	className,
}) {
	const { uiVersion: KUBIO_UI_VERSION } = useUIVersion();

	return (
		<ComplementaryArea
			scope={`${STORE_KEY}/sidebars`}
			complementaryAreaIdentifier={`${STORE_KEY}/sidebar/${areaIdentifier}`}
			identifier={`${STORE_KEY}/sidebar/${areaIdentifier}`}
			isPinnable={false}
			className={classnames(
				className,
				backCallback ? 'kubio-sidebar-header-block' : ''
			)}
			header={
				<div
					className={classnames(
						'components-panel__header',
						'kubio-sidebar-header',
						'accordion-section-title',
						backCallback ? 'kubio-sidebar-header--has-back' : ''
					)}
					tabIndex={-1}
				>
					{backCallback && (
						<Button
							className={'kubio-sidebar-header-back-button'}
							onClick={backCallback}
							showTooltip
							label={__('Back', 'kubio')}
						>
							<Icon
								icon={ArrowLeft}
								className={'kubio-sidebar-header-arrow'}
							/>
						</Button>
					)}
					<strong>
						{typeof title === 'function' ? title() : title}
					</strong>
					{KUBIO_UI_VERSION === 2 && (
						<AddBlockButton
							className={'kubio-inserter-button'}
							variant={'primary'}
						/>
					)}
				</div>
			}
		>
			{children}
			{renderSidebars(areaIdentifier)}
		</ComplementaryArea>
	);
}
