import { useSelect } from '@wordpress/data';
import _ from 'lodash';

const useBlockIsDisabledOnSimpleMode = ( blockType, clientId ) => {
	const { kubioEditorModeIsSimple, block } = useSelect(
		( select ) => {
			const { getKubioEditorModeIsSimple = _.noop } =
				select( 'kubio/edit-site' ) || {};
			return {
				kubioEditorModeIsSimple: getKubioEditorModeIsSimple(),
				block: select( 'core/block-editor' ).getBlock( clientId ),
			};
		},
		[ clientId ]
	);

	const disabledBlock =
		kubioEditorModeIsSimple &&
		_.get( blockType, 'supports.disabledOnSimpleMode' );

	if ( disabledBlock && !! blockType?.forceEnableOnSimpleMode?.( block ) ) {
		return false;
	}

	return disabledBlock;
};

export { useBlockIsDisabledOnSimpleMode };
