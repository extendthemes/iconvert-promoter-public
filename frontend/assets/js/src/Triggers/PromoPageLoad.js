import { PromoTriggers } from "../Libraries/PromoTriggers";
import { PromoAfterInactivity } from "./PromoAfterInactivity";
import { PromoManuallyOpen } from "./PromoManuallyOpen";
import { PromoOnClick } from "./PromoOnClick";
import { PromoScrollToElement } from "./PromoScrollToElement";
import { PromoScrollPercent } from "./PromoScrollPercent";


const triggersToSkipPageLoad = [
  PromoOnClick.name,
  PromoAfterInactivity.name,
  PromoManuallyOpen.name,
  PromoScrollPercent.name,
  PromoScrollToElement.name,

];

export const PromoPageLoad = (() => {
  const name = "page-load";

  let time = 0;
  let threads = {};
  let watcher = false;

  const watch = () => {
    watcher = setInterval(() => {
      time += 1000;

      Object.keys(threads).forEach((popupID) => {
        if (time >= threads[popupID]) {
          completeTrigger(popupID);
        }
      });

      garbageCollector();
    }, 1000);
  };

  const setup = (_trigger, popupID, allTriggers) => {
    let triggersKeys = Object.keys(allTriggers);
    if (
      triggersToSkipPageLoad.some((trigger) => triggersKeys.includes(trigger))
    ) {
      PromoTriggers.setAsDone(name, popupID);
      return;
    }

    let popupTime = parseInt(_trigger[0]) * 1000;

    addThread(popupID, popupTime);
    PromoTriggers.setTrigger(name, false, popupID);

    if (popupTime === 0) {
      completeTrigger(popupID);
      garbageCollector();
    } else {
      if (watcher === false) {
        watch();
      }
    }
  };

  const completeTrigger = (popupID) => {
    PromoTriggers.setAsDone(name, popupID);
    removeThread(popupID);
  };

  const addThread = (popupID, popupTime) => {
    threads[popupID] = popupTime;
  };

  const removeThread = (popupID) => {
    delete threads[popupID];
  };

  const garbageCollector = () => {
    if (Object.keys(threads).length === 0) {
      clearInterval(watcher);
    }
  };

  return {
    setup,
    name,
  };
})();
