import { getCurrentPath } from "../utils/get-current-path";
import { getTimestamp } from "../utils/get-timestamp";

export const SessionStorage = {

   getStorageKey() {
    const { storage_key = "icp" } = window.cs_promo_settings || {};
    return storage_key;
  },

  all() {
    let stored = window.sessionStorage.getItem(this.getStorageKey());

    try {
      stored = JSON.parse(stored);
    } catch (e) {
      stored = null;
    }

    if (!stored) {
      stored = {};
      window.sessionStorage.setItem("icp", JSON.stringify(stored));
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

    window.sessionStorage.setItem(this.getStorageKey(), JSON.stringify(all));
  },

  setPageView() {
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (!pageViews[url]) {
      pageViews[url] = {
        first: getTimestamp(),
        last: getTimestamp(),
        time: 0,
      };
    }

    this.set("pageViews", pageViews);
  },

  getPageViewTime() {
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (pageViews[url]) {
      return pageViews[url].time;
    }

    return 0;
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
};
