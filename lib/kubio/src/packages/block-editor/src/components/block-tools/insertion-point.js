/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __unstableMotion as motion } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import BlockPopoverInbetween from '../block-popover/inbetween';
import Inserter from '../inserter';
import _ from 'lodash';

export const InsertionPointOpenRef = createContext();
//many modifications in kubio
// Define animation variants for the line element.
const horizontalLine = {
	start: {
		width: 0,
		top: '50%',
		bottom: '50%',
		x: 0,
	},
	rest: {
		width: 4,
		top: 0,
		bottom: 0,
		x: -2,
	},
	hover: {
		width: 4,
		top: 0,
		bottom: 0,
		x: -2,
	},
};
const verticalLine = {
	start: {
		height: 0,
		left: '50%',
		right: '50%',
		y: 0,
		width: 0,
	},
	rest: {
		height: 4,
		left: 0,
		right: 0,
		y: -2,
		width: '100%',
	},
	hover: {
		height: 4,
		left: 0,
		right: 0,
		y: -2,
		width: '100%',
	},
};

const inserterVariants = {
	start: {
		scale: 0,
	},
	rest: {
		scale: 1,
		transition: { delay: 0 },
	},
};

function InsertionPointPopover( {
									__unstablePopoverSlot,
									__unstableContentRef,
								} ) {
	const { selectBlock, hideInsertionPoint } = useDispatch( blockEditorStore );
	const openRef = useContext( InsertionPointOpenRef );
	const ref = useRef();
	const {
		orientation,
		previousClientId,
		nextClientId,
		rootClientId,
		isInserterShown,
		kubioInsertionEdge,
		kubioEditorModeIsSimple,
		hideDefaultInsertionPoint,
		isDragging,
	} = useSelect( ( select ) => {
		const {
			getBlock,
			getBlockOrder,
			getBlockListSettings,
			getBlockInsertionPoint,
			isBlockBeingDragged,
			getPreviousBlockClientId,
			getNextBlockClientId,
			isDraggingBlocks,
		} = select( blockEditorStore );
		const insertionPoint = getBlockInsertionPoint();
		const order = getBlockOrder( insertionPoint.rootClientId );

		if ( ! order.length ) {
			return {};
		}

		let _previousClientId = order[ insertionPoint.index - 1 ];
		let _nextClientId = order[ insertionPoint.index ];

		const isDragging =
			isDraggingBlocks() ||
			//for blocks dragged from inserter
			top.document.body.classList.contains(
				'kubio-dragging-from-inserter--active'
			);

		while ( isBlockBeingDragged( _previousClientId ) ) {
			_previousClientId = getPreviousBlockClientId( _previousClientId );
		}

		while ( isBlockBeingDragged( _nextClientId ) ) {
			_nextClientId = getNextBlockClientId( _nextClientId );
		}

		//Added in kubio
		const { getKubioEditorModeIsSimple = _.noop } =
		select( 'kubio/edit-site' ) || {};
		const kubioEditorModeIsSimple = getKubioEditorModeIsSimple();

		let previousBlock = getBlock( _previousClientId );
		let nextBlock = getBlock( _nextClientId );
		const disabledBlocksWithInserter = [
			'kubio/section',
			'kubio/navigation',
		];

		const ignoreInserterBlocks = [
			'cspromo/promopopupclose',
		];

		const hideDefaultInsertionPoint =
			disabledBlocksWithInserter.includes( previousBlock?.name ) ||
			disabledBlocksWithInserter.includes( nextBlock?.name );

		if(ignoreInserterBlocks.includes( previousBlock?.name )) {
			_previousClientId = null;
		}

		if(ignoreInserterBlocks.includes( nextBlock?.name )) {
			_nextClientId = null;
		}
		
		return {
			previousClientId: _previousClientId,
			nextClientId: _nextClientId,
			orientation:
				getBlockListSettings( insertionPoint.rootClientId )
					?.orientation || 'vertical',
			rootClientId: insertionPoint.rootClientId,
			isInserterShown: insertionPoint?.__unstableWithInserter,
			kubioEditorModeIsSimple,
			kubioInsertionEdge: insertionPoint?.kubioInsertionEdge,
			hideDefaultInsertionPoint,
			isDragging,
		};
	}, [] );
	const isVertical = orientation === 'vertical';

	const lineVariants = {
		// Initial position starts from the center and invisible.
		start: {
			...( ! isVertical ? horizontalLine.start : verticalLine.start ),
			opacity: 0,
		},
		// The line expands to fill the container. If the inserter is visible it
		// is delayed so it appears orchestrated.
		rest: {
			...( ! isVertical ? horizontalLine.rest : verticalLine.rest ),
			opacity: 1,
			borderRadius: '2px',
			transition: { delay: 0 },
		},
		hover: {
			...( ! isVertical ? horizontalLine.hover : verticalLine.hover ),
			opacity: 1,
			borderRadius: '2px',
			transition: { delay: 0 },
		},
	};

	function onClick( event ) {
		if ( event.target === ref.current && nextClientId ) {
			selectBlock( nextClientId, -1 );
		}
	}

	function onFocus( event ) {
		// Only handle click on the wrapper specifically, and not an event
		// bubbled from the inserter itself.
		if ( event.target !== ref.current ) {
			openRef.current = true;
		}
	}

	function maybeHideInserterPoint( event ) {
		// if (event.target.closest('.block-editor-block-popover__inbetween')) {
		// 	return;
		// }

		// Only hide the inserter if it's triggered on the wrapper,
		// and the inserter is not open.
		if ( event.target === ref.current && ! openRef.current ) {
			hideInsertionPoint();
		}
	}

	const className = classnames(
		'block-editor-block-list__insertion-point',
		'is-' + orientation
	);

	const kubioInsertPosition = useMemo( () => {
		switch ( kubioInsertionEdge ) {
			case 'top':
				return 'begin';
			case 'bottom':
				return 'end';
		}

		return kubioInsertionEdge;
	}, [ kubioInsertionEdge ] );

	useEffect( () => {
		if ( ! isInserterShown ) {
			openRef.current = false;
		}
	}, [ isInserterShown, openRef ] );

	//added in kubio
	const showBlueLine =
		isDragging ||
		( ! hideDefaultInsertionPoint && ! kubioEditorModeIsSimple );

	const showInserterButton =
		isInserterShown &&
		! hideDefaultInsertionPoint &&
		! kubioEditorModeIsSimple;

	return (
		<BlockPopoverInbetween
			previousClientId={ previousClientId }
			nextClientId={ nextClientId }
			__unstablePopoverSlot={ __unstablePopoverSlot }
			__unstableContentRef={ __unstableContentRef }
			kubioInsertionEdge={ kubioInsertionEdge }
			disableInserter={ ! showInserterButton && ! showBlueLine }
		>
			<motion.div
				layout={ true }
				initial={ 'start' }
				animate="rest"
				whileHover="hover"
				whileTap="pressed"
				exit="start"
				ref={ ref }
				tabIndex={ -1 }
				onClick={ onClick }
				onFocus={ onFocus }
				className={ classnames( className, {
					'is-with-inserter': isInserterShown,
				} ) }
				onHoverEnd={ maybeHideInserterPoint }
			>
				{ showBlueLine && (
					<motion.div
						variants={ lineVariants }
						className="block-editor-block-list__insertion-point-indicator"
						data-testid="block-list-insertion-point-indicator"
					/>
				) }
				{ showInserterButton && (
					<motion.div
						variants={ inserterVariants }
						className={ classnames(
							'block-editor-block-list__insertion-point-inserter'
						) }
					>
						<Inserter
							position="bottom center"
							clientId={ nextClientId }
							rootClientId={ rootClientId }
							kubioInsertPosition={ kubioInsertPosition }
							__experimentalIsQuick
							onToggle={ ( isOpen ) => {
								openRef.current = isOpen;
							} }
							onSelectOrClose={ () => {
								openRef.current = false;
								hideInsertionPoint();
							} }
						/>
					</motion.div>
				) }
			</motion.div>
		</BlockPopoverInbetween>
	);
}

export default function InsertionPoint( props ) {
	const isVisible = useSelect( ( select ) => {
		return select( blockEditorStore ).isBlockInsertionPointVisible();
	}, [] );

	return isVisible && <InsertionPointPopover { ...props } />;
}
