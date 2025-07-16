import { __ } from '@wordpress/i18n';

import LinkConfig from './index';
import { BaseControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { WithDataPathTypes } from '@kubio/core';
import {
	SelectControlWithPath,
	ToggleControlWithPath,
	URLInputWithPath,
} from '../../style-controls';
import PopoverOptionsButton from '../popover-options-button';
import classNames from 'classnames';

const LinkControl = ( {
	computed,
	label = __( 'Link', 'kubio' ),
	withMediaType = true,
} ) => {
	const [ isVisible, toggleVisibility ] = useState( false );
	const { linkIs, linkDataProp = 'link' } = computed;
	return (
		<>
			<BaseControl
				className={ classNames(
					'kubio-link-control-container',
					'kubio-control'
				) }
			>
				<URLInputWithPath
					label={ label }
					onClick={ () => toggleVisibility( ! isVisible ) }
					type={ WithDataPathTypes.ATTRIBUTE }
					path={`${linkDataProp}.value`}
				/>

				<PopoverOptionsButton
					popupContent={
						<>
							<SelectControlWithPath
								label={ __( 'Open link in', 'kubio' ) }
								type={ WithDataPathTypes.ATTRIBUTE }
								path={`${linkDataProp}.typeOpenLink`}
								options={ LinkConfig.linkOpen.options }
							/>
							{ withMediaType && linkIs?.lightbox && (
								<SelectControlWithPath
									label={ __( 'Media type', 'kubio' ) }
									type={ WithDataPathTypes.ATTRIBUTE }
									// path="link.lightboxMedia"
									path={`${linkDataProp}.lightboxMedia`}
									options={ LinkConfig.lightboxMedia.options }
								/>
							) }
							<ToggleControlWithPath
								label={ __( 'Add nofollow', 'kubio' ) }
								type={ WithDataPathTypes.ATTRIBUTE }
								// path="link.noFollow"
								path={`${linkDataProp}.noFollow`}
							/>
						</>
					}
					minWidth={ 260 }
				/>
			</BaseControl>
		</>
	);
};

export { LinkControl };
