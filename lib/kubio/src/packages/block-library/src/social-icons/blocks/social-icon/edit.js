import { withPropsChecker } from '@kubio/core';
import { DataHelperContextFromClientId } from '@kubio/inspectors';
import { Content } from '../../inspector/content';
import { Style } from './inspector/style';
import { Link } from './component';
import { useSocialIconsContext } from './../../context';
import { useEffect } from '@wordpress/element';

function BlockEdit(props) {
	const context = useSocialIconsContext();
	const { socialIconsClientId, setCurrentActiveItem } = context;
	const socialIconsProps = {
		clientId: socialIconsClientId,
	};

	useEffect(() => {
		if (props.isSelected) {
			setCurrentActiveItem(props.clientId);
		}
	}, [props.isSelected]);

	return (
		<>
			{props.isSelected && (
				<DataHelperContextFromClientId clientId={socialIconsClientId}>
					<Content {...socialIconsProps} />
				</DataHelperContextFromClientId>
			)}
			<Style />
			<Link {...props} />
		</>
	);
}

export default withPropsChecker(BlockEdit);
