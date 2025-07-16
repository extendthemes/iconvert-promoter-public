(async function () {
  const getTimestamp = () => {
    const date = new Date();
    const ts = Math.floor(date.getTime() / 1000);
    return ts;
  };

  const generateUniqueId = () => {
    if (window.crypto && window.crypto.randomUUID) {
      return crypto.randomUUID();
    }

    const uuid = new Array(36);
    for (let i = 0; i < 36; i++) {
      uuid[i] = Math.floor(Math.random() * 16);
    }
    uuid[14] = 4;
    uuid[19] = uuid[19] &= ~(1 << 2);
    uuid[19] = uuid[19] |= 1 << 3;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    return uuid.map((x) => x.toString(16)).join("");
  };

  const {
    server_time = 0,
    browser_time = getTimestamp(),
    referrer = "",
    storage_key = "icp",
  } = window.cs_promo_settings || {};

  const getReferrer = () => {
    if (
      server_time &&
      browser_time &&
      parseInt(server_time) + 2 > parseInt(browser_time) &&
      referrer
    ) {
      return {
        source: "server",
        referrer: referrer,
      };
    }

    return {
      source: "browser",
      referrer: document.referrer || "",
    };
  };

  let inlinePopups = window.icPromoInlinePopups
    ? window.icPromoInlinePopups
    : [];

  let localStorage = window.localStorage.getItem(storage_key);

  try {
    localStorage = JSON.parse(localStorage);
  } catch (e) {
    localStorage = null;
  }

  if (!localStorage) {
    localStorage = {
      visitorId: generateUniqueId(),
      timestamps: {
        first: getTimestamp(),
        last: getTimestamp(),
      },
    };
    window.localStorage.setItem(storage_key, JSON.stringify(localStorage));
  }

  const url = new URL(window.location.href);
  url.searchParams.set("_", generateUniqueId());

  const isPreviewPage = () => {
    return (
      document.body.classList.contains("single-cs-promo-popups") ||
      window.location.search.includes("__iconvert-promoter-preview")
    );
  };

  window.icPromoPopupsData = null;

  const formData = new FormData();
  formData.append("iconvertpr_promo_load_popups", "1");
  formData.append(
    "payload",
    JSON.stringify({
      visitorId: localStorage.visitorId,
      is_preview: isPreviewPage(),
      referrer: getReferrer(),
      localStorage: {
        ...localStorage,
        // unset localStorage properties that are not needed for the request
        pageViews: null,
        productViews: null,
      },
      inlinePopups,
    })
  );

  formData.append("visitor_id", localStorage.visitorId);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      window.icPromoPopupsData = {
        ...data.data,
        inlinePopups,
        visitorId: localStorage.visitorId,
      };

      document.body.classList.add("cs-promo-popups-loaded");
      const event = new CustomEvent("cs-promo-popups-loaded");
      document.dispatchEvent(event);
    }
  } catch (error) {
    console.error("Error fetching popups data:", error);
  }
})();
