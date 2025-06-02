const SkeletonBackgroundHeader = ( props ) => {
	const className = `search-skeleton search-skeleton-header ${ props.className }`;

	return (
		<div className={ className }>
			<div className="search-ssc-lg ssc">
				<div className="ssc-card ssc-wrapper ssc-mbl">
					<div className="ssc-flex ssc-mbs">
						<div className="search-ssc-lg__tag ssc-square"></div>
						<div className="search-ssc-lg__tag ssc-square"></div>
						<div className="search-ssc-lg__tag ssc-square"></div>
						<div className="search-ssc-lg__tag ssc-square"></div>
						<div className="search-ssc-lg__tag ssc-square"></div>
						<div className="search-ssc-lg__tag ssc-square"></div>
					</div>
				</div>

				<div className="ssc-hr ssc-mb"></div>
			</div>
		</div>
	);
};

export { SkeletonBackgroundHeader };
