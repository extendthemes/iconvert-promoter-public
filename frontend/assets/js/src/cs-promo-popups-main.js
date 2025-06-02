/* global promoTriggersSettings */

import { PromoActionButton } from "./Libraries/Editor/PromoActionButton";
import { LocalStorage } from "./Libraries/LocalStorage";
import { PromoHelpers } from "./Libraries/PromoHelpers";
import { PromoMessageBox } from "./Libraries/PromoMessageBox";
import { PromoPopup } from "./Libraries/PromoPopup";
import { PromoTriggers } from "./Libraries/PromoTriggers";
import { PromoTriggerSetup } from "./Libraries/PromoTriggerSetup";
import { SessionStorage } from "./Libraries/SessionStorage";
import { startInteractivityMonitor } from "./monitors";

const loadHeadData = (headHTML) => {
  jQuery("head").append(headHTML);
};

async function start($) {
  if (PromoHelpers.isPreviewPage()) {
    PromoActionButton.setup();
    return;
  }

  const {
    head,
    popups,
    triggers,
    inlinePopups,
    analytics_nonce,
    data: extraData = {},
  } = window.icPromoPopupsData || {};

  loadHeadData(head);

  $("head").append(head);

  if (!PromoHelpers.isPreviewPage()) {
    LocalStorage.maybeCountSession();
    startInteractivityMonitor();
  }

  Object.entries(popups).forEach(([key, value]) => {
    if (value) {
      if (inlinePopups.includes(parseInt(key))) {
        $(`[data-iconvert-inline-popup-id="${key}"]`).replaceWith(value);
        return;
      }

      $("body").append(value);
    }
  });

  SessionStorage.set("analytics_nonce", analytics_nonce);

  new PromoTriggerSetup(triggers, extraData);
  PromoTriggers.watch();
  PromoActionButton.setup();

  PromoPopup.listenForExternalClose();
  PromoPopup.listenForExternalOpen();
  PromoPopup.listenForExternalAnalytics();

  if (PromoHelpers.isPreviewPage()) {
    // shouldn't be able to submit a form
    $("form").on("submit", function (e) {
      e.stopPropagation();
      e.preventDefault();
      PromoMessageBox.show("You cannot submit forms in preview mode.", {});
    });

    // or click a link/button
    $(" a , button ").each((index, elem) => {
      const container = $(elem).closest(".cs-popup-container");
      if (container.length === 0) {
        $(elem).on("click", function (e) {
          e.stopPropagation();
          e.preventDefault();

          PromoMessageBox.show(
            "You cannot click links and buttons in preview mode.",
            {}
          );
        });
      }
    });
  }
}

if (document.body.classList.contains("cs-promo-popups-loaded")) {
  start(jQuery);
}

document.addEventListener("cs-promo-popups-loaded", function () {
  start(jQuery);
});
