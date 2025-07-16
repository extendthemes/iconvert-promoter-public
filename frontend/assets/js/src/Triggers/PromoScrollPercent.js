import { PromoTriggers } from "../Libraries/PromoTriggers";

export const PromoScrollPercent = (() => {
    const name = 'scroll-percent';
    const listeners = [];

    const setup = (_trigger, popupID) => {
        window.addEventListener('scroll', (e) => {
            scrollEvent(e, popupID, _trigger[0])
        });
        
        addListener(popupID);
    }

    const scrollPercentage = () => {
        return Math.round((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
    }

    const scrollEvent = (e, popupID, percentage) => {
        if (!listeners.includes(popupID)) {
            return false;
        }
        
        if (scrollPercentage() >= percentage) {
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