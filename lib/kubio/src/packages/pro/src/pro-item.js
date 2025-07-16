import { forwardRef, useRef } from '@wordpress/element';
import classnames from 'classnames';
import _ from 'lodash';
import { ProBadge, proItemOnFree, proItemOnFreeClass } from './badge';
import { useProModal } from './index';

const ProItem = forwardRef( ( props, ref ) => {
	const { tag: TagName = 'div', isProItem = true, children, ...rest } = props;

	if ( ! isProItem ) {
		return (
			<TagName { ...rest } ref={ ref }>
				{ children }
			</TagName>
		);
	}

	return (
		<InnerProItem tag={ TagName } ref={ ref } { ...rest }>
			{ children }
		</InnerProItem>
	);
} );

const InnerProItem = forwardRef( ( props, ref ) => {
	const {
		tag: TagName = 'div',
		item = true,
		onClick = _.noop,
		className,
		children,
		urlArgs,
		propPopoverClass = '',
		...rest
	} = props;
	const [ ProModal, showModal ] = useProModal();

	const innerRef = useRef();
	const tagRef = ref || innerRef;

	const onClickHandler = ( event ) => {
		if ( proItemOnFree( item ) ) {
			event.preventDefault();
			event.stopPropagation();
			showModal( true );
			return;
		}
		onClick( event );
	};

	let pro = null;
	pro = (
		<>
			<ProBadge item={ item } />
			<ProModal
				urlArgs={ urlArgs }
				anchorRef={ tagRef.current }
				className={ propPopoverClass }
			/>
		</>
	);
	return (
		<TagName
			{ ...rest }
			ref={ tagRef }
			className={ classnames( className, proItemOnFreeClass( item ) ) }
			onClick={ onClickHandler }
		>
			{ children }
			{ pro }
		</TagName>
	);
} );
export { ProItem };
