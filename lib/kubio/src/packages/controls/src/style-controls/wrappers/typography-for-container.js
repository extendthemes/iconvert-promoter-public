import TypographyForContainerWithPath from './typography-for-container-wrapper';

const TypographyForContainer = (props) => {
	return (
		<TypographyForContainerWithPath
			nodeType={''}
			path={'typography'}
			{...props}
		/>
	);
};

export { TypographyForContainer };
