function TemplateLockModal({ title, children }) {
	return (
		<div className="template-lock-modal__container">
			{title && (
				<div className="template-lock-modal__header">{title}</div>
			)}
			<hr />
			<div className="template-lock-modal__content">{children}</div>
		</div>
	);
}

export { TemplateLockModal };
