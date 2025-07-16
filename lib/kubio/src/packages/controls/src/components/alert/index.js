import classnames from 'classnames';

const Alert = ( { children, type = 'success' } ) => {
	return (
		<div className={ classnames( 'kubio-alert', `kubio-alert-${ type }` ) }>
			{ children }
		</div>
	);
};

export { Alert };
