import { Defs, LinearGradient, Stop, SVG } from '@wordpress/primitives';
import { generate } from 'shortid';

const BlockIconWrapper = (props) => {
	const key = generate();
	const id = `kubio-block-gradient-${key}`;
	const className = `kubio-block-icon-${key}`;

	const { children, className: svgClassName = '', ...gradientProps } = props;
	const style = `.${className}{fill: url(#${id})}`;

	return (
		<SVG
			className={`kubio-block-icon ${svgClassName}`}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
		>
			<Defs>
				<style dangerouslySetInnerHTML={{ __html: style }} />
				<LinearGradient
					id={id}
					{...gradientProps}
					gradientUnits="userSpaceOnUse"
				>
					<Stop
						offset="0"
						stopColor="var(--kubio-block-icon-color-primary)"
					/>
					<Stop
						offset="1"
						stopColor="var(--kubio-block-icon-color-secondary)"
					/>
				</LinearGradient>
			</Defs>
			{children({
				gradientClassName: [
					className,
					'kubio-block-icon-gradient-part',
				].join(' '),
				backgroundClassName: ['kubio-block-icon-background-part'].join(
					' '
				),
			})}
		</SVG>
	);
};

export { BlockIconWrapper };
