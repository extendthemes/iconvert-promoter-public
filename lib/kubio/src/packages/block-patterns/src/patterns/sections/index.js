import { registerPatternCategory } from '../../pattern-registry';
import { sectionPatternsCategoriesList } from './categories';

sectionPatternsCategoriesList.forEach(registerPatternCategory);
