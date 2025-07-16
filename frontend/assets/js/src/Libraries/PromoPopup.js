import { LocalStorage } from "./LocalStorage";
import { SessionStorage } from "./SessionStorage";
import { PromoHelpers } from "./PromoHelpers";
import { PromoTriggers } from "./PromoTriggers";

const popups = ["simple-popup", "lightbox-popup", "slidein-popup"];

const maybeMoveCloseButton = (popupEl, promoType) => {
  if (promoType === "fullscreen-mat") {
    const closeButtonElement = popupEl.find(
      ".wp-block-cspromo-promopopupclose__outer"
    );
    closeButtonElement.hide();
    const targetWrapper = popupEl.find(".wp-block-cspromo-promopopup__outer");
    if (closeButtonElement && targetWrapper) {
      closeButtonElement.detach().prependTo(targetWrapper).fadeIn(1000);
    }
  }
};

// check for type - simple / slidein / lightbox / mate
const maybeMovePopup = (popupEl) => {
  const $ = jQuery;
  const promoType = popupEl.data().csPromoType;

  maybeMoveCloseButton(popupEl, promoType);

  if (popups.includes(promoType)) {
    $("html").append(popupEl);
  }
};

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const target = entry.target;
    const popupWrapper = target.closest("[data-cs-promoid]");
    const targetHeight = target.clientHeight;
    const childrenHeight = target.querySelector(
      ".wp-block-cspromo-promopopup__container"
    ).clientHeight;

    if (targetHeight < childrenHeight) {
      target.classList.add("align-items-top");
    } else {
      target.classList.remove("align-items-top");
      popupWrapper.classList.add("is-overflowed");
    }

    if (childrenHeight > window.innerHeight) {
      popupWrapper.classList.add("is-overflowed");
    } else {
      popupWrapper.classList.remove("is-overflowed");
    }
  }
});

const getObservedContainer = (popupId) => {
  return document.querySelector(
    `#cs-popup-container-${popupId} .wp-block-cspromo-promopopup__outer`
  );
};

const popupObserveResize = (popupId) => {
  const popupContent = getObservedContainer(popupId);
  if (popupContent) {
    resizeObserver.observe(popupContent);
  }
};

const popupUnobserveResize = (popupId) => {
  const popupContent = getObservedContainer(popupId);
  if (popupContent) {
    resizeObserver.unobserve(popupContent);
  }
};

const addAnimationOverflowWhileAnimate = (popupID, popupContent) => {
  const $popupContainer = jQuery("#cs-popup-container-" + popupID);

  const popupType = $popupContainer.data("cs-promo-type");

  let overflowWrapper = ".wp-block-cspromo-promopopup__wrapperContent";

  switch (popupType) {
    case "slidein-popup":
      overflowWrapper = ".wp-block-cspromo-promopopup__wrapperContainer";
    case "simple-popup":
      overflowWrapper = ".wp-block-cspromo-promopopup__outer";
      break;
  }

  const $el = $popupContainer.find(overflowWrapper);

  $el[0].style.setProperty("overflow", "hidden", "important");
  popupContent.on("animationstart.overflow", () => {
    $el[0].style.setProperty("overflow", "hidden", "important");
    popupContent.on("animationend.overflow", () => {
      $el.css("overflow", "");
      $el.off("animationstart.overflow");
      $el.off("animationend.overflow");
    });
  });
};

