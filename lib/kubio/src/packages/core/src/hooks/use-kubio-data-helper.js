import { useBlockEditContext } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { useRegistry } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { useKubioBlockEditSessionContext } from '../context';
import { prepareColibriData, useColibriDataHooks } from './data';
import { useDeepMemo } from './use-deep-memo';

const useBlockWithClientId = ( clientId, outsideProvided = null ) => {
	const registry = useRegistry();

	if ( outsideProvided ) {
		return outsideProvided;
	}

	return registry.select( 'core/block-editor' ).getBlock( clientId );
};

/**
 * @typedef {Object} useKubioDataHelperResponse
 * @property {(ColibriHelper|null)} dataHelper - ColibriHelper
 */

/**
 *
 * @param {Object}      props
 * @param {string}      props.clientId
 * @param {Object|null} optionsOverwrite
 * @return {useKubioDataHelperResponse} - an object with dataHelper key
 */
const useKubioDataHelper = ( props = {}, optionsOverwrite = null ) => {
	let { clientId } = props;
	const { clientId: blockClientId } = useBlockEditContext();
	clientId = clientId || blockClientId;

	const contextPropsData = useKubioBlockEditSessionContext();

	// add props as fallback (preview client id is not found in current registry and returns null)
	const ownProps = useBlockWithClientId(
		clientId,
		!! props?.attributes ? props : false
	);

	const blockType = useMemo(
		() => getBlockType( ownProps?.name ),
		[ ownProps?.name ]
	);

	const contextPropsDefault = blockType?.contextPropsDefault;

	const hooks = useColibriDataHooks();
	return useDeepMemo( () => {
		const options = {
			loadColibriData: true,
			useClientData: true,
			autoSave: true,
			clientId,
			...optionsOverwrite,
			ownProps,
			blockType,
			invalidateCache: true,
			contextProps: {
				default: contextPropsDefault,
				data: contextPropsData,
			},
		};

		return {
			dataHelper: prepareColibriData( options, hooks ),
		};
	}, [
		clientId,
		optionsOverwrite,
		ownProps?.attributes,
		contextPropsData,
		hooks,
	] );
};

export { useKubioDataHelper };
