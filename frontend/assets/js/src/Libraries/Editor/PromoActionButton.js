import { LocalStorage } from "../LocalStorage";
import { PromoHelpers } from "../PromoHelpers";
import { PromoMessageBox } from "../PromoMessageBox";
import { PromoPopup } from "../PromoPopup";

export const PromoActionButton = (() => {
  const $ = jQuery;
  const visibleClass = "visible";

  const setup = () => {
    copyCode();
    setAnalyticsOnClick();
    setConversionTracking();
  };

  const setAnalyticsOnClick = () => {
    if (PromoHelpers.isPreviewPage()) {
      $(document).on("click", ".cs-popup-action a", function (e) {
        e.preventDefault();
        e.stopPropagation();
        PromoMessageBox.show(
          "You cannot click links and buttons in preview mode.",
          {}
        );
      });
      return;
    }

    document.querySelectorAll(".cs-popup-action a").forEach((element) => {
      element.addEventListener("click", clickPopupElemEvent);
    });
  };

  const clickPopupElemEvent = (e) => {
    const element = e.target;
    const parentPopup = element.closest(".cs-popup-container");

    if (parentPopup) {
      const popupID = parentPopup?.dataset?.csPromoid;
      if (popupID) {
        const label = $(e.target)
          .closest("[data-conversion-identifier]")
          .data("conversion-identifier");
        PromoPopup.promoAnalytics(popupID, "click", label);
        // prevent multiple clicks
        element.removeEventListener("click", clickPopupElemEvent);
      }
    }
  };

  const copyCode = () => {
    document.querySelectorAll(".cs-popup-copy").forEach((item) => {
      const css = {
        backgroundColor: $(item).css("background-color"),
        borderColor: $(item).css("border-color"),
        borderRadius: $(item).css("border-radius"),
        color: $(item).css("color"),
      };
      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const textToCopy = item.dataset?.copy;

        if(PromoHelpers.isPreviewPage()) {
          PromoMessageBox.show(
           `Normally this button would copy <strong style="font-weight:700;color:#2271b1">${textToCopy}</strong> to clipboard,<br/>but in preview mode, the copy functionality is disabled.`,
            {}
          );
          return;
        }

        if (textToCopy) {
          PromoHelpers.copyToClipboard(textToCopy);
          showTooltip(item, css);
        }
      });
    });
  };

  const showTooltip = (item, css = {}) => {
    const _elem = $(item);
    let messageDiv = _elem
      .parents(".cs-popup-action")
      .find(".optrix-success-message");
    if (messageDiv.length > 0) {
      messageDiv.removeClass(visibleClass);
    } else {
      // const container = document.createElement("div");
      _elem.after(
        `<div class="optrix-success-message animate__animated">${item.dataset?.success}</div>`
      );
      messageDiv = _elem
        .parents(".cs-popup-action")
        .find(".optrix-success-message");
    }

    if (!css.backgroundColor) {
      css.backgroundColor = _elem.css("background-color");
    }

    if (!css.borderColor) {
      css.borderColor = _elem.css("border-color");
    }

    if (!css.borderRadius) {
      css.borderRadius = _elem.css("border-radius");
    }

    if (!css.color) {
      css.color = _elem.css("color");
    }

    messageDiv.css(css);

    messageDiv.addClass(visibleClass);

    setTimeout(
      () => {
        messageDiv.removeClass(visibleClass);
      },
      Math.max(
        1200,
        // an educated guess of how long it takes to read 10 characters
        Math.ceil(messageDiv.text().length / 7) * 1000
      )
    );
  };

  const setConversionTracking = () => {
    $(document).on("click", "[data-is-conversion] a", function () {
      if (PromoHelpers.isPreviewPage()) {
        return;
      }

      const parentPopup = $(this).closest(".cs-popup-container");

      if (parentPopup) {
        const popupID = parentPopup.data("cs-promoid");
        if (popupID) {
          LocalStorage.setPopupConversion(popupID, "converted");
        }
      }
    });

    $(document).on("iconvert_email_subscribed", function (e, data) {
      if (PromoHelpers.isPreviewPage()) {
        return;
      }

      const popupID = data.popupID;

      if (popupID) {
        LocalStorage.setPopupConversion(popupID, "converted");
      }
    });
  };

  return {
    setup,
  };
})();
