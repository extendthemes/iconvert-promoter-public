/**
 * External dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
/**
 * Internal dependencies
 */
import BorderControl from '../';
import BorderControlVisualizer from '../visualizer';
import { Flex, FlexBlock } from '@wordpress/components';

export default { title: 'Components/BorderControl', component: BorderControl };

export const _default = () => {
	return <BorderControl />;
};

function DemoExample() {
	const [ values, setValues ] = useState( {
		top: '10px',
		right: '10px',
		bottom: '10px',
		left: '10px',
	} );

	const [ showVisualizer, setShowVisualizer ] = useState( {} );

	return (
		<Container align="top" gap={ 8 }>
			<FlexBlock>
				<Content>
					<BorderControl
						label="Padding"
						values={ values }
						onChange={ setValues }
						onChangeShowVisualizer={ setShowVisualizer }
					/>
				</Content>
			</FlexBlock>
			<FlexBlock>
				<Content>
					<BoxContainer>
						<BorderControlVisualizer
							showValues={ showVisualizer }
							values={ values }
						>
							<Box />
						</BorderControlVisualizer>
					</BoxContainer>
				</Content>
			</FlexBlock>
		</Container>
	);
}

export const visualizer = () => {
	return <DemoExample />;
};

const Container = styled( Flex )`
	max-width: 780px;
`;

const BoxContainer = styled.div`
	width: 300px;
	height: 300px;
`;

const Box = styled.div`
	background: #ddd;
	height: 300px;
`;

const Content = styled.div`
	padding: 20px;
`;
