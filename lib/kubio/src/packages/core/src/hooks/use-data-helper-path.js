import { useRef, useMemo, useCallback } from '@wordpress/element';
import isEqual from 'react-fast-compare';
import { WithDataPathTypes } from '../common';

const useDataHelperPath = (
	dataHelper,
	type,
	path,
	options = {},
	defaultValue = undefined
) => {
	const {
		value,
		onReset: onReset_,
		onChange: onChange_,
	} = dataHelper.usePath( type, path, options, defaultValue );

	const valueRef = useRef();
	const onResetRef = useRef();
	const onChangeRef = useRef();

	if ( ! isEqual( value, valueRef.current ) ) {
		valueRef.current = value;
	}

	onChangeRef.current = onChange_;
	onResetRef.current = onReset_;

	const onChange = useCallback( ( ...args ) => {
		onChangeRef.current( ...args );
	}, [] );

	const onReset = useCallback( ( ...args ) => {
		onResetRef.current( ...args );
	}, [] );

	return {
		value: valueRef.current,
		onChange,
		onReset,
	};
};

const useDataHelperPathForStyle = (
	dataHelper,
	path,
	optons = {},
	defaultValue = undefined
) => {
	return useDataHelperPath(
		dataHelper,
		WithDataPathTypes.STYLE,
		path,
		optons,
		defaultValue
	);
};

export { useDataHelperPath, useDataHelperPathForStyle };
