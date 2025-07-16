import BoxControl from './box-control';

const BoxUnitValueControl = (props) => {
	const { onChange, value, isRadius, ...rest } = props;

	return (
		<BoxControl
			isRadius={isRadius}
			values={value}
			onChange={onChange}
			onInput={onChange}
			inputProps={{ isPressEnterToChange: false }}
			{...rest}
		/>
	);
};

export { BoxUnitValueControl };
