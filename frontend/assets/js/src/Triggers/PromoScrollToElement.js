import { PromoHelpers } from "../Libraries/PromoHelpers";
import { PromoTriggers } from "../Libraries/PromoTriggers";

export const PromoScrollToElement = (() => {
    const name = 'scroll-to-element';
    const listeners = [];

    const setup = (_trigger, popupID) => {
        const selector = PromoHelpers.selectorCompose(_trigger[0], _trigger[1]);

        window.addEventListener('scroll', (e) => {
            scrollEvent(e, popupID, selector)
        });
        
        addListener(popupID);
    }

    const scrolledIntoView = (selector) => {
        const element = document.querySelector(selector);        

        if (element === null) {
            return false;
        }

        const rectElement = element.getBoundingClientRect();
        const elemTop = rectElement.top;
        const elemBottom = rectElement.bottom;
        
        const isElementVisible = elemTop < window.innerHeight && elemBottom >= 0;
        
        return isElementVisible;
    }

    const scrollEvent = (e, popupID, selector) => {
        if (!listeners.includes(popupID)) {
            return false;
        }        
        
        if (scrolledIntoView(selector) === true) {
            if (PromoTriggers.shouldShowCampaign(popupID, true) === true) {            
                removeListener(popupID);
            }
        }
    }

    const addListener = (popupID) => {
        if (!listeners.includes(popupID)) {
            PromoTriggers.setTrigger(name, false, popupID);
            listeners.push(popupID);
        }
    }

    const removeListener = (popupID) => {
        listeners.splice(listeners.indexOf(popupID), 1);
    }

    return {
        setup,
        name
    }
})();