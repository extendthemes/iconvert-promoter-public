import {
	Icon,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalStyleProvider as StyleProvider,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { KubioLogo } from '@kubio/icons';
import { isKubioEditor } from '@kubio/core';

const BlockPlaceholder = ({
	children,
	description = '',
	title = '',
	icon = KubioLogo,
	isSmall = false,
	stopPropagation = true,
	preventDefault = true,
}) => {
	const classes = classNames('h-block-placeholder', {
		'h-block-placeholder--small': isSmall,
		'wp-block': !isKubioEditor(), // add this class to make the notice centered
	});

	const onContainerClick = useCallback(
		(event) => {
			if (stopPropagation) {
				event.stopPropagation();
			}
			if (preventDefault) {
				event.preventDefault();
			}
		},
		[stopPropagation, preventDefault]
	);

	return (
		<StyleProvider document={top.document}>
			<div className={classes} onClick={onContainerClick}>
				{(!!icon || !!title) && (
					<div className={'h-block-placeholder__title'}>
						{icon && <Icon icon={icon} size={20} />}
						{title}
					</div>
				)}

				{description && (
					<div className={'h-block-placeholder__description'}>
						{description}
					</div>
				)}
				{children && (
					<div className={'h-block-placeholder__controls'}>
						{children}
					</div>
				)}
			</div>
		</StyleProvider>
	);
};

const SmallPlaceholder = ({ message }) => {
	return (
		<BlockPlaceholder
			isSmall
			icon={false}
			description={message}
		></BlockPlaceholder>
	);
};

const Spinner = () => {
	const backgroundImage = useSelect((select) => {
		const { siteUrl } = select('core/block-editor').getSettings();
		return `url('${siteUrl}/wp-admin/images/spinner.gif')`;
	}, []);

	const style = {
		backgroundImage,
	};

	return <span className="h-block-placeholder__spinner" style={style} />;
};

const LoadingPlaceholder = ({ message = __('Loading…', 'kubio') }) => {
	return (
		<SmallPlaceholder
			message={
				<div className="h-block-placeholder__spinner--wrapper">
					<Spinner />
					<span>{message}</span>
				</div>
			}
		/>
	);
};

export { BlockPlaceholder, LoadingPlaceholder, SmallPlaceholder };
