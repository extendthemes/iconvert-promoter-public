import { PromoPreview } from "../Triggers/PromoPreview";
import { PromoPopup } from "./PromoPopup";

export const PromoTriggers = (() => {
  const triggers = {};
  let watcher = false;

  const actions = [
    "on-click",
    "exit-intent",
    "scroll-percent",
    "scroll-to-element",
  ];

  const repeatableActions = ["on-click"];

  const showTriggers = () => {
    console.log("triggers::");
    console.log(triggers);
  };

  const initPopup = (popupID) => {
    if (typeof triggers[popupID] !== Object) {
      triggers[popupID] = {
        settings: {
          hasRepeatableAction: false,
          isPromoPreview: false,
        },
      };
    }
  };

  const setTrigger = (triggerName, value, popupID) => {
    triggers[popupID][triggerName] = value;
    if (repeatableActions.includes(triggerName)) {
      triggers[popupID].settings.hasRepeatableAction = true;
    }

    if (triggerName === PromoPreview.name) {
      triggers[popupID].settings.isPromoPreview = true;
    }
  };

  const setAsDone = (triggerName, popupID) => {
    if (triggers[popupID] === undefined) {
      triggers[popupID] = {};
    }

    triggers[popupID][triggerName] = true;
  };

  const watch = () => {
    checkAllTriggers();
    watcher = setInterval(checkAllTriggers, 1000);
  };

  const checkAllTriggers = () => {
    Object.keys(triggers).forEach((popupID) => {
      shouldShowCampaign(popupID);
    });
    shouldWatcherStop();
  };

  const shouldShowCampaign = (popupID, triggeredByAction = false) => {
    let allTrue = true;
    let hasAction = false;
    let shouldShow = false;

    Object.entries(triggers[popupID]).forEach((trigger) => {
      if (actions.includes(trigger[0])) {
        hasAction = true;
      } else {
        if (trigger[1] === false) {
          allTrue = false;
        }
      }
    });

    if (triggeredByAction === false) {
      // show the popup if there is no action trigger and every thing is true
      if (allTrue === true && hasAction === false) {
        PromoPopup.promoShow(popupID);
        shouldShow = true;
      }
    } else {
      if (allTrue === true) {
        PromoPopup.promoShow(popupID);
        shouldShow = true;
      }
    }

    return shouldShow;
  };

  const shouldWatcherStop = () => {
    if (Object.keys(triggers).length === 0) {
      stopWatcher();
    }
  };

  const stopWatcher = () => {
    clearInterval(watcher);
  };

  const isPromoPreview = (popupID) => {
    return triggers[popupID]?.settings?.isPromoPreview;
  };

  const dequeuePopup = (popupID) => {
    if (!triggers[popupID]) {
      return;
    }

    if (!triggers[popupID].settings.hasRepeatableAction) {
      delete triggers[popupID];
    }
  };

  return {
    setTrigger,
    setAsDone,
    watch,
    dequeuePopup,
    showTriggers,
    shouldShowCampaign,
    initPopup,
    isPromoPreview,
  };
})();
