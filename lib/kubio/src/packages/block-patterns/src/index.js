import {
	registerPattern,
	registerPatternCategory,
	initializeGutentagPatterns,
} from './pattern-registry';

import { initFirebaseData } from './firebase-patterns';

// init variations for Gutenberg editor

if (window?.kubioBlockPatterns?.inGutenbergEditor) {
	initFirebaseData(true);
}

export {
	registerPattern,
	registerPatternCategory,
	initializeGutentagPatterns,
	initFirebaseData,
};
