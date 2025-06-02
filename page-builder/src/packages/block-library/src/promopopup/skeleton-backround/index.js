const SkeletonBackgroundHtml = ( props ) => {
	const className = `search-skeleton search-skeleton-content ${ props.className }`;

	return (
		<div className={ className }>
			<div className="search-ssc-lg ssc">
				<div className="ssc-card ssc-wrapper ssc-mb">
					<div className="ssc-line ssc-mb w-100"></div>
				</div>
				<div className="ssc-card ssc-wrapper ssc-flex ssc-justify-between ssc-mb">
					<div className="w-70 ssc-mr">
						<div className="ssc-line ssc-mb w-50"></div>
						<div className="ssc-line ssc-mb w-70"></div>
						<div className="ssc-line w-90"></div>
					</div>
					<div className="ssc-circle ssc-wh70"></div>
				</div>
				<div className="ssc-hr ssc-mb"></div>
				<div className="ssc-card ssc-wrapper ssc-mb">
					<div className="ssc-head-line ssc-mb"></div>
					<div className="ssc-square ssc-mb"></div>
					<div className="ssc-line ssc-mb w-50"></div>
					<div className="ssc-line ssc-mb w-80"></div>
					<div className="ssc-line ssc-mb w-30"></div>
				</div>
				<div className="ssc-card ssc-wrapper ssc-mb">
					<div className="ssc-wrapper ssc-mb">
						<div className="flex align-center ssc-justify-between">
							<div className="ssc-head-line w-60 ssc-mr"></div>
							<div className="ssc-line w-30"></div>
						</div>
					</div>
					<div className="ssc-hr ssc-mb"></div>
					<div className="ssc-wrapper ssc-mb">
						<div className="ssc-line w-100 ssc-mb"></div>
						<div className="ssc-line w-70 ssc-mb"></div>
						<div className="ssc-line w-30 ssc-mb"></div>
						<div className="ssc-line w-80 ssc-mb"></div>
						<div className="ssc-line w-60 ssc-mb"></div>
					</div>
					<div className="ssc-hr ssc-mb"></div>
					<div className="ssc-wrapper ssc-mb">
						<div className="ssc-line w-100 ssc-mb"></div>
						<div className="ssc-line w-70 ssc-mb"></div>
						<div className="ssc-line w-30 ssc-mb"></div>
						<div className="ssc-line w-80 ssc-mb"></div>
						<div className="ssc-line w-60 ssc-mb"></div>
					</div>
					<div className="ssc-hr ssc-mb"></div>
					<div className="ssc-wrapper ssc-mb">
						<div className="ssc-line w-100 ssc-mb"></div>
						<div className="ssc-line w-70 ssc-mb"></div>
						<div className="ssc-line w-30 ssc-mb"></div>
						<div className="ssc-line w-80 ssc-mb"></div>
						<div className="ssc-line w-60 ssc-mb"></div>
					</div>
				</div>
				<div className="ssc-card ssc-wrapper ssc-mb">
					<div className="search-ssc-sm__tags ssc-flex ssc-flex-wrap">
						<div className="search-ssc-sm__tag ssc-square w-30"></div>
						<div className="search-ssc-sm__tag ssc-square w-60"></div>
						<div className="search-ssc-sm__tag ssc-square w-50"></div>
						<div className="search-ssc-sm__tag ssc-square w-30"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export { SkeletonBackgroundHtml };
