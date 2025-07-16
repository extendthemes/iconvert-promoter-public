import { Utils } from '../utils';

class FlexAlign {
	static getVAlignClasses( alignByMedia, options = {} ) {
		const alignPrefix = options.self ? 'align-self' : 'align-items';
		return Utils.composeClassesByMedia( alignByMedia, alignPrefix );
	}

	static getHAlignClasses( alignByMedia, options = {} ) {
		const alignPrefix = options.self ? 'justify-self' : 'justify-content';
		return Utils.composeClassesByMedia( alignByMedia, alignPrefix );
	}
}

export { FlexAlign };
