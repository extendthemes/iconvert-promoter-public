import { createHigherOrderComponent, useDebounce } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useEffect, useState, useCallback, useMemo } from '@wordpress/element';
import _, { find } from 'lodash';

const FancyWrapper = ({ WrapperComponent, ...props }) => {
	const { isSelected } = props;

	const [isEditing, setIsEditing] = useState(isSelected);
	const [isHovered, setIsHovered] = useState(false);

	const { clientId } = props;

	const onSidebarClick = (event) => {
		const node = event.target;
		const toolbar = node.closest('.block-editor-block-contextual-toolbar');
		const popover = node.closest('.components-popover');

		//sometiems the popovers are closed the function is called and the node is not on page anymore.
		const isInPage = document.body.contains(node);

		//if the user clicked the toolbar continue
		if (toolbar || popover || !isInPage) {
			return;
		}

		if (isEditing) {
			setIsEditing(false);
		}
	};
	const shouldShowEditor = isSelected || isHovered;
	useEffect(() => {
		if (shouldShowEditor !== isEditing) {
			setIsEditing(shouldShowEditor);
		}
	}, [shouldShowEditor]);

	//when the block is selected we don't track the isHovered state, because of this when the block is not selected anymore
	//we reset the is hovered state.
	useEffect(() => {
		if (!isSelected && isHovered) {
			setIsHovered(false);
		}
	}, [isSelected]);
	useEffect(() => {
		//use document instead of owner document because we need to see when the user clicks the sidebar
		document.removeEventListener('click', onSidebarClick);
		if (isSelected) {
			document.addEventListener('click', onSidebarClick);
		}
		return () => {
			document.removeEventListener('click', onSidebarClick);
		};
	}, [isSelected, isEditing]);

	const onMouseLeave = useCallback(() => {
		setIsHovered(false);
	}, []);

	const debounceMouseLeave = useDebounce(onMouseLeave);
	//you need to click two times on the heading to start editing, because of this if the block is not selected we
	//track if the block is hovered so the richText is rendered when the mouse is over the block. Because of this the next
	//click can start editing the block
	const onMouseEnter = useCallback(() => {
		debounceMouseLeave.cancel();
		if (!isHovered) {
			setIsHovered(true);
			if (!isEditing) {
				setIsEditing(true);
			}
		}
	}, []);

	// hasMultiSelection was added to fix: Block toolbar dissapeared after text from different blocks is selected at the same time.
	// issue: http://mantis.extendstudio.net/view.php?id=36224
	const hasMultipleSelectionThatIncludesBlock = useSelect((select) => {
		const { hasMultiSelection, getMultiSelectedBlocks } = select(
			'core/block-editor'
		);
		const multipleSelectionIncludesBlock = !!find(
			getMultiSelectedBlocks(),
			{ clientId }
		);

		return hasMultiSelection() && multipleSelectionIncludesBlock;
	}, []);

	const showRichText =
		(shouldShowEditor && isEditing) ||
		hasMultipleSelectionThatIncludesBlock;

	return (
		<WrapperComponent
			showRichText={showRichText}
			fancyOnMouseEnter={onMouseEnter}
			fancyOnMouseLeave={debounceMouseLeave}
			{...props}
		/>
	);
};

const withFancyTitle = createHigherOrderComponent(
	(WrapperComponent) => (props) => {
		const hasEffect = useMemo(() => {
			const effectStyle = props.dataHelper.getProp('fancy.typeStyle');

			return effectStyle && effectStyle !== 'none';
		}, [props.dataHelper]);

		if (!hasEffect) {
			return <WrapperComponent {...props} />;
		}

		return <FancyWrapper {...props} WrapperComponent={WrapperComponent} />;
	},
	'withFancyTitle'
);

export { withFancyTitle };
