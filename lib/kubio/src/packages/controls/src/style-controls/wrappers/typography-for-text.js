import TypographyForTextWithPath from './typography-for-text-wrapper';
import _ from 'lodash';

const TypographyForTextAdvanced = (props = {}) => {
	const { filters, styledElement: activeStyledElement, dataHelper } = props;
	const getDynamicProps = _.get(filters, 'getDynamicProps');
	let extraProps = {};
	if (getDynamicProps && typeof getDynamicProps === 'function') {
		extraProps = getDynamicProps(dataHelper, activeStyledElement);
	}

	return <TypographyForText {...props} {...extraProps} />;
};

const TypographyForText = (props = {}) => {
	const nodeType = 'p';
	return (
		<>
			<TypographyForTextWithPath
				nodeType={nodeType}
				path={'typography'}
				{...props}
			/>
		</>
	);
};

const getTagNameLevel = (dataHelper) => {
	const level = dataHelper
		.getProp('level', dataHelper.getAttribute('headerType', 1), {
			media: 'desktop',
		})
		?.toString?.()
		?.replace?.('h', '');

	return parseInt(level);
};

const TypographyForHeading = (props = {}) => {
	const { dataHelper } = props;
	const nodeType = `h${getTagNameLevel(dataHelper)}`;
	return (
		<>
			<TypographyForTextWithPath
				nodeType={nodeType}
				path={'typography'}
				{...props}
			/>
		</>
	);
};

export { TypographyForText, TypographyForHeading, TypographyForTextAdvanced };
