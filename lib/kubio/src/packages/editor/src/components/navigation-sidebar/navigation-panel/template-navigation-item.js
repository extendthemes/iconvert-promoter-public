/**
 * WordPress dependencies
 */
import {
	Button,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigationItem as NavigationItem,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { STORE_NAME } from '../../../store/constants';
import { ChangeEntityModal } from './modals/change-entity-modal';

export default function TemplateNavigationItem({ item, icon }) {
	const { title, description, isActive } = useSelect((select) => {
		const { getPage, getTemplateId, getTemplatePartId } = select(
			STORE_NAME
		);

		const currentEntities = [
			getPage()?.context?.postId?.toString(),
			getTemplateId(),
			getTemplatePartId(),
		].filter(Boolean);

		const titleAndDesc =
			'wp_template' === item.type
				? select('core/editor').__experimentalGetTemplateInfo(item)
				: {
						title: item?.title?.rendered || item?.slug,
						description: '',
				  };

		return {
			...titleAndDesc,
			isActive: currentEntities.includes(item.id.toString()),
		};
	}, []);

	const {
		setTemplate,
		setTemplatePart,
		setIsNavigationPanelOpened,
		setPage,
	} = useDispatch(STORE_NAME);

	const [displayModal, setDisplayModal] = useState(false);

	const onNavigationItemClick = useCallback(() => {
		if (isActive) {
			return;
		}

		setDisplayModal(true);
	}, [setDisplayModal, isActive]);

	if (!item) {
		return null;
	}

	const onActivateItem = () => {
		if ('wp_template' === item.type) {
			setTemplate(item.id, item.slug, true);
		} else {
			setTemplatePart(item.id);
		}
		// setPage(null);
		setIsNavigationPanelOpened(false);
	};

	const className = classNames('edit-site-navigation-panel__template-item', {
		'kubio-navigation-item-active': isActive,
	});

	return (
		<NavigationItem
			className={className}
			item={`${item.type}-${item.id}`}
			title={title}
			icon={icon}
		>
			<Button onClick={onNavigationItemClick}>
				<span className="edit-site-navigation-panel__info-wrapper">
					<div className="edit-site-navigation-panel__template-item-title">
						{'draft' === item.status && (
							<em>{__('[Draft]', 'kubio')}</em>
						)}
						{title}
					</div>
					{description && (
						<div className="edit-site-navigation-panel__template-item-description">
							{description}
						</div>
					)}
				</span>
			</Button>

			{displayModal && (
				<ChangeEntityModal
					onComplete={onActivateItem}
					closeModal={() => setDisplayModal(false)}
					entityName={title}
				/>
			)}
		</NavigationItem>
	);
}
