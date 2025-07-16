import Component from './component';
import { Inspector } from './inspector';

export default function ComponentEdit( props ) {
	return (
		<>
			<Inspector { ...props } />
			<Component { ...props } />
		</>
	);
}
