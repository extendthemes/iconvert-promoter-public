import { __ } from '@wordpress/i18n';
import { WooCommerceButton } from './woocommerce-button';
import { WooCommerceOnSaleBadge } from './woocommerce-sale-badge';

const WooCommerceStyleSidebarArea = () => {
	return (
		<>
			<WooCommerceButton
				title={__('Primary button', 'kubio')}
				styledElement={'wc-alt-button'}
			/>
			<WooCommerceButton
				title={__('Secondary button', 'kubio')}
				styledElement={'wc-button'}
			/>
			<WooCommerceOnSaleBadge />
		</>
	);
};

export { WooCommerceStyleSidebarArea };
