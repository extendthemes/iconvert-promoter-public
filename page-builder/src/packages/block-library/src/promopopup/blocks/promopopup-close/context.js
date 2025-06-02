import { createContext, useContext } from '@wordpress/element';

const SliderContext = createContext( {} );
const useSliderContext = () => {
	return useContext( SliderContext );
};

export { SliderContext, useSliderContext };