export const PromoPopup = (() => {
  const $ = jQuery;

  const promoShow = (popupID) => {
    let elementPopupByID = $("#cs-popup-container-" + popupID);

    const isPromoPreview =
      PromoTriggers.isPromoPreview(popupID) || PromoHelpers.isPreviewPage();

    // don't try to show it again if it's already visible
    if (!elementPopupByID.length || elementPopupByID.hasClass("visible")) {
      return false;
    }

    maybeMovePopup(elementPopupByID);
    // we need to select the element again otherwise it will reference the old node
    elementPopupByID = $("#cs-popup-container-" + popupID);

    if (!isPromoPreview) {
      // check if the popup is already fired
      if (!LocalStorage.previouslyFired(popupID)) {
        promoAnalytics(popupID, "first_view");
      }

      // set the popup as fired
      LocalStorage.setPopupFired(popupID);

      // send view event
      promoAnalytics(popupID, "view");
    }

    // update the stats
    PromoTriggers.dequeuePopup(popupID);

    let duration =
      elementPopupByID
        .find("[data-animation-duration]")
        .data("animation-duration") ?? 1;

    duration = parseFloat(duration) * 1000;

    const isFullScreenMat = elementPopupByID.hasClass(
      "cs-popup-container-type-fullscreen-mat"
    );

    const isFloatingBar = elementPopupByID.hasClass(
      "cs-popup-container-type-floating-bar"
    );
    const isAboveContent = elementPopupByID.hasClass(
      "cs-fb-position-above-content"
    );

    let bodyClasses = ["cs-popup-open"].filter(Boolean);

    const isLightbox = elementPopupByID.hasClass(
      "cs-popup-container-type-lightbox-popup"
    );

    const isSlideIn = elementPopupByID.hasClass(
      "cs-popup-container-type-slidein-popup"
    );

    const isSimplePopup = elementPopupByID.hasClass(
      "cs-popup-container-type-simple-popup"
    );

    const isInlinePopup = elementPopupByID.hasClass(
      "cs-popup-container-type-inline-promotion-bar"
    );

    const animateContainer =
      isLightbox || isSlideIn || isSimplePopup || isFullScreenMat;

    document.body.classList.add(...bodyClasses);

    if (isFullScreenMat) {
      document
        .querySelector("html")
        .classList.add("cs-popup-open__fullscreen-mat");
    }

    if (animateContainer) {
      elementPopupByID.fadeIn({
        duration,
        complete: () => {
          elementPopupByID.addClass("visible");
        },
      });
    } else {
      elementPopupByID.addClass("visible");
    }

    let popupContent = elementPopupByID.find(
      ".wp-block-cspromo-promopopup__container"
    );

    if (isFullScreenMat) {
      popupContent = popupContent.closest(
        ".wp-block-cspromo-promopopup__outer"
      );
      popupContent.css("animation-duration", duration + "ms");
      popupContent.addClass("animate__animated");
    }

    const animateContent = () => {
      elementPopupByID.css("display", "");
      const effect = popupContent.data("show-effect") || "animate__None";
      if (!isInlinePopup) {
        addAnimationOverflowWhileAnimate(popupID, popupContent);
      }
      popupContent.addClass(effect);

      if (effect === "animate__None") {
        popupContent.addClass("animate__animated");
      }
    };

    // floating bar position
    if (isFloatingBar) {
      const vClass = popupContent.data("v-position");
      elementPopupByID.addClass("cs-v-pos-" + vClass);
    }

    // special cases popup type floating-bar
    if (
      elementPopupByID.hasClass("cs-popup-container-type-floating-bar") &&
      $(window).scrollTop() >= elementPopupByID.height()
    ) {
      elementPopupByID.css({
        position: "relative",
        left: "0",
        top: "0",
        right: "0",
      });
    }

    // above content
    if (elementPopupByID.hasClass("cs-fb-position-above-content")) {
      $("body").prepend(elementPopupByID);
    }

    if (popupContent.length) {
      if (isAboveContent) {
        elementPopupByID.css("max-height", "0px");

        const whileAnimate = () => {
          const frameExecution = () => {
            const popupContentRect = popupContent
              .closest(".animate__animated")[0]
              .getBoundingClientRect();
            const popupIdRect = elementPopupByID[0].getBoundingClientRect();

            // calculate the intersection height of the two rects
            const intersectionHeight = Math.max(
              popupContentRect.bottom - popupIdRect.top,
              0
            );

            elementPopupByID.css(
              "max-height",
              Math.max(intersectionHeight) + "px"
            );
          };

          const start = performance.now();
          const end = start + duration;

          frameExecution();

          function animate(time) {
            if (time <= end) {
              frameExecution();
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        };

        popupContent.on("animationstart.cs-promo-popup-enter", () =>
          requestAnimationFrame(whileAnimate)
        );
        popupContent.on("animationend.cs-promo-popup-enter", () => {
          popupContent.off("animationstart.cs-promo-popup-enter");
          popupContent.off("animationend.cs-promo-popup-enter");
          elementPopupByID.css("max-height", "auto");
        });
      }

      popupObserveResize(popupID);
      animateContent();

      if (isLightbox) {
      }
    }
  };

  const promoAnalytics = (popupId, gaEvent, identifier = null) => {
    if (PromoTriggers.isPromoPreview(popupId) || PromoHelpers.isPreviewPage()) {
      return;
    }

    const payload = {
      action: "iconvertpr_promo_analytics",
      event: gaEvent,
      popup: popupId,
      identifier: identifier,
      _wpnonce: SessionStorage.get("analytics_nonce"),
      visitor_id: LocalStorage.getVisitorId(),
    };

    $.post(cs_promo_settings.ajax_url, payload, (response) => {});
  };

  const promoRemovePopupEvent = (
    popupID,
    { disableEsc = false, externalClose = false, disableMaskClick = false } = {}
  ) => {
    const mainPopupContainer = $("#cs-popup-container-" + popupID);

    mainPopupContainer.attr("data-disable-esc", disableEsc);
    mainPopupContainer.attr("data-disable-mask-click", disableMaskClick);
    mainPopupContainer.attr("data-external-close", externalClose);

    if (mainPopupContainer.attr("data-exit-bounded")) {
      return;
    }

    mainPopupContainer.attr("data-exit-bounded", true);
    setTimeout(() => {
      $("body").on("keydown", exit);
      $("body").on("click", mainPopupContainer, exit);
      mainPopupContainer.on("click", exit);
    }, 0);

    const exit = (e) => {
      const popupContainer = e.target.closest(".cs-popup-container");
      const newPopupID = popupContainer?.dataset?.csPromoid;

      if (typeof newPopupID !== "undefined") {
        popupID = newPopupID;
      }

      const mainPopupContainer = $("#cs-popup-container-" + popupID);
      const disableEsc = mainPopupContainer.attr("data-disable-esc") === "true";
      const disableMaskClick =
        mainPopupContainer.attr("data-disable-mask-click") === "true";
      const externalClose =
        mainPopupContainer.attr("data-external-close") === "true";

      const isCloseButton = !!e.target.closest(".cs-popup-close");

      if (isCloseButton) {
        e.preventDefault();
      }

      let isClosedByMask =
        !disableMaskClick && e.target.id === "cs-popup-container-" + popupID;

      let isClosedByEsc = !disableEsc && e.keyCode === 27;

      let isClosedByIcon = isCloseButton;

      let shouldExit =
        isClosedByMask ||
        isClosedByEsc ||
        isClosedByIcon ||
        externalClose === true;
      if (
        $("#cs-popup-container-" + popupID).hasClass(
          "cs-popup-container-type-floating-bar"
        )
      ) {
        shouldExit = isCloseButton;
      }

      if (shouldExit) {
        promoClosePopup(popupID);

        if (isCloseButton) {
          const label = $(e.target)
            .closest("[data-conversion-identifier]")
            .data("conversion-identifier");
          promoAnalytics(popupID, "close", label);
        }
      }
    };

    if (externalClose === true) {
      exit();
    }
  };

  const promoClosePopup = (popupID) => {
    document.body.classList.forEach((className) => {
      if (className.startsWith("cs-popup-open")) {
        document.body.classList.remove(className);
      }
    });

    document
      .querySelector("html")
      .classList.remove("cs-popup-open__fullscreen-mat");

    const mainPopupContainer = $("#cs-popup-container-" + popupID);

    // don't try to show it again if it's already visible
    if (!mainPopupContainer.length || !mainPopupContainer.hasClass("visible")) {
      return false;
    }

    let duration =
      mainPopupContainer
        .find("[data-animation-duration]")
        .data("animation-duration") ?? 1;

    duration = parseFloat(duration) * 1000;

    let popupContent = mainPopupContainer.find(
      ".wp-block-cspromo-promopopup__container"
    );

    const isFullScreenMat = mainPopupContainer.hasClass(
      "cs-popup-container-type-fullscreen-mat"
    );

    if (isFullScreenMat) {
      popupContent = popupContent.closest(
        ".wp-block-cspromo-promopopup__outer"
      );
    }

    const showAnimate =
      popupContent.attr("data-show-effect") || "animate__None";
    const exitAnimate =
      popupContent.attr("data-exit-effect") || "animate__None";

    const isAboveContent = mainPopupContainer.hasClass(
      "cs-fb-position-above-content"
    );

    const hideMainContainer = (slide = false, duration = 0) => {
      popupUnobserveResize(popupID);

      const complete = () => {
        mainPopupContainer.removeClass("visible");
        popupContent.removeClass(exitAnimate);
        mainPopupContainer.css("display", "");
      };

      mainPopupContainer[slide ? "slideUp" : "fadeOut"]({
        duration,
        complete,
      });
    };

    if (exitAnimate) {
      if (isAboveContent) {
        const whileAnimate = () => {
          const frameExecution = () => {
            const popupContentRect = popupContent[0].getBoundingClientRect();
            const popupIdRect = mainPopupContainer[0].getBoundingClientRect();

            // calculate the intersection height of the two rects
            const intersectionHeight = Math.max(
              popupContentRect.bottom - popupIdRect.top,
              0
            );

            mainPopupContainer.css(
              "max-height",
              Math.max(intersectionHeight) + "px"
            );
          };

          const start = performance.now();
          const end = start + duration;

          frameExecution();

          function animate(time) {
            if (time <= end) {
              frameExecution();
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        };

        popupContent.on("animationstart.cs-promo-popup-exit", whileAnimate);
        popupContent.on("animationend.cs-promo-popup-exit", () => {
          popupContent.off("animationstart.cs-promo-popup-exit");
          popupContent.off("animationend.cs-promo-popup-exit");
          mainPopupContainer.css("max-height", "0");
        });
        hideMainContainer(
          true,
          exitAnimate === "animate__None" ? 0 : duration
        );
      } else {
        const isLightbox =
          mainPopupContainer.hasClass(
            "cs-popup-container-type-lightbox-popup"
          ) ||
          mainPopupContainer.hasClass(
            "cs-popup-container-type-fullscreen-mat"
          ) ||
          mainPopupContainer.hasClass(
            "cs-popup-container-type-slidein-popup"
          ) ||
          mainPopupContainer.hasClass("cs-popup-container-type-floating-bar") ||
          mainPopupContainer.hasClass("cs-popup-container-type-simple-popup");

        if (isLightbox) {
          hideMainContainer(false, duration);
        } else {
          popupContent.on("animationend", () => hideMainContainer(false, 0));
        }
      }
      addAnimationOverflowWhileAnimate(popupID, popupContent);

      popupContent.removeClass(showAnimate).addClass(exitAnimate);
    } else {
      hideMainContainer();
    }

    if (!PromoHelpers.isPreviewPage()) {
      LocalStorage.setPopupConversion(popupID, "closed");
    }
  };

  const listenForExternalClose = () => {
    document.body.addEventListener("closePopup", (e) => {
      promoClosePopup(e.detail.popupID);
    });
  };

  const listenForExternalOpen = () => {
    document.body.addEventListener("openPopup", (e) => {
      promoShow(e.detail.popupID);
    });
  };

  const listenForExternalAnalytics = () => {
    document.body.addEventListener("icPromoAnalyticsPopup", (e) => {
      const { popupID, event, identifier } = e.detail;
      promoAnalytics(popupID, event, identifier);
    });
  };

  return {
    promoAnalytics,
    promoShow,
    promoRemovePopupEvent,
    promoClosePopup,
    listenForExternalClose,
    listenForExternalOpen,
    listenForExternalAnalytics,
  };
})();
