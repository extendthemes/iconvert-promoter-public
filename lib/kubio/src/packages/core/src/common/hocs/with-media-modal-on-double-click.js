import { createHigherOrderComponent } from '@wordpress/compose';
import { useGlobalSessionProp } from '@kubio/editor-data';

const withMediaModalOnDoubleClick = () => {
	return createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const { clientId, isSelected, dataHelper } = ownProps;
			const [ modalProps, setModalProps ] = useGlobalSessionProp(
				'containerBgMediaUploadRef'
			);

			const onContainerDoubleClick = ( event ) => {
				// console.log(event);
				if ( event.detail !== 2 || ! isSelected ) {
					return;
				}

				const background = dataHelper.getStyle( 'background' );

				if ( ! [ 'image', 'video' ].includes( background.type ) ) {
					return;
				}

				// only the internal variant has a modal.
				if (
					background.type === 'video' &&
					! background?.video?.internal?.url
				) {
					return;
				}

				setModalProps( {
					...modalProps,
					blockId: clientId,
					dataHelper,
					value:
						background.type === 'image'
							? background.image[ 0 ].source.url
							: background.video.internal.url,
				} );

				setTimeout( () => {
					modalProps?.ref.current.click();
				}, 100 );
			};

			return (
				<>
					<WrappedComponent
						{ ...ownProps }
						onContainerDoubleClick={ onContainerDoubleClick }
					/>
				</>
			);
		},
		'withMediaModalOnDoubleClick'
	);
};

export { withMediaModalOnDoubleClick };
