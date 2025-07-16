import { ICPromoTypesSettings } from "./ICPromoTypesSettings";
import { SnackBarAlert } from "../snack-bar-alert";

jQuery(document).ready(function ($) {
  const bodyElem = $("body");

  function markProButtonAsRequiresPro(e = false) {
    let isForPro = false;
    if (e === false) {
      isForPro = true;
    } else {
      isForPro =
        $(e.currentTarget).find(".template-name").data("pro") === "required";
    }
    const _button = $(".button-create-campaign");
    if (isForPro) {
      _button.attr("data-pro", "required");
      _button.attr(
        "data-pro-text",
        "The selected template is only available in PRO."
      );
    } else {
      _button.removeAttr("data-pro");
      _button.removeAttr("data-pro-text");
    }
  }

  function activateCreateCampaignButton() {
    const _button = $(".button-create-campaign");
    _button.attr("disabled", false);
  }

  bodyElem.on("click", ".wrapper-templates .templates .box-item .item", (e) => {
    markProButtonAsRequiresPro(e);
  });

  $(".wrapper-types label.item").on("click", function (e) {
    e.preventDefault();
    activateCreateCampaignButton();
    $(".wrapper-types label.item").removeClass("active");
    $(this).addClass("active");
    const promoTypeInput = $(this).find('input[name="promo-type"]');
    const templatesNode = $(".wrapper-templates .templates");
    const templatesCategoriesNode = $(".templates-categories-list");
    const promoTypeVal = promoTypeInput.val();
    promoTypeInput.prop("checked", "checked");
    templatesNode.html(null);
    templatesNode.append(spinnerNode());
    templatesCategoriesNode
      .closest(".template-categories")
      .addClass("in-progress");

    $(".promo-type-preview img").attr("src", $(this).data("preview-img"));
    $(".promo-type-preview img").attr("alt", $(this).find(".title").text());

    $(document).on("click", ".templates-categories button", function () {
      const $btn = $(this);
      const category = $btn.data("category");

      $btn
        .removeClass("ic-promo-button-secondary")
        .addClass("ic-promo-button-primary active");
      $btn
        .siblings(".ic-promo-button")
        .removeClass("ic-promo-button-primary active")
        .addClass("ic-promo-button-secondary");

      const items = templatesNode.find(".box-item");
      let itemsToDisplay = items;

      if (category !== "*") {
        itemsToDisplay = items.filter(`[data-category*="${category}"]`);
      }

      itemsToDisplay = itemsToDisplay.add(items.filter("[data-is-blank]"));

      items.not(itemsToDisplay).hide();
      let animationCompleteRun = false;
      itemsToDisplay.fadeIn({
        duration: 200,
        complete: function () {
          if (animationCompleteRun) {
            return;
          }

          animationCompleteRun = true;

          itemsToDisplay.first().find(".item ").click();
        },
      });
    });

    // change the promo name to accomodate the promo type if the user has not typed anything
    const promoName = $('input[name="promo-name"]');
    if (!promoName.attr("data-user-typed")) {
      const labelPrefix = $(this).find(".title").text();
      const date = new Date().toLocaleString();

      promoName.val(labelPrefix + " - " + date);
    }

    $.post(
      cs_promo_settings.ajax_url,
      {
        action: "iconvertpr_promo_get_template_by_type",
        promo_type: promoTypeVal,
        _wpnonce_get_template: $('input[name="_wpnonce_get_template"]').val(),
      },
      (response) => {
        templatesNode.html(null);

        if (response.success) {
          let _selected = false;
          let _first = 0;

          const previousCat =
            templatesCategoriesNode
              .find("button.ic-promo-button-primary.active")
              .data("category") || "*";

          const { categories, templates } = response.data;

          renderCategories(templatesCategoriesNode, categories);

          templates.forEach((item) => {
            if (_first == 0 && parseInt(item.is_blank) == 0) {
              _selected = true;
              _first = parseInt(item.id);
            } else {
              _selected = false;
            }

            if (_selected) {
              ICPromoTypesSettings.setOptionsVisible(promoTypeInput);
              ICPromoTypesSettings.setDefaultSettings(
                promoTypeInput.data.settings
              );
              selectTemplateItem(promoTypeInput);

              if (item.is_pro === "1") {
                markProButtonAsRequiresPro();
              }
            }

            templatesNode.append(createTemplateItemNode(item, _selected));
          });

          const hasPrevCategory =
            templatesCategoriesNode.find(
              `button[data-category="${previousCat}"]`
            ).length > 0;

          if (!hasPrevCategory) {
            templatesCategoriesNode
              .find("button[data-category='*']")
              .trigger("click");
          } else {
            templatesCategoriesNode
              .find(`button[data-category="${previousCat}"]`)
              .trigger("click");
          }
        }
      }
    );
  });

  $(document).on("keydown", 'input[name="promo-name"]', function () {
    $(this).removeClass("validation-fail");
    activateCreateCampaignButton();
    $(this).attr("data-user-typed", "true");
  });

  bodyElem.on("click", 'button[name="promo-create"]', function (e) {
    const _button = $(this);
    const isPRO = _button.attr("data-pro") === "required";

    if (isPRO) {
      return;
    }

    e.preventDefault();

    _button.attr("disabled", "disabled");
    const promoName = $('input[name="promo-name"]');
    const promoType = $('input[name="promo-type"]:checked');
    const promoTemplate = $(
      '.item.selected input[name="template-selected"]'
    ).val();
    const promoTemplateIsPro = $(".item.selected .template-name").data("pro");

    const isEmpty = (fieldVal) => {
      return fieldVal.length === 0 || !fieldVal.trim().length;
    };

    if (isEmpty(promoName.val())) {
      promoName.addClass("validation-fail");
      setTimeout(function () {
        promoName.removeClass("validation-fail");
      }, 5000);
      SnackBarAlert.alertMessage("Campaign Name is required.", "error", {
        timeout: false,
      });
      promoName.focus();
      return;
    }
    if (promoTemplate === undefined) {
      _button.removeAttr("disabled");
      return;
    } else {
      _button.html(_button.data("loading"));
    }
    const payload = getPayloadCreate(
      promoName.val(),
      promoType.val(),
      promoTemplate
    );

    const promoSettings = ICPromoTypesSettings.getPromoTypeSettings();

    $.post(
      cs_promo_settings.ajax_url,
      {
        action: "iconvertpr_create_popup",
        payload,
        promoSettings,
        _wpnonce: $('input[name="_wpnonce"]').val(),
      },
      (response) => {
        if (response && response.success) {
          SnackBarAlert.alertMessage(response.data.message, "success");
          window.location.href = response.data.url_redirect;
        } else {
          SnackBarAlert.alertMessage(response.data, "error");
          _button.removeAttr("disabled");
        }
      }
    );
  });

  $('input[name="promo-type"][value="simple-popup"]')
    .closest(".item")
    .trigger("click");

  bodyElem.on("click", ".button-preview-template", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const _elem = $(this);
    const position = _elem.data("position-preview");

    ICPromoTypesSettings.showPreviewTemplate(
      _elem.data("template-preview"),
      _elem.data("template-id"),
      {
        ...position,
      },
      $(this).closest("[data-settings]").find(".wrapper-template-title").text()
    );
  });

  const selectTemplateItem = (item) => {
    item.closest(".templates").find(".item").removeClass("selected");

    // if (item.closest("[data-pro-template]").length > 0) {
    //   return;
    // }
    const settings = item.data("settings");
    ICPromoTypesSettings.setDefaultSettings(settings);

    item.addClass("selected");
  };

  bodyElem.on(
    "click",
    ".wrapper-templates .templates .box-item .item",
    function () {
      selectTemplateItem($(this));
    }
  );

  function createTemplateItemNode(item, _selected = false) {
    const { id, name, image: preview, is_pro, is_blank, settings } = item;
    const templateSettings = ICPromoTypesSettings.maybeParseJSON(item.settings);

    const wrapperItem = document.createElement("div");
    wrapperItem.classList.add(
      "col-xl-4",
      "col-lg-6",
      "col-md-12",
      "col-sm-12",
      "col-xs-12",
      "box-item"
    );

    const itemTemplateNode = document.createElement("div");
    itemTemplateNode.classList.add("item", "d-flex", "flex-column");

    if (_selected) {
      itemTemplateNode.classList.add("selected");

      if (templateSettings !== false) {
        ICPromoTypesSettings.setDefaultSettings(templateSettings);
      }
    }

    if (templateSettings !== false) {
      itemTemplateNode.setAttribute("data-settings", item.settings);
    }

    const spanWrapperTemplateTitle = document.createElement("div");
    spanWrapperTemplateTitle.classList.add(
      "d-flex",
      "flex-row",
      "justify-content-between",
      "align-content-center",
      "wrapper-template-title"
    );

    const spanNameNode = document.createElement("div");
    spanNameNode.classList.add("template-name");
    spanNameNode.innerHTML = name;
    if (is_pro == 1 && $(`[data-template-list-is-pro-preview]`).length > 0) {
      spanNameNode.setAttribute("data-pro", "required");
      wrapperItem.setAttribute("data-pro-template", true);
      wrapperItem.setAttribute("data-placement", "bottom");
      wrapperItem.setAttribute("data-self-boundary", true);
      wrapperItem.setAttribute("data-offset", "0px, -50%r - 100%p");
    }

    spanWrapperTemplateTitle.appendChild(spanNameNode);

    const divWrapperImg = document.createElement("div");
    divWrapperImg.classList.add(
      "d-flex",
      "align-items-center",
      "justify-content-center",
      "wrapper-img"
    );

    const imgPreviewNode = document.createElement("img");
    imgPreviewNode.classList.add("template-preview");
    imgPreviewNode.alt = "Image " + name;
    imgPreviewNode.src = preview;

    divWrapperImg.appendChild(imgPreviewNode);

    itemTemplateNode.appendChild(spanWrapperTemplateTitle);
    itemTemplateNode.appendChild(divWrapperImg);
    const inputHidden = document.createElement("input");
    inputHidden.type = "hidden";
    inputHidden.name = "template-selected";
    inputHidden.value = id;

    if (is_blank == 0) {
      const divWrapperActions = document.createElement("div");
      divWrapperActions.classList.add(
        "d-flex",
        "justify-content-end",
        "wrapper-actions"
      );

      const buttonPreview = document.createElement("div");
      buttonPreview.classList.add(
        "button",
        "button-secondary",
        "button-preview-template"
      );
      buttonPreview.setAttribute("data-template-preview", preview);
      buttonPreview.setAttribute("data-template-id", id);
      buttonPreview.setAttribute("data-position-preview", settings);
      buttonPreview.name = "promo-preview";
      buttonPreview.innerHTML = '<i class="bi bi-eye-fill"></i>';

      divWrapperActions.appendChild(buttonPreview);
      itemTemplateNode.appendChild(divWrapperActions);
    }

    itemTemplateNode.appendChild(inputHidden);
    wrapperItem.appendChild(itemTemplateNode);

    wrapperItem.setAttribute("data-category", item?.categories || "*");
    if (is_blank == 1) {
      wrapperItem.setAttribute("data-is-blank", true);
    }
    return wrapperItem;
  }

  function createTemplateCategoryNode(category) {
    const { slug, label } = category;

    const buttonCategory = document.createElement("button");
    buttonCategory.classList.add(
      "ic-promo-button",
      "ic-promo-button-secondary",
      "ic-promo-button-sm"
    );

    buttonCategory.setAttribute("data-category", slug);
    buttonCategory.innerHTML = label;

    return buttonCategory;
  }

  function renderCategories(templatesCategoriesNode, categories) {
    templatesCategoriesNode.find("button:not([data-category='*'])").remove();
    categories.forEach((category) => {
      templatesCategoriesNode.append(createTemplateCategoryNode(category));
    });

    templatesCategoriesNode.closest(".in-progress").removeClass("in-progress");
  }

  function spinnerNode() {
    const divSpinnerNode = document.createElement("div");
    divSpinnerNode.classList.add("d-flex", "justify-content-center");

    const divSpinnerBorder = document.createElement("div");
    divSpinnerBorder.classList.add("spinner-border");
    divSpinnerBorder.role = "status";

    const spanSrOnly = document.createElement("span");
    spanSrOnly.classList.add("sr-only");
    spanSrOnly.innerHTML = "Loading...";

    divSpinnerBorder.appendChild(spanSrOnly);
    divSpinnerNode.appendChild(divSpinnerBorder);

    return divSpinnerNode;
  }

  function getPayloadCreate(name, type, template) {
    const payload = {
      triggers: {},
      display_conditions: {},
      name,
      type,
      template,
    };

    payload.display_conditions["start-time"] = "";
    payload.display_conditions["end-time"] = "";

    payload.display_conditions["devices"] = ["desktop", "mobile", "tablet"];

    payload.display_conditions["countries"] = undefined;
    payload.display_conditions["regions"] = undefined;
    payload.display_conditions["pages"] = ["all"];

    payload.display_conditions["cs-roles"] = [];

    payload.display_conditions["recurring"] = {
      converted: {
        when: "always",
        delay: 1,
        unit: "d",
      },
      closed: {
        when: "always",
        delay: 1,
        unit: "d",
      },
    };

    payload.triggers["exit-intent"] = { checkbox: false };
    payload.triggers["after-inactivity"] = { checkbox: false, 0: undefined };
    payload.triggers["time-spent-on-page"] = {
      checkbox: false,
      0: undefined,
    };
    payload.triggers["time-spent-on-site"] = {
      checkbox: false,
      0: undefined,
    };
    payload.triggers["total-view-products"] = {
      checkbox: false,
      0: undefined,
    };
    payload.triggers["product-in-cart"] = {
      checkbox: 0,
      0: null,
    };
    payload.triggers["total-number-in-cart"] = {
      checkbox: false,
      0: undefined,
    };
    payload.triggers["on-click"] = {
      checkbox: false,
      0: "class",
      1: undefined,
    };
    payload.triggers["scroll-percent"] = {
      checkbox: false,
      0: undefined,
    };
    payload.triggers["scroll-to-element"] = {
      checkbox: false,
      0: "class",
      1: undefined,
    };
    payload.triggers["page-load"] = {
      checkbox: true,
      0: 3,
    };
    payload.triggers["page-views"] = {
      checkbox: false,
      0: undefined,
    };

    payload.triggers["new-returning"] = {
      checkbox: true,
      0: "all",
    };

    payload.triggers["x-sessions"] = {
      checkbox: false,
      0: undefined,
    };

    payload.triggers["specific-traffic-source"] = {
      checkbox: false,
      0: null,
      1: undefined,
    };
    payload.triggers["specific-utm"] = {
      checkbox: false,
    };

    payload.triggers["location"] = {
      checkbox: false,
      0: "",
      1: [],
      2: "browser",
    };

    return payload;
  }
});
