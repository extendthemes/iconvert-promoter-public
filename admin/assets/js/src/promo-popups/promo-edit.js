import { SnackBarAlert } from "../snack-bar-alert";
import {
  eventIsFromUIUpdate,
  triggerUIUpdateChange,
  updateUIValue,
} from "../utils";
import { FormValidator } from "./form-validator";
import { ICPromoTypesSettings } from "./ICPromoTypesSettings";
import "./promo-edit/change-template-modal";
import "./promo-edit/position-and-effect";
import "./promo-edit/preview-modal";

jQuery(document).ready(function ($) {
  const bodyElem = $("body");

  const promoEditFormElem = $("#promo-edit-form");
  const startTimeElem = $('input[name="when-start"]');
  const endTimeElem = $('input[name="when-end"]');
  const selectCountriesElem = $('select[name="countries-autocomplete"]');
  const selectLocationService = $('select[name="location-service"]');
  const selectCitiesElem = $('select[name="cities-autocomplete"]');
  const whichPageTypeElem = $('select[name="which-pages-type"]');
  const whichSpecificPagesElem = $('select[name="which-pages-autocomplete"]');
  const whichSpecificPostsElem = $('select[name="which-posts-autocomplete"]');
  const whichSpecificProductsElem = $(
    'select[name="which-products-autocomplete"]'
  );
  // const prodSelectorElem = $('select[name="product_in_cart"]');
  const selectItemsInCart = $('select[name="select_items_in_cart"]');
  const selectTotalAmountCart = $('select[name="select_total_amount_cart"]');
  const switchOnClickElem = $('input[name="switch_on_click"]');
  const selectOnClickElem = $('select[name="select_on_click"]');
  const valueOnClickElem = $('input[name="value_on_click"]');
  const selectProductInCart = $('select[name="select_product_in_cart"]');
  const valueProductInCart = $('select[name="product_in_cart"]');
  const selectProductNotInCart = $('select[name="select_product_not_in_cart"]');
  const valueProductNotInCart = $('select[name="product_not_in_cart"]');
  const arrivingFromSourceElem = $(
    'select[name="select_arriving_from_source"]'
  );
  const referrerValueElem = $('[name="referrer_value"]');
  const scrollToElem = $('select[name="select_scroll_to_element"]');
  const valueScrollToElem = $('input[name="value_on_scroll_element"]');
  const switchAfterInactivityElem = $('input[name="switch_after_inactivity"]');
  const valueAfterInactivityElem = $('input[name="after_inactivity"]');
  const switchOnPageLoadElem = $('input[name="switch_page_load"]');
  const valueOnPageLoadElem = $('input[name="page_load_seconds"]');

  // actions switches ( switch_on_click,switch_manually_open ) will turn off the pageload switch
  let actionSwitches = [
    "switch_on_click",
    "switch_manually_open",
    "switch_page_exit",
    "switch_scroll_percent",
    "switch_scroll_to_element",
  ];

  $(actionSwitches.map((item) => `input[name="${item}"]`).join(", ")).on(
    "change",
    function () {
      const elem = $(this);
      if (elem.is(":checked")) {
        $('input[name="switch_page_load"]').prop("checked", false);
        // $('input[name="page_load_seconds"]').val("");
        $('input[name="switch_page_load"]').trigger("change");
      }
    }
  );

  // Disable mouse middle click
  window.addEventListener("auxclick", (e) => {
    if (
      e.button === 1 &&
      e.target.classList.contains("js-disable-middle-click")
    ) {
      e.preventDefault();
    }
  });

  $(function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
  });

  const enforceMinMax = (e) => {
    const elem = e.currentTarget;
    if (elem.value !== "") {
      if (parseInt(elem.value) < parseInt(elem.min)) {
        elem.value = elem.min;
      }
      if (parseInt(elem.value) > parseInt(elem.max)) {
        elem.value = elem.max;
      }
    }
  };

  $(document).on("keyup", 'input[type="number"]', enforceMinMax);

  $('[data-row="recurring"]').each(function () {
    const elem = $(this);
    elem.find("select").select2({
      width: "100%",
      minimumResultsForSearch: Infinity,
    });

    const whenSelect = elem.find('select[ name="recurring-when"]');
    function onWhenSelectChange() {
      const value = whenSelect.val();

      const delayControlsElem = elem.find(
        '[data-name="recurring-after-time-section"]'
      );

      delayControlsElem.toggleClass("d-none", value !== "after");
    }

    whenSelect.on("select2:select", onWhenSelectChange);
    onWhenSelectChange();
  });

  const onNewReturningSelectChange = (e) => {
    const elem = $('[name="new-returning"]');

    if (elem.val() === "returning") {
      $('[data-row="sessions-number"]').removeClass("d-none");
    } else {
      $('[data-row="sessions-number"]').addClass("d-none");
    }

    $('[name="switch_after_sessions"]')
      .prop("checked", false)
      .trigger("change");
  };
  $('[name="new-returning"]').on("change", onNewReturningSelectChange);

  $('[name="new-returning"]').select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  onNewReturningSelectChange();

  $('.wrapper-display-condition-switch input[type="checkbox"]')
    .each((index, input) => {
      const elem = $(input);
      toggleSelectDisplayConditionInputValueDisabled(elem);
    })
    .on("change", function () {
      const elem = $(this);
      toggleSelectDisplayConditionInputValueDisabled(elem);
    });

  $('.wrapper-trigger-switch input[type="checkbox"]')
    .each((index, input) => {
      const elem = $(input);
      toggleSelectTriggerInputValueDisabled(elem);
    })
    .on("change", function () {
      const elem = $(this);
      toggleSelectTriggerInputValueDisabled(elem);
    });

  const saveButtons = $(
    'button[name="update-popup"],button[name="save-and-activate-popup"]'
  );

  const setSaveButtonsState = (state) => {
    switch (state) {
      case "loading":
        saveButtons.each(function () {
          const _button = $(this);

          _button.html(_button.data("loading"));
          _button.attr("disabled", true);
        });
        break;
      case "enabled":
        saveButtons.each(function () {
          const _button = $(this);
          _button.html(_button.data("save"));
          _button.removeAttr("disabled");
        });
        break;
      case "disabled":
        saveButtons.each(function () {
          const _button = $(this);
          _button.html(_button.data("save"));

          if (_button.is(`button[name="save-and-activate-popup"]`)) {
            _button.removeAttr("disabled");
            return;
          }
          _button.attr("disabled", true);
        });
        break;
    }
  };

  saveButtons.on("click", function (e) {
    e.preventDefault();
    const _button = $(this);
    const saveAndActivateURL = _button.data("save-activate-redirect");
    const isSaveAndActivate = _button.is(
      'button[name="save-and-activate-popup"]'
    );
    setSaveButtonsState("loading");
    if (
      !FormValidator.validateForm(promoEditFormElem, SnackBarAlert.alertMessage)
    ) {
      setTimeout(function () {
        setSaveButtonsState("enabled");
      }, 100);
      return;
    }

    const payload = getPayload();

    payload.settings = ICPromoTypesSettings.buildPromoTypeSettings();

    let reqBody = {
      action: "iconvertpr_update_popup",
      payload: payload,
      post_id: $('[name="post_id"]').val(),
      _wpnonce: $('input[name="_wpnonce"]').val(),
    };

    if (isSaveAndActivate) {
      reqBody.activate = 1;
    }

    $.post(cs_promo_settings.ajax_url, reqBody, (response) => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      if (response.success) {
        SnackBarAlert.alertMessage(response.data.message, "success", {
          keepInfo: true,
        });
        setSaveButtonsState("disabled");
        if (isSaveAndActivate) {
          updateUIValue(".cs-switch.cs-toggle-status input", true);
          if (saveAndActivateURL) {
            window.location.href = saveAndActivateURL;
          }
        }
        return;
      }
      SnackBarAlert.alertMessage(response.data, "error");
      _button.html(_button.data("save"));
    });
  });

  $('.icpm-wrapper input[type="number"]').on("input", function (e) {
    $(this).val($(this).val().replace(/\D/g, ""));
  });

  selectOnClickElem.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  selectItemsInCart.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  selectTotalAmountCart.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  whichPageTypeElem.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  selectProductInCart.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  selectProductNotInCart.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  const showHideSpecificPostType = (e, aWhichSpecificElem) => {
    let postTypes = "";

    switch (aWhichSpecificElem.attr("name")) {
      case "which-pages-autocomplete":
        postTypes = "pages";
        break;
      case "which-posts-autocomplete":
        postTypes = "posts";
        break;
      case "which-products-autocomplete":
        postTypes = "products";
        break;
    }

    const data = e.params.data;

    if (data && data.id === `specific_${postTypes}`) {
      $(`[data-target="specific-${postTypes}"]`).show();
      aWhichSpecificElem.prop("disabled", false);
    } else {
      $(`[data-target="specific-${postTypes}"]`).hide();
      aWhichSpecificElem.prop("disabled", true);
    }
  };

  whichPageTypeElem.on("select2:select", function (e) {
    showHideSpecificPostType(e, whichSpecificPagesElem);
    showHideSpecificPostType(e, whichSpecificPostsElem);
    showHideSpecificPostType(e, whichSpecificProductsElem);
  });

  const initSelect2Specific = (aWhichSpecificElem) => {
    if (!aWhichSpecificElem.length) {
      return;
    }

    let postType = "";

    switch (aWhichSpecificElem.attr("name")) {
      case "which-pages-autocomplete":
        postType = "page";
        break;
      case "which-posts-autocomplete":
        postType = "post";
        break;
      case "which-products-autocomplete":
        postType = "product";
        break;
    }

    aWhichSpecificElem.select2({
      ajax: {
        url: cs_promo_settings.ajax_url,
        data: function (params) {
          {
            return {
              search: params.term,
              post_type: postType,
              action: "iconvertpr_posts_search",
              _wpnonce_iconvertpr_search: $(
                'input[name="_wpnonce_iconvertpr_search"]'
              ).val(),
            };
          }
        },
        processResults: function (data) {
          // Transforms the top-level key of the response object from 'items' to 'results'
          const results = data.data.posts.map((post) => ({
            text: post.post_title,
            id: post.ID,
          }));

          return {
            results: results,
          };
        },
      },
      width: "100%",
    });

    $.ajax({
      type: "GET",
      url: cs_promo_settings.ajax_url,
      data: {
        post_type: postType,
        action: "iconvertpr_posts_search",
        _wpnonce_iconvertpr_search: $(
          'input[name="_wpnonce_iconvertpr_search"]'
        ).val(),
        ids: aWhichSpecificElem.data("selected") || 0,
      },
    }).then(function (data) {
      data.data.posts.forEach((post) => {
        const option = new Option(post.post_title, post.ID, true, true);
        aWhichSpecificElem.append(option);

        //.trigger("change");
      });

      triggerUIUpdateChange(aWhichSpecificElem);

      // manually trigger the `select2:select` event
      aWhichSpecificElem.trigger({
        type: "select2:select",
        params: {
          data: data,
        },
      });
    });
  };

  initSelect2Specific(whichSpecificPagesElem);
  initSelect2Specific(whichSpecificPostsElem);
  initSelect2Specific(whichSpecificProductsElem);

  $(".container-specific-device").on("click", function () {
    const inputElem = $(this).find("input");
    if (inputElem.is(":checked")) {
      inputElem.prop("checked", false);
      $(this).removeClass("active");
      return;
    }

    inputElem.prop("checked", true);
    $(this).addClass("active");
  });
  function toggleSelectTriggerInputValueDisabled(elem) {
    if (elem.is(":checked")) {
      elem
        .closest(".wrapper-trigger-switch")
        .parent()
        .find("select")
        .not("[data-relation-disabled]")
        .prop("disabled", false);
      elem
        .closest(".wrapper-trigger-switch")
        .parent()
        .find('input[type="text"], input[type="number"]')
        .not("[data-relation-disabled]")
        .prop("disabled", false);

      elem
        .closest(".wrapper-trigger-switch")
        .parent()
        .find(".wrapper-trigger-value")
        .show()
        .addClass("active");
    } else {
      elem
        .closest(".wrapper-trigger-switch")
        .parent()
        .find("select")
        .not("[data-relation-disabled]")
        .prop("disabled", true);
      elem
        .closest(".wrapper-trigger-switch")
        .parent()
        .find('input[type="text"], input[type="number"]')
        .not("[data-relation-disabled]")
        .prop("disabled", true);

      elem
        .closest(".wrapper-trigger-switch")
        .parent()
        .find(".wrapper-trigger-value")
        .hide()
        .removeClass("active");
    }
  }

  function toggleSelectDisplayConditionInputValueDisabled(elem) {
    if (elem.is(":checked")) {
      elem
        .closest(".wrapper-display-condition-switch")
        .parent()
        .find("select")
        .prop("disabled", false);
      elem
        .closest(".wrapper-display-condition-switch")
        .parent()
        .find('input[type="text"], input[type="number"]')
        .not("[data-relation-disabled]")
        .prop("disabled", false);

      elem
        .closest(".wrapper-display-condition-switch")
        .parent()
        .find(".wrapper-display-condition-value")
        .show()
        .addClass("active");
    } else {
      elem
        .closest(".wrapper-display-condition-switch")
        .parent()
        .find("select")
        .not("[data-relation-disabled]")
        .prop("disabled", true);
      elem
        .closest(".wrapper-display-condition-switch")
        .parent()
        .find('input[type="text"], input[type="number"]')
        .not("[data-relation-disabled]")
        .prop("disabled", true);

      elem
        .closest(".wrapper-display-condition-switch")
        .parent()
        .find(".wrapper-display-condition-value")
        .hide()
        .removeClass("active");
    }
  }

  const hideFroAllUsers = $('input[name="switch_hide_logged_users"]');
  function updateHideForAllUsers() {
    const isChecked = hideFroAllUsers.is(":checked");

    const userRoles = $('[data-checkbox-group="hide-user"]');

    userRoles.not(hideFroAllUsers).each(function () {
      const elem = $(this);
      if (isChecked) {
        $(this).prop("checked", false);
        elem.closest(".trigger.element").css("display", "none");
      } else {
        elem.closest(".trigger.element").css("display", "");
      }
    });
  }
  hideFroAllUsers.on("change", updateHideForAllUsers);
  updateHideForAllUsers();

  function getRecurringValueFor(type) {
    const elem = $(`[data-row="recurring"][data-recurring-type="${type}"]`);

    return {
      when: elem.find('select[name="recurring-when"]').val(),
      delay: elem.find('input[name="recurring-delay"]').val(),
      unit: elem.find('select[name="recurring-unit"]').val(),
    };
  }

  function getPayload() {
    const promoNameElem = $('input[name="promo-name"]');
    const payload = {
      triggers: {},
      display_conditions: {},
      general: {},
    };
    if (promoNameElem.val()) {
      payload.general.name = promoNameElem.val();
    }
    payload.display_conditions["start-time"] = {
      checkbox: $('input[name="switch_when_start"]').is(":checked"),
      0: startTimeElem.val(),
    };

    payload.display_conditions["end-time"] = {
      checkbox: $('input[name="switch_when_end"]').is(":checked"),
      0: endTimeElem.val(),
    };

    const devices = [];
    if ($('input[name="switch_device_desktop"]').is(":checked")) {
      devices.push("desktop");
    }
    if ($('input[name="switch_device_tablet"]').is(":checked")) {
      devices.push("tablet");
    }
    if ($('input[name="switch_device_mobile"]').is(":checked")) {
      devices.push("mobile");
    }
    payload.display_conditions["devices"] = devices;

    payload.triggers["location"] = {
      checkbox: $('input[name="switch_location"]').is(":checked"),
      0: selectCountriesElem.val(),
      1: selectCitiesElem.val(),
      2: selectLocationService.val(),
    };

    const specificId = {
      specific_pages: whichSpecificPagesElem.val(),
      specific_posts: whichSpecificPostsElem.val(),
      specific_products: whichSpecificProductsElem.val(),
    };

    payload.display_conditions["pages"] = {
      0: whichPageTypeElem.val(),
      1: specificId[whichPageTypeElem.val()],
    };

    const csHideRoles = [];

    const checkedItems = $('input[data-checkbox-group="hide-user"]:checked');
    if (checkedItems.length > 0) {
      checkedItems.each(function () {
        const role = $(this).val();
        csHideRoles.push(role);
      });
    }

    payload.display_conditions["cs-roles"] = csHideRoles;

    payload.display_conditions["recurring"] = {
      converted: getRecurringValueFor("converted"),
      closed: getRecurringValueFor("closed"),
    };

    payload.triggers["manually-open"] = {
      checkbox: $('input[name="switch_manually_open"]').is(":checked"),
    };

    payload.triggers["exit-intent"] = {
      checkbox: $('input[name="switch_page_exit"]').is(":checked"),
    };
    payload.triggers["after-inactivity"] = {
      checkbox: switchAfterInactivityElem.is(":checked"),
      0: valueAfterInactivityElem.val(),
    };
    payload.triggers["time-spent-on-page"] = {
      checkbox: $('input[name="switch_time_spend_single_page"]').is(":checked"),
      0: $('input[name="time_spend_single_page"]').val(),
    };
    payload.triggers["time-spent-on-site"] = {
      checkbox: $('input[name="switch_time_spend_on_site"]').is(":checked"),
      0: $('input[name="time_spend_on_site"]').val(),
    };
    payload.triggers["total-view-products"] = {
      checkbox: $('input[name="switch_total_view_products"]').is(":checked"),
      0: $('input[name="total_view_products"]').val(),
    };
    payload.triggers["product-in-cart"] = {
      checkbox: $('input[name="switch_product_in_cart"]').is(":checked"),
      0: selectProductInCart.val(),
      1: valueProductInCart.val(),
    };
    payload.triggers["product-not-in-cart"] = {
      checkbox: $('input[name="switch_product_not_in_cart"]').is(":checked"),
      0: selectProductNotInCart.val(),
      1: valueProductNotInCart.val(),
    };
    payload.triggers["total-number-in-cart"] = {
      checkbox: $('input[name="switch_total_number_in_cart"]').is(":checked"),
      0: selectItemsInCart.val(),
      1: $('input[name="total_number_in_cart"]').val(),
    };
    payload.triggers["total-amount-cart"] = {
      checkbox: $('input[name="switch_total_amount_cart"]').is(":checked"),
      0: selectTotalAmountCart.val(),
      1: $('input[name="total_amount_cart"]').val(),
    };
    payload.triggers["on-click"] = {
      checkbox: switchOnClickElem.is(":checked"),
      0: selectOnClickElem.val(),
      1: valueOnClickElem.val(),
    };
    payload.triggers["scroll-percent"] = {
      checkbox: $('input[name="switch_scroll_percent"]').is(":checked"),
      0: $('input[name="scroll_percent"]').val(),
    };
    payload.triggers["scroll-to-element"] = {
      checkbox: $('input[name="switch_scroll_to_element"]').is(":checked"),
      0: scrollToElem.val(),
      1: valueScrollToElem.val(),
    };
    payload.triggers["page-load"] = {
      checkbox: switchOnPageLoadElem.is(":checked"),
      0: valueOnPageLoadElem.val(),
    };
    payload.triggers["same-page-views"] = {
      checkbox: $('input[name="switch_same_page_views"]').is(":checked"),
      0: $('input[name="same_page_views"]').val(),
    };
    payload.triggers["page-views"] = {
      checkbox: $('input[name="switch_page_views"]').is(":checked"),
      0: $('input[name="page_views"]').val(),
    };

    payload.triggers["new-returning"] = {
      checkbox: true,
      0: $('select[name="new-returning"]').val(),
    };

    payload.triggers["x-sessions"] = {
      checkbox: $('input[name="switch_after_sessions"]').is(":checked"),
      0: $('input[name="after_sessions"]').val(),
    };
    payload.triggers["x-products"] = {
      checkbox: $('input[name="switch_after_products"]').is(":checked"),
      0: $('input[name="after_products"]').val(),
    };

    payload.display_conditions["specific-traffic-source"] = {
      checkbox: $('input[name="switch_arriving_from_source"]').is(":checked"),
      0: arrivingFromSourceElem.val(),
      1:
        arrivingFromSourceElem.val() === "referrer"
          ? referrerValueElem.val()
          : undefined,
    };
    payload.display_conditions["specific-utm"] = {
      checkbox: $('input[name="switch_arriving_from_utm"]').is(":checked"),
      0: $('input[name="arriving_from_utm_source"]').val(),
      1: $('input[name="arriving_from_utm_medium"]').val(),
      2: $('input[name="arriving_from_utm_campaign"]').val(),
      3: $('input[name="arriving_from_utm_term"]').val(),
      4: $('input[name="arriving_from_utm_content"]').val(),
    };

    return payload;
  }

  // prompt user about existing changes when navigating away from the page
  function onBeforeUnload(event) {
    event.preventDefault();
    event.returnValue = "";

    return false;
  }

  // remove the title attribute from the select2 dropdown
  $(".select2-selection__rendered").hover(function () {
    $(this).removeAttr("title");
  });

  $("body").on(
    "change keypress",
    "#promo-edit-form :input:not([readonly])",
    function (e) {
      if (eventIsFromUIUpdate(e)) {
        return;
      }

      if (e.target.closest(".cs-list-popup-switch")) {
        return;
      }

      setSaveButtonsState("enabled");
      window.addEventListener("beforeunload", onBeforeUnload);
    }
  );

  $(".icp-integer-only").on("change", (e) => {
    const elem = $(e.currentTarget);
    elem.val(Math.abs(parseInt(Math.ceil(elem.val()))));
  });

  function initToggleCounter() {
    var countActiveSelector = $(".js-count-active");

    $.each(countActiveSelector, function () {
      countActiveToggles($(this));
    });
  }

  function countActiveToggles(aSelector) {
    var activeToggles = aSelector
      .parents(".accordion")
      .find(".switch-input:checked");
    var activeFields = aSelector.parents(".accordion").find(".js-active-field");
    var countActiveToggles = activeToggles.length;

    const isEmpty = (fieldVal) => {
      if (typeof fieldVal === "object") {
        return fieldVal.length === 0;
      } else if (typeof fieldVal === "string") {
        return !fieldVal.trim().length;
      } else {
        return false;
      }
    };

    $.each(activeFields, function () {
      if (!isEmpty($(this).val())) {
        countActiveToggles++;
      }
    });

    if (countActiveToggles > 0) {
      aSelector.html(`${countActiveToggles}&nbsp;active`);
      showToggleCounter(aSelector);
    } else {
      aSelector.html("");
      hideToggleCounter(aSelector);
    }
  }

  function showToggleCounter(aSelector) {
    if (aSelector.hasClass("hidden")) {
      aSelector.removeClass("hidden");
    }
  }

  function hideToggleCounter(aSelector) {
    if (!aSelector.hasClass("hidden")) {
      aSelector.addClass("hidden");
    }
  }

  initToggleCounter();

  $(function () {
    $(".switch-input, .js-active-field").change(function () {
      var countActiveSelector = $(this)
        .parents(".accordion")
        .find(".js-count-active");
      countActiveToggles(countActiveSelector);
    });
  });
});
