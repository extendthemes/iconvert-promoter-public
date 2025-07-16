import { SnackBarAlert } from "../snack-bar-alert";
import { eventIsFromUIUpdate } from "../utils";

jQuery(document).ready(function ($) {
  // prevent double click on form submit
  $(".icp-prevent-double-click").on("submit", function (e) {
    $(this).find('button[type="submit"]').attr("disabled", "disabled");
  });
  // set the temnplate
  $(".promo-select-template").on("click", function (e) {
    e.preventDefault();

    const elem = $(this);
    const payload = {
      action: "iconvertpr_promo_set_template",
      template: elem.data("template"),
      popup: elem.data("popup"),
      _wpnonce_set_template: $("#_wpnonce_set_template").val(),
    };

    $.post(cs_promo_settings.ajax_url, payload, (response) => {
      if (response.success) {
        // redirect
        window.location.href = $("#promoEditorUrl").val();
      }
    });
  });

  //activate/deactivate toggle
  $(".cs-switch.cs-toggle-status input").on("change", function (e) {
    const elem = $(this);
    const inputStatus = $(this).is(":checked") ? 1 : 0;
    const payload = {
      action: "iconvertpr_promo_status",
      post_id: $(this).data("id"),
      nonce: $(this).data("nonce"),
      status: inputStatus,
    };

    const checked = elem.is(":checked");
    const bulletStatus = $(this)
      .parent()
      .parent()
      .find('[data-icon="data-icon"]');
    const textStatus = $(this)
      .parent()
      .parent()
      .find('[data-label="data-label"]');

    const onChecked = () => {
      bulletStatus.removeClass("inactive");
      bulletStatus.addClass("active");
      textStatus.text("Active");
      $('[name="save-and-activate-popup"]').attr("hidden", true);
    };

    const onUnchecked = () => {
      bulletStatus.removeClass("active");
      bulletStatus.addClass("inactive");
      textStatus.text("Inactive");
      $('[name="save-and-activate-popup"]').removeAttr("hidden");
    };

    if (eventIsFromUIUpdate(e)) {
      if (checked) {
        onChecked();
      } else {
        onUnchecked();
      }
      return;
    }

    $.post(cs_promo_settings.ajax_url, payload, (response) => {
      if (!response.success) {
        elem.prop("checked", !checked);
      }
      if (response.success && checked) {
        onChecked();
      }
      if (response.success && !checked) {
        onUnchecked();
      }
    });
  });

  const countriesOptions = Object.keys(cs_promo_autocomplete.countries).map(
    (countryKey) => ({
      text: cs_promo_autocomplete.countries[countryKey],
      id: countryKey,
    })
  );

  // element selectors
  const generalTypeElement = $('select[name="select_type_promo"]');
  const selectCountriesElem = $('select[name="countries-autocomplete"]');
  const selectLocationService = $('select[name="location-service"]');

  const selectCitiesElem = $('select[name="cities-autocomplete"]');
  const prodSelectorElem = $('select[name="product_in_cart"]');
  const prodNotInCartSelectorElem = $('select[name="product_not_in_cart"]');
  const arrivingFromSourceElem = $(
    'select[name="select_arriving_from_source"]'
  );
  const scrollToElem = $('select[name="select_scroll_to_element"]');
  const containerValidationElem = $(".container-validation");

  const selectCitiesDropdown = selectCitiesElem.select2({
    data: {},
    width: "100%",
  });

  selectLocationService.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });

  if (selectCountriesElem && selectCountriesElem.length) {
    selectCountriesElem.select2({
      data: countriesOptions,
      width: "100%",
      // minimumResultsForSearch: Infinity,
    });
    const countriesSelected =
      selectCountriesElem.data("selected") &&
      selectCountriesElem.data("selected").split(",");
    selectCountriesElem.val(countriesSelected).trigger("change");

    selectCountriesElem.on("select2:open", function (e) {
      const select2Dropdown = jQuery(this).data()["select2"].$dropdown;
      setTimeout(() => {
        select2Dropdown.find("input[type='search']").focus();
      }, 100);
    });

    updateCitiesList(selectCountriesElem);

    if (selectCitiesElem && selectCitiesElem.length) {
      const citiesSelected =
        selectCitiesElem.data("selected") &&
        selectCitiesElem.data("selected").split(",");
      selectCitiesElem.val(citiesSelected).trigger("change");
    }

    selectCountriesElem.change(() => {
      updateCitiesList(selectCountriesElem);
    });
  }

  function updateCitiesList(selectCountriesElem) {
    const selectedCountry = selectCountriesElem.select2("data");
    if (selectedCountry[0].id) {
      const citiesList =
        cs_promo_autocomplete.cities[selectedCountry[0].id] || {};

      if (citiesList) {
        selectCitiesDropdown.val("").empty();

        Object.keys(citiesList).forEach((cityKey) => {
          const newOption = new Option(
            citiesList[cityKey],
            cityKey,
            false,
            false
          );
          // Append it to the select
          selectCitiesDropdown.append(newOption).trigger("change");
        });

        selectCitiesDropdown.attr("disabled", false);
      }
    } else {
      selectCitiesDropdown.attr("disabled", true);
      selectCitiesDropdown.val("").empty();
    }
  }

  if (prodSelectorElem.length) {
    prodSelectorElem.select2({
      ajax: {
        url: cs_promo_settings.ajax_url,
        data: function (params) {
          {
            return {
              search: params.term,
              action: "iconvertpr_products_search",
              _wpnonce_iconvertpr_product_search: $(
                'input[name="_wpnonce_iconvertpr_product_search"]'
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
        action: "iconvertpr_products_search",
        _wpnonce_iconvertpr_product_search: $(
          'input[name="_wpnonce_iconvertpr_product_search"]'
        ).val(),
        ids: prodSelectorElem.data("selected") || 0,
      },
    }).then(function (data) {
      data.data.posts.forEach((post) => {
        const option = new Option(post.post_title, post.ID, true, true);
        prodSelectorElem.append(option).trigger("change");
      });

      // manually trigger the `select2:select` event
      prodSelectorElem.trigger({
        type: "select2:select",
        params: {
          data: data,
        },
      });
    });
  }
  // end autocomplete products in cart

  // autocomplete products not in cart
  if (prodNotInCartSelectorElem.length) {
    prodNotInCartSelectorElem.select2({
      ajax: {
        url: cs_promo_settings.ajax_url,
        data: function (params) {
          {
            return {
              search: params.term,
              action: "iconvertpr_products_search",
              _wpnonce_iconvertpr_product_search: $(
                'input[name="_wpnonce_iconvertpr_product_search"]'
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
        action: "iconvertpr_products_search",
        _wpnonce_iconvertpr_product_search: $(
          'input[name="_wpnonce_iconvertpr_product_search"]'
        ).val(),
        ids: prodNotInCartSelectorElem.data("selected") || 0,
      },
    }).then(function (data) {
      data.data.posts.forEach((post) => {
        const option = new Option(post.post_title, post.ID, true, true);
        prodNotInCartSelectorElem.append(option).trigger("change");
      });

      // manually trigger the `select2:select` event
      prodNotInCartSelectorElem.trigger({
        type: "select2:select",
        params: {
          data: data,
        },
      });
    });
  }
  // end autocomplete products not in cart

  generalTypeElement.select2({
    width: "100%",
  }); // here

  generalTypeElement.on("select2:select", function (e) {
    if (e.params.data.id === "inline-promotion-bar") {
      $('[data-section="triggers"]').hide("slow");
    } else {
      $('[data-section="triggers"]').show("slow");
    }
  });

  $('[name="copy-shortcode"]').on("click", function (e) {
    e.preventDefault();
    const $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('[name="shortcode"]').val()).select();
    $('[name="shortcode"]').focus();
    $('[name="shortcode"]').select();

    document.execCommand("copy");
    $temp.remove();
    new SnackBar({
      message: "The shortcode was copied to your clipboard.",
      dismissible: true,
      status: "success",
    });
  });

  function showReferrerInputValue() {
    $(".box-referrer-value").css("display", "block");

    $(".box-referrer-value")
      .find('input[name="referrer_value"]')
      .removeAttr("disabled", true)
      .removeAttr("data-relation-disabled", true);
  }

  function hideReferrerInputValue() {
    $(".box-referrer-value").css("display", "none");

    $(".box-referrer-value")
      .find('input[name="referrer_value"]')
      .attr("data-relation-disabled", true)
      .attr("disabled", true);
  }

  if (arrivingFromSourceElem.val() === "referrer") {
    showReferrerInputValue();
  } else {
    hideReferrerInputValue();
  }

  arrivingFromSourceElem.on("change", function (e) {
    if ($(this).val() === "referrer") {
      showReferrerInputValue();
    } else {
      hideReferrerInputValue();
    }
  });

  arrivingFromSourceElem.select2({
    width: "100%",
  });

  scrollToElem.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });

  $('button[name="create-popup"]').on("click", function (e) {
    e.preventDefault();

    containerValidationElem.addClass("d-none");
    if (!formValidation()) {
      SnackBarAlert.alertMessage("Form invalid!", "error");
      containerValidationElem.removeClass("d-none");

      return;
    }
    const payload = getPayload();
    $.post(
      cs_promo_settings.ajax_url,
      {
        action: "iconvertpr_create_popup",
        payload: payload,
        _wpnonce: $('input[name="_wpnonce"]').val(),
      },
      (response) => {
        if (response.success) {
          SnackBarAlert.alertMessage(response.data.message, "success");

          const url = new URL(window.location.href);
          url.search = url.search
            .replace("settings.popup", "settings.popup.edit")
            .concat("&post_id=", response.data.post);
          window.location.href = url.toString();

          return;
        }
        SnackBarAlert.alertMessage(response.data, "error");
      }
    );
  });
});
