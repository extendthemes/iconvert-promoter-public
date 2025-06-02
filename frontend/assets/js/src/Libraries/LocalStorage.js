import { getCurrentPath } from "../utils/get-current-path";
import { getTimestamp } from "../utils/get-timestamp";
import { getUUID4 } from "../utils/uuid4";

export const LocalStorage = {
  getStorageKey() {
    const { storage_key = "icp" } = window.cs_promo_settings || {};
    return storage_key;
  },

  all() {
    const storage_key = this.getStorageKey();
    let stored = window.localStorage.getItem(storage_key);

    try {
      stored = JSON.parse(stored);
    } catch (e) {
      stored = null;
    }

    if (!stored) {
      stored = {
        visitorId: getUUID4(),
        timestamps: {
          first: getTimestamp(),
          last: getTimestamp(),
        },
      };
      window.localStorage.setItem(storage_key, JSON.stringify(stored));
    }

    return stored;
  },

  get(key, defaultValue = false) {
    const all = this.all();

    if (Object.hasOwn(all, key)) {
      return all[key];
    }
    return defaultValue;
  },

  set(key, value) {
    const all = this.all();

    all[key] = value;

    const storage_key = this.getStorageKey();
    window.localStorage.setItem(storage_key, JSON.stringify(all));
  },

  previouslyFired(popupId) {
    popupId = popupId.toString();
    const fired = this.get("fired", {});

    if (Object.hasOwn(fired, popupId)) {
      return true;
    }
    return false;
  },

  setPopupFired(popupId) {
    popupId = popupId.toString();
    const fired = this.get("fired", {});
    const date = getTimestamp();
    fired[popupId] = date;
    this.set("fired", fired);
  },

  setPopupConversion(popupId, type = "converted") {
    popupId = popupId.toString();
    const converted = this.get("converted", {});
    converted[popupId] = {
      type,
      time: getTimestamp(),
    };
    this.set("converted", converted);
  },

  updateVisitTimestamp() {
    const timestamps = this.get("timestamps", {});
    const date = getTimestamp();
    timestamps.last = date;
    this.set("timestamps", timestamps);
  },

  getLatestInteractionTimestamp() {
    const timestamps = this.get("timestamps", {});
    const date = getTimestamp();
    const lastInteraction = timestamps.last || date;
    return lastInteraction;
  },

  setPageView() {
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (!pageViews[url]) {
      pageViews[url] = {
        first: getTimestamp(),
        last: getTimestamp(),
        time: 0,
        views: 0,
      };
    }

    this.set("pageViews", pageViews);
  },

  increasePageViewTime(amount) {
    this.setPageView();
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (pageViews[url]) {
      pageViews[url].time += amount;
      pageViews[url].last = getTimestamp();
    }
    this.set("pageViews", pageViews);
  },

  increasePageViews() {
    this.setPageView();
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (pageViews[url]) {
      pageViews[url].views = (pageViews[url].views || 0) + 1;
      pageViews[url].last = getTimestamp();
    }
    this.set("pageViews", pageViews);
  },

  getCurrentPageViews() {
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (pageViews[url]) {
      return pageViews[url].views || 0;
    }
    return 0;
  },

  getPageViewTime(url = null) {
    const pageViews = this.get("pageViews", {});
    url = url || getCurrentPath();

    if (pageViews[url]) {
      return pageViews[url].time;
    }
    return 0;
  },

  getTotalSiteTime() {
    const pageViews = this.get("pageViews", {});
    let total = 0;

    if (pageViews) {
      Object.values(pageViews).forEach((entry) => {
        total += parseInt(entry.time);
      });
    }

    return total;
  },

  getTotalSessions() {
    return this.get("sessions", 0);
  },

  maybeCountSession() {
    const sessions = this.get("sessions", 0);

    if (sessions === 0) {
      this.set("sessions", 1);
      return;
    }

    const latestTS = this.getLatestInteractionTimestamp();
    const time = getTimestamp();
    const delta = time - latestTS;
    const session_duration =
      window.cs_promo_settings.session_duration || 60 * 20;

    if (delta > session_duration) {
      this.set("sessions", sessions + 1);
    }
  },

  getVisitorId() {
    return this.get("visitorId");
  },

  setProductPageViewed(pageId) {
    const viewedProducts = this.get("productViews", {});

    if (!viewedProducts[pageId]) {
      viewedProducts[pageId] = {
        first: getTimestamp(),
        last: getTimestamp(),
        times: 0,
      };
    }

    viewedProducts[pageId].times += 1;
    viewedProducts[pageId].last = getTimestamp();

    this.set("productViews", viewedProducts);
  },
};
