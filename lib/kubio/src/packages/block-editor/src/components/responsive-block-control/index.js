/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, _x, sprintf } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ResponsiveBlockControlLabel from './label';

function ResponsiveBlockControl( props ) {
	const {
		title,
		property,
		toggleLabel,
		onIsResponsiveChange,
		renderDefaultControl,
		renderResponsiveControls,
		isResponsive = false,
		defaultLabel = {
			id: 'all',
			label: _x( 'All', 'screen sizes', 'kubio' ),
		},
		viewports = [
			{
				id: 'small',
				label: __( 'Small screens', 'kubio' ),
			},
			{
				id: 'medium',
				label: __( 'Medium screens', 'kubio' ),
			},
			{
				id: 'large',
				label: __( 'Large screens', 'kubio' ),
			},
		],
	} = props;

	if ( ! title || ! property || ! renderDefaultControl ) {
		return null;
	}

	const toggleControlLabel =
		toggleLabel ||
		sprintf(
			/* translators: %s: Property value for the control (eg: margin, padding, etc.). */
			__( 'Use the same %s on all screensizes.', 'kubio' ),
			property
		);

	const toggleHelpText = __(
		'Toggle between using the same value for all screen sizes or using a unique value per screen size.',
		'kubio'
	);

	const defaultControl = renderDefaultControl(
		<ResponsiveBlockControlLabel
			property={ property }
			viewport={ defaultLabel }
		/>,
		defaultLabel
	);

	const defaultResponsiveControls = () => {
		return viewports.map( ( viewport ) => (
			<Fragment key={ viewport.id }>
				{ renderDefaultControl(
					<ResponsiveBlockControlLabel
						property={ property }
						viewport={ viewport }
					/>,
					viewport
				) }
			</Fragment>
		) );
	};

	return (
		<fieldset className="block-editor-responsive-block-control">
			<legend className="block-editor-responsive-block-control__title">
				{ title }
			</legend>

			<div className="block-editor-responsive-block-control__inner">
				<ToggleControl
					__nextHasNoMarginBottom
					className="block-editor-responsive-block-control__toggle"
					label={ toggleControlLabel }
					checked={ ! isResponsive }
					onChange={ onIsResponsiveChange }
					help={ toggleHelpText }
				/>
				<div
					className={ classnames(
						'block-editor-responsive-block-control__group',
						{
							'is-responsive': isResponsive,
						}
					) }
				>
					{ ! isResponsive && defaultControl }
					{ isResponsive &&
						( renderResponsiveControls
							? renderResponsiveControls( viewports )
							: defaultResponsiveControls() ) }
				</div>
			</div>
		</fieldset>
	);
}

export default ResponsiveBlockControl;
