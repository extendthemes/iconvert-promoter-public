import { PromoHelpers } from "../Libraries/PromoHelpers";
import { PromoTriggers } from "../Libraries/PromoTriggers";

export const PromoOnClick = (() => {
    const name = 'on-click';
    const listeners = [];

    const setup = (_trigger, popupID) => {        
        const selector = PromoHelpers.selectorCompose(_trigger[0], _trigger[1]);        
        
        PromoTriggers.setTrigger(name, false, popupID);

        if (selector !== null) {
            document.querySelectorAll(selector).forEach(item => {
                item.addEventListener('click', (e) => {
                    clickEventWithoutRemovingListener(e, popupID)
                });                
            });

            if(!listeners.includes(popupID)) {
                listeners.push(popupID);
            }
        }
    }

   

    const clickEventWithoutRemovingListener = (e, popupID) => {
        e.preventDefault();

        PromoTriggers.shouldShowCampaign(popupID, true)
    }

    return {
        setup,
        name
    }
})();