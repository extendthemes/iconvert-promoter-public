import { PromoTriggers } from "../Libraries/PromoTriggers";

export const PromoManuallyOpen = (() => {
    const name = 'manually-open';
    
    const setup = (_trigger, popupID) => {        
        PromoTriggers.setTrigger(name, false, popupID);
    }    

    return {
        setup,
        name
    }
})();