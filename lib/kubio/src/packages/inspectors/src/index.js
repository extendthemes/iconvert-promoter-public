import { useGlobalSessionProp } from '@kubio/editor-data';

export * from './advanced';
export * from './content';
export * from './data-helper-with-client-id';
export * from './inspector-top-controls';
export * from './style';
export { useCurrentInspectorTab };

const useCurrentInspectorTab = () => {
	const [value, setValue] = useGlobalSessionProp(
		'displayed-block-panel',
		'content'
	);

	return [value, setValue];
};
