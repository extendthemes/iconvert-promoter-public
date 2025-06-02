import {
	registerPattern,
	registerPatternCategory,
	initializeGutentagPatterns,
} from './pattern-registry';

// import './patterns/sections';
// import './patterns/headers';
// import './patterns/footers';
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
