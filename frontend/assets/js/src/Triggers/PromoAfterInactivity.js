import { PromoTriggers } from "../Libraries/PromoTriggers";

export const PromoAfterInactivity = (() => {
    const name = 'after-inactivity';
    const $ = jQuery;
    const events = 'mousemove mousedown keypress DOMMouseScroll mousewheel touchmove MSPointerMove';
    let time = 0;
    let threads = {};
    let watcher = false;

    const watch = () => {
        watcher = setInterval(() => {
            // count
            time += 1000;
            
            Object.keys(threads).forEach((popupID) => {                
                if(time >= threads[popupID]) {
                    PromoTriggers.setAsDone(name, popupID);
                    removeThread(popupID);
                }
            });

            garbageCollector();
        }, 1000);
    };

    const resetTimer = () => {
        time = 0;
    }

    const addListener = () => {        
        $('body').on(events, resetTimer);
    }

    const removeListener = () => {
        $('body').off(events, resetTimer);
    }

    const setup = (_trigger, popupID) => {        
        let popupTime = parseInt(_trigger[0]) * 1000;

        addThread(popupID, popupTime);
        PromoTriggers.setTrigger(name, false, popupID);

        if (watcher === false) {
            addListener();
            watch();
        }
    }

    const addThread = (popupID, popupTime) => {
        threads[popupID] = popupTime;
    }

    const removeThread = (popupID) => {
        delete threads[popupID];
    }

    const garbageCollector = () => {
        if (Object.keys(threads).length === 0) {            
            clearInterval(watcher);
            removeListener();
        }
    }

    return {
        setup,
        name
    }
})();