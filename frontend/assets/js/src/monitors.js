import { LocalStorage } from "./Libraries/LocalStorage";
import { SessionStorage } from "./Libraries/SessionStorage";
import { getUUID4 } from "./utils/uuid4";

const subs = new Map();
let isVisible = true;

const activateTab = () => {
  isVisible = true;
};

const deactivateTab = () => {
  isVisible = false;
};

window.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    activateTab();
  } else {
    deactivateTab();
  }
});

window.addEventListener("focus", activateTab);
window.addEventListener("blur", deactivateTab);


export const subscribeToMonitor = (callback) => {
  const id = getUUID4();

  subs.set(id, callback);

  return () => {
    subs.delete(id);
  };
};


const runSubs = () => {
  subs.forEach((callback) => {
    try {
      callback();
    } catch (e) {
      console.error(e);
    }
  });
}

const updateStorage = () => {
  if (!isVisible) {
    return;
  }

 
  LocalStorage.updateVisitTimestamp();
  LocalStorage.increasePageViewTime(1);
  SessionStorage.increasePageViewTime(1);

  runSubs();
};

window.addEventListener("storage", runSubs);

export const startInteractivityMonitor = () => {
  setInterval(updateStorage, 1000);
};
