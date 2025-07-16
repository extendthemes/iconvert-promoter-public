const cleanCss = ( css ) => {
	css = css.replace( /\._h_state_hover/gi, ':hover' );
	css = css.replace( /\._h_state_active/gi, ':active' );
	css = css.replace( /\._h_state_disabled/gi, '[disabled]' );
	css = css.replace( /\._h_state_focus/gi, ':focus' );
	return css;
};

export { cleanCss };
