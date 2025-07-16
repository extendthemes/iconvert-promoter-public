import { ContentInspector } from './content';
import { StyleInspector } from './style';

export const Inspector = ( props ) => {
	return (
		<>
			<StyleInspector { ...props } />
			<ContentInspector { ...props } />
		</>
	);
};
