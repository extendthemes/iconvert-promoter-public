import { ICModal } from "../email-lists/Lib/ICModal";
import { eventIsFromUIUpdate, updateUIValue } from "../utils";

export const ICPromoTypesSettings = (() => {
  const $ = jQuery;
  const maybeParseJSON = (str) => {
    try {
      const parsed = JSON.parse(str);

      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (e) {}

    return false;
  };

  let positionManuallyChanged = false;
  let animationsManuallyChanged = false;

  const setOptionsVisible = (_input) => {
    const settings = _input.data("settings");
    $(".promo-type-options .pto-position-wrapper").removeClass(
      "pto-position-selected"
    );
    $(
      ".promo-type-options .pto-position-wrapper." + settings.position
    ).addClass("pto-position-selected");

    $("input[name='toggle-options-position-tb']").on("change", (event) => {
      const _selected = $(".pto-position-selected")
        .find('input[name="toggle-options-position-tb"]:checked')
        .val();
      if (_selected === "end") {
        $(".icp-toggle-options-content").hide();
      } else {
        $(".icp-toggle-options-content").show();
      }

      if (!eventIsFromUIUpdate(event)) {
        positionManuallyChanged = true;
      }

      setAnimations();
    });

    $("input[name='toggle-options-content']").on("change", (event) => {
      if (!eventIsFromUIUpdate(event)) {
        positionManuallyChanged = true;
      }
    });

    $('select[name="toggle-options-position"]').on("change", (event) => {
      if (!eventIsFromUIUpdate(event)) {
        positionManuallyChanged = true;
      }

      setAnimations();
    });

    $('select[name="toggle-options-position"]').select2();

    $(".pto-animation-wrapper").show();

    const animateInSelect = $("[name='toggle-options-animation-in']");
    const animateOutSelect = $("[name='toggle-options-animation-out']");

    animateInSelect.add(animateOutSelect).on("change", (event) => {
      if (eventIsFromUIUpdate(event)) {
        return;
      }

      animationsManuallyChanged = true;
    });

    animateInSelect.select2();
    animateOutSelect.select2();

    setTimeout(() => {
      if (settings.animationIn) {
        updateUIValue(animateInSelect, settings.animationIn);
      }

      if (settings.animationOut) {
        updateUIValue(animateOutSelect, settings.animationOut);
      }
    });
  };

  const computeAnimationsValues = (
    promoType,
    position,
    effectsSides = null
  ) => {
    let effect = "effectFading";
    let animation = "fade";

    if (!effectsSides) {
      effectsSides = {
        in: "In",
        out: "Out",
      };
    }

    switch (promoType) {
      case "slidein-popup":
        effect = "effectSliding";
        animation = "slide";

        if (position === "center#center") {
          effectsSides = {
            in: "InRight",
            out: "OutRight",
          };
        }

        break;
      case "floating-bar":
        animation = "fade";

        if (position === "start") {
          effectsSides = {
            in: "InDown",
            out: "OutUp",
          };
        } else {
          effectsSides = {
            in: "InUp",
            out: "OutDown",
          };
        }
        break;
    }

    let animationIn = effect + "#" + animation + effectsSides.in;
    let animationOut = effect + "#" + animation + effectsSides.out;

    if (promoType === "inline-promotion-bar") {
      animationIn = "";
    }

    return {
      animationIn,
      animationOut,
    };
  };

  const setAnimations = (templateSettings) => {
    if (animationsManuallyChanged) {
      return;
    }

    let { effectsSides, position, promoType } = buildPromoTypeSettings();

    let { animationIn, animationOut } = computeAnimationsValues(
      promoType,
      position,
      effectsSides
    );

    if (templateSettings) {
      animationIn = templateSettings?.showEffect || animationIn;
      animationOut = templateSettings?.hideEffect || animationOut;
    }

    $(".animations-in-options").hide();
    $(".animations-out-options").hide();

    switch (promoType) {
      case "inline-promotion-bar":
        $(".animations-out-options").show();
        break;
      default:
        $(".animations-in-options").show();
        $(".animations-out-options").show();
        break;
    }

    updateUIValue($("[name='toggle-options-animation-in']"), animationIn);
    updateUIValue($("[name='toggle-options-animation-out']"), animationOut);
  };

  const setDefaultSettings = (settings) => {
    if (typeof settings === "undefined") {
      settings = false;
    }
    getPromoTypeSettings(settings, true);
  };

  const buildPromoTypeSettings = (
    templateSettings = false,
    categoryDefaults = false
  ) => {
    const selected = $(".pto-position-selected");
    let settings = {};

    const promoType = $(
      '.wrapper-types .active input[name="promo-type"],#promo-edit-form [name="promo-type"][data-settings]'
    );
    settings.promoType = promoType.val();

    if (selected.hasClass("position-matrix")) {
      const position = selected
        .find('select[name="toggle-options-position"]')
        .val();
      settings.position = position;
    }

    if (selected.hasClass("settings-floating-bar")) {
      const position = selected
        .find('input[name="toggle-options-position-tb"]:checked')
        .val();
      settings.position = position;

      const contentPosition = selected
        .find('input[name="toggle-options-content"]:checked')
        .val();
      settings.contentPosition = contentPosition;
    }

    // get effects sides
    const { effectsSides = null } =
      selected
        .find('select[name="toggle-options-position"]')
        .find(`[value="${settings.position}"`)
        .data() || {};

    settings.effectsSides = effectsSides;

    if (templateSettings !== false) {
      if (selected.hasClass("position-matrix")) {
        settings.position = positionMatrix(settings.position, templateSettings);
      }

      if (selected.hasClass("settings-floating-bar")) {
        settings.position = getTemplateSetting(
          "align",
          templateSettings,
          settings.position
        );
        settings.contentPosition = getTemplateSetting(
          "contentPosition",
          templateSettings,
          settings.contentPosition
        );
      }
    } else if (categoryDefaults !== false) {
      // set category defaults
      const category = $('input[name="promo-type"]:checked');

      if (category.length) {
        const categorySettings = category.data("settings");

        if (selected.hasClass("position-matrix")) {
          settings.position = positionMatrix(
            categorySettings.defaultPosition,
            {}
          );
        }

        if (selected.hasClass("settings-floating-bar")) {
          settings.position = categorySettings.defaultPosition;
          settings.contentPosition = categorySettings.contentPosition;
        }
      }
    }

    settings.animationIn = $(
      'select[name="toggle-options-animation-in"]'
    ).val();

    settings.animationOut = $(
      'select[name="toggle-options-animation-out"]'
    ).val();

    if ($('input[name="options-animation-duration"]').length) {
      settings.animationDuration = $(
        'input[name="options-animation-duration"]'
      ).val();
    }

    if (templateSettings.useAppropriateAnimations) {
      const { effectsSides = null } =
        selected
          .find('select[name="toggle-options-position"]')
          .find(`[value="${settings.position}"`)
          .data() || {};

      const { animationIn, animationOut } = computeAnimationsValues(
        promoType,
        settings.position,
        effectsSides
      );
      settings.animationIn = animationIn;
      settings.animationOut = animationOut;
    }

    if (templateSettings) {
      settings.animationIn =
        templateSettings.showEffect || settings.animationIn;
      settings.animationOut =
        templateSettings.hideEffect || settings.animationOut;
    }

    return settings;
  };

  const getPromoTypeSettings = (
    templateSettings = false,
    categoryDefaults = false
  ) => {
    const settings = buildPromoTypeSettings(templateSettings, categoryDefaults);
    const selected = $(".pto-position-selected");

    if (!positionManuallyChanged) {
      setSelectedOptions(settings, selected);
    }

    if (!animationsManuallyChanged) {
      setAnimations(templateSettings);
    }

    return settings;
  };

  const setSelectedOptions = (settings, selected) => {
    if (selected.hasClass("position-matrix")) {
      updateUIValue(
        selected.find("select[name='toggle-options-position']"),
        settings.position
      );
    }

    if (selected.hasClass("settings-floating-bar")) {
      updateUIValue(
        selected.find(
          `input[name="toggle-options-position-tb"][value="${settings.position}"]`
        ),
        settings.position
      );

      updateUIValue(
        selected.find(
          `input[name="toggle-options-content"][value="${settings.contentPosition}"]`
        ),
        settings.contentPosition
      );
    }
  };

  const getTemplateSetting = (setting, templateSettings, defaultValue) => {
    let result = defaultValue;

    if (Object.hasOwn(templateSettings, setting)) {
      result = templateSettings[setting];
    }

    return result;
  };

  const positionMatrix = (position, templateSettings) => {
    const alignSettings = (position || "center#center").split("#");

    const align = getTemplateSetting(
      "align",
      templateSettings,
      alignSettings[0]
    );
    const alignH = getTemplateSetting(
      "alignH",
      templateSettings,
      alignSettings[1]
    );

    return `${align}#${alignH}`;
  };

  const showPreviewTemplate = (
    previewURL,
    previewID,
    templateSettings,
    label
  ) => {
    const image = encodeURIComponent(previewURL);

    templateSettings = $.extend({}, templateSettings);

    if (positionManuallyChanged) {
      delete templateSettings["align"];
      delete templateSettings["alignH"];
      delete templateSettings["contentPosition"];
    }

    if (positionManuallyChanged) {
      delete templateSettings["showEffect"];
      delete templateSettings["hideEffect"];
    }

    if (positionManuallyChanged && !animationsManuallyChanged) {
      templateSettings["useAppropriateAnimations"] = true;
    }

    if(animationsManuallyChanged){
      delete templateSettings["useAppropriateAnimations"];
      delete templateSettings["showEffect"];
      delete templateSettings["hideEffect"];
    }

    const settings = buildPromoTypeSettings(templateSettings);

    let preview = new URL($("#icp-preview-url").val());

    Object.keys(settings).forEach((param) => {
      preview.searchParams.append(param, settings[param]);
    });

    preview.searchParams.append("template_id", previewID);
    preview.searchParams.append("image", image);
    preview.searchParams.append("promoType", settings.promoType);

    if (window.innerWidth > 1024) {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", preview.href);
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.opacity = "0";

      const container = document.createElement("div");
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.overflow = "hidden";
      container.appendChild(iframe);

      const loader = document.createElement("div");
      loader.className = "icp-preview-loader";
      loader.innerHTML = `<div class="d-flex flex-wrap align-content-start templates"><div class="d-flex justify-content-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div></div>`;

      container.appendChild(loader);
      iframe.onload = () => {
        container.removeChild(loader);
        iframe.style.opacity = "1";
      };

      const modalSettings = {
        size: "large",
        primary_button: "x",
        secondary_button: "Cancel",
        callback: () => {},
      };

      ICModal.previewModal(
        label ? `Previewing - ${label}` : "Preview",
        container,
        modalSettings
      );
    } else {
      window.open(preview.href, "_blank").focus();
    }
  };
  return {
    setOptionsVisible,
    getPromoTypeSettings,
    showPreviewTemplate,
    maybeParseJSON,
    setDefaultSettings,
    buildPromoTypeSettings,
  };
})();
