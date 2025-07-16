import { set } from 'lodash';

const addKubioSupport = ( settings, kubioSettings ) => {
	return set( { ...settings }, 'supports.kubio', kubioSettings );
};

export { addKubioSupport };
