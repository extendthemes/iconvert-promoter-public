import { PromoTriggers } from "../Libraries/PromoTriggers";

export const PromoPreview = (() => {
    const name = 'preview';
    
    const setup = (_trigger, popupID) => {        
        PromoTriggers.setTrigger(name, false, popupID);
        PromoTriggers.setAsDone(name, popupID);        
    }

    return {
        setup,
        name
    }
})();