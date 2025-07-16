import { useEffect, useRef } from '@wordpress/element';
import { KubioLoader } from '@kubio/icons';
import { Icon } from '@wordpress/components';
const TemplateLoadingOverlay = (props = {}) => {
	const ref = useRef();
	useEffect(() => {
		let node = ref.current;
		document.body.appendChild(ref.current);

		return () => {
			try {
				let currentNode = ref?.current || node;
				document.body.removeChild(currentNode);
			} catch (e) {
				console.error(e);
			}
		};
	}, []);
	return (
		<div>
			<div ref={ref} className="h-template-loading-overlay">
				<Icon icon={KubioLoader} />
			</div>
		</div>
	);
};

export { TemplateLoadingOverlay };
