import { ICEmailLists } from './Lib/ICEmailLists';
import { ICSubscriber } from './Lib/ICSubscriber';
import { ICGlobal } from './Lib/ICGlobal';

document.addEventListener('DOMContentLoaded', () => {
    // console.log('EMAIL LISTS')
    ICEmailLists.setup();
    ICSubscriber.setup();
    ICGlobal.checkFlashMessages();
});