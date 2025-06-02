const withWhyRender = ( log = null ) => {
	return ( WrappedComponent ) => ( props ) => {
		return <WrappedComponent { ...props } />;
	};
};

const withPropsChecker = ( WrappedComponent ) => ( props ) => {
	return <WrappedComponent { ...props } />;
};

export { withPropsChecker, withWhyRender };
