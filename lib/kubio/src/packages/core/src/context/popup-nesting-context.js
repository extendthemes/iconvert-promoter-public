import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useRef,
	Fragment,
} from '@wordpress/element';
import _ from 'lodash';
import { useDeepMemo, useInstantState } from '../hooks';

const PopupNestingContext = createContext( {
	parentsAndSiblingsByInstanceIdRef: null,
	setParentsAndSiblingsByInstanceId: _.noop,

	//we are using ref to store the data because the changes are to fast to be able to use setState and merge objects.
	//Because of that even tho we used a dummy set state it it's not enough for the context to update. We must pass the real value
	//to the context for it to update
	forceRefreshData: null,
} );

/**
 * The idea is that you can nest popups inside other popups and we need to know for every popup what children popups it has
 * so if you click on any children popup the parent popup is not closed. To achieve this when a popup is created then all
 * the other popups that are in the list are considered either siblings or parents because we can't know what popup is the parent
 * and which si the siblings but it's ok for our use case to also count the siblings because you can't have two siblings
 * popups opened at the same time.
 * Here is an example. If you go to the image -> style -> effect options -> frame options
 * - When you open the effect options tab the first level of popup is mounted so it's added to the list
 * - If you open the frame options popup you have two popups the color control and the frame shadow control. Now these two
 * popups are mounted and are added to the list both having the frame options instanceId as the parent and perhaps other sibling
 * but we don't really need this. We ignore the siblings because it doesn't break our logic but it doesn't help us either.
 * - If you open the frame shadow it also has another popup inside it the shadow picker. When you open the frame shadow control
 * the popup is mounted and the 3 level popup is added that has as parents all the popups from before.
 * This logic could extend infinitely
 *
 *  The top level popup holds the state with the hierarchy of the popups, the rest get it using context
 * I first tried to a list of children for each popup but this approach did not work so changed it to use the parentIds
 */

const usePopupNestingContext = ( currentInstanceId ) => {
	const {
		isRootPopup,
		contextProvider,
		parentsAndSiblingsByInstanceIdRef,
		setParentsAndSiblingsByInstanceId,
	} = useGetData();

	let isUnMounting = false;
	useEffect(
		() => () => {
			isUnMounting = true;
		},
		[]
	);

	useEffect( () => {
		const parentsAndSiblingsByInstanceIdClone = _.cloneDeep(
			parentsAndSiblingsByInstanceIdRef.current
		);

		const siblingsAndAncestors = Object.keys(
			parentsAndSiblingsByInstanceIdClone
		);
		_.set(
			parentsAndSiblingsByInstanceIdClone,
			currentInstanceId,
			siblingsAndAncestors
		);
		setParentsAndSiblingsByInstanceId(
			parentsAndSiblingsByInstanceIdClone
		);

		return () => {
			if ( isRootPopup && isUnMounting ) {
				return;
			}
			const parentsAndSiblingsByInstanceIdClone = _.cloneDeep(
				parentsAndSiblingsByInstanceIdRef.current
			);
			_.unset( parentsAndSiblingsByInstanceIdClone, currentInstanceId );
			setParentsAndSiblingsByInstanceId(
				parentsAndSiblingsByInstanceIdClone
			);
		};
	}, [ currentInstanceId ] );

	const instanceClassesWithChildren = useDeepMemo( () => {
		const childrenInstanceIds = [];
		_.each(
			parentsAndSiblingsByInstanceIdRef?.current,
			( siblingsAndAncestorsIds, instanceId ) => {
				if ( siblingsAndAncestorsIds.includes( currentInstanceId ) ) {
					childrenInstanceIds.push( instanceId );
				}
			}
		);

		return childrenInstanceIds;
	}, [ parentsAndSiblingsByInstanceIdRef?.current, currentInstanceId ] );

	const instanceClassesWithChildrenSelector = useDeepMemo( () => {
		const classes = _.cloneDeep( instanceClassesWithChildren );
		//the current instanceId is not saved in the children array
		classes.push( currentInstanceId );

		//Dropdown has components-dropdown__content
		classes.push( 'components-dropdown__content' );
		const selector = classes
			.map( ( instanceClass ) => `.${ instanceClass }` )
			.join( ',' );
		return selector;
	}, [ instanceClassesWithChildren, currentInstanceId ] );

	return {
		parentsAndSiblingsByInstanceId:
			parentsAndSiblingsByInstanceIdRef.current,
		instanceClassesWithChildrenSelector,
		contextProvider,
	};
};

function useGetData() {
	let {
		parentsAndSiblingsByInstanceIdRef,
		setParentsAndSiblingsByInstanceId,
		forceRefreshData,
	} = useContext( PopupNestingContext ) || {};
	let isRootPopup = false;
	//store the children nesting in the top level popup. You know the current popup is at the top if it has no context
	if ( ! parentsAndSiblingsByInstanceIdRef ) {
		isRootPopup = true;
		const rootPopupData = useGetRootPopupData();
		parentsAndSiblingsByInstanceIdRef =
			rootPopupData.parentsAndSiblingsByInstanceIdRef;
		setParentsAndSiblingsByInstanceId =
			rootPopupData.setParentsAndSiblingsByInstanceId;
		forceRefreshData = rootPopupData.forceRefreshData;
	}

	const contextProvider = useDeepMemo( () => {
		return {
			parentsAndSiblingsByInstanceIdRef,
			setParentsAndSiblingsByInstanceId,
			forceRefreshData,
		};
	}, [
		parentsAndSiblingsByInstanceIdRef,
		setParentsAndSiblingsByInstanceId,
		forceRefreshData,
	] );

	return {
		isRootPopup,
		contextProvider,
		parentsAndSiblingsByInstanceIdRef,
		setParentsAndSiblingsByInstanceId,
	};
}

function useGetRootPopupData() {
	const initialState = {};

	//we need the instant state hook because if you have multiple popups in the parent popup they will be called very fast
	//and when you do the merge for every popup only the last one would have been called with the normal setState. The instant
	// state it for cases like this were multiple set states are called and they need to be called in sequence
	const [
		parentsAndSiblingsByInstanceIdRef,
		setParentsAndSiblingsByInstanceId,
		forceRefreshData,
	] = useInstantState( initialState );

	return {
		parentsAndSiblingsByInstanceIdRef,
		setParentsAndSiblingsByInstanceId,
		forceRefreshData,
	};
}

const PopupNestingContextProvider = ( { children, ...otherProps } ) => {
	const { parentsAndSiblingsByInstanceIdRef } =
		useContext( PopupNestingContext ) || {};
	const shouldProvideContext = ! parentsAndSiblingsByInstanceIdRef;
	let Component;
	let props = {};
	if ( shouldProvideContext ) {
		Component = PopupNestingContext.Provider;
		props = otherProps;
	} else {
		Component = Fragment;
	}

	return <Component { ...props }>{ children }</Component>;
};

export {
	usePopupNestingContext,
	PopupNestingContextProvider,
	PopupNestingContext,
};
