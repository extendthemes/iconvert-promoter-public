import { SnackBarAlert } from "../snack-bar-alert";

function callEndpoint(endpoint, data = null, method = "GET") {
  endpoint = new URL(endpoint);
  endpoint.searchParams.append("noheader", "true");

  return new Promise((resolve, reject) => {
    jQuery.ajax({
      url: endpoint.toString(),
      method: method,
      data: data,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      },
      error: function (response) {
        reject(response.data);
      },
    });
  });
}

async function callFormEndpoint(form, extras = {}) {
  const endpoint = new URL(form.getAttribute("action"), window.location.origin);
  const method = (form.getAttribute("method") || "GET").toUpperCase();
  const formData = new FormData(form);

  Object.entries(extras).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return callEndpoint(endpoint, formData, method);
}

jQuery(function ($) {
  $(`[data-name="integration-form"]`).on("submit", async function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $form = $(this);

    try {
      const response = await callFormEndpoint(this);

      SnackBarAlert.alertMessage(response.message, "success");

      if (response.next_data) {
        Object.keys(response.next_data).forEach((key) => {
          $(this).find(`[name="fields[${key}]"]`).val(response.next_data[key]);
        });

        $form.find(`[data-action="test-connection"]`).removeAttr("disabled");
        $form.find(`[type=reset]`).removeAttr("disabled");
      }
    } catch (error) {
      SnackBarAlert.alertMessage(error[0].message, "error");
    }
  });

  $(`[data-name="integration-form"]`).on("reset", async function (e) {
    try {
      const response = await callFormEndpoint(this, { reset: true });

      const $form = $(this);

      SnackBarAlert.alertMessage(response.message, "success");

      if (response.next_data) {
        Object.keys(response.next_data).forEach((key) => {
          $form.find(`[name="fields[${key}]"]`).val(response.next_data[key]);
        });

        $form
          .find(`[data-action="test-connection"]`)
          .attr("disabled", "disabled");
        $form.find(`[type=reset]`).attr("disabled", "disabled");
      }
    } catch (error) {
      SnackBarAlert.alertMessage(error[0].message, "error");
    }
  });

  $(`[data-action="test-connection"]`).on("click", async function (e) {
    e.preventDefault();
    e.stopPropagation();

    const url = $(this).data("action-url");
    const $form = $(this).closest("form");

    try {
      $(this).addClass("spin");

      const response = await callEndpoint(url);

      $(this).removeClass("spin");

      SnackBarAlert.alertMessage(response.message, "success");
    } catch (error) {
      $(this).removeClass("spin");
      SnackBarAlert.alertMessage(error[0].message, "error");
    }
    $form.find(`[type=reset]`).removeAttr("disabled");
  });
});
