import { ICModal } from "../email-lists/Lib/ICModal";
import { SnackBarAlert } from "../snack-bar-alert";

jQuery(function ($) {
  let deviceIsMobile = window.innerWidth < 1024;
  if (deviceIsMobile) {
    $('[data-col-type="customize"] a').addClass("disabled");
  }
  const elemStart = $('[name="when-start"]');
  const elemEnd = $('[name="when-end"]');

  elemStart
    .closest(".input-group.group-append")
    .find("i")
    .on("click", () => {
      elemStart.datetimepicker("show");
    });
    
  elemEnd
    .closest(".input-group.group-append")
    .find("i")
    .on("click", () => {
      elemEnd.datetimepicker("show");
    });

  const timerOptions ={
    defaultTime: '00:00',
    minDate: [
      (new Date()).getFullYear(),
      (new Date()).getMonth() + 1,
      (new Date()).getDate(),
    ].join('/'),
    minYear: (new Date()).getFullYear(),
  }

  elemStart.datetimepicker({
    ...timerOptions,
    onShow: function (ct) {
      this.setOptions({
        maxDate: elemEnd.val() ? elemEnd.val() : false,
      });
    },
    format: "Y-m-d H:i",
  });

  elemEnd.datetimepicker({
    ...timerOptions,
    onShow: function (ct) {
      this.setOptions({
        minDate: elemStart.val() ? elemStart.val() : false,
      });
    },
    format: "Y-m-d H:i",
  });

  elemStart.on("keypress", function (e) {
    e.preventDefault();
  });

  elemEnd.on("keypress", function (e) {
    e.preventDefault();
  });

  $('a[data-scope="confirm-dialog"]').on("click", function (e) {
    const actionBtn = $(this);
    const confirmMessage = actionBtn.data("confirm-message");
    e.preventDefault();

    const postId = actionBtn.data("post-id");
    const wpNonce = actionBtn.data("wpnonce");
    const title = actionBtn.attr("title");
    const type = actionBtn.data("type");

    let action = "";
    let primaryButton = title;
    let confirmTitle = `${title} campaign`;
    let promoType = actionBtn.data("promo-type");

    let postParams = {
      action: action,
      post_id: postId,
      _wpnonce: wpNonce,
    };

    let settingExtraParams = {};

    switch (type) {
      case "delete":
        postParams.action = "iconvertpr_delete_campaign";
        break;
      case "duplicate":
        postParams.action = "iconvertpr_duplicate_campaign";
        settingExtraParams.className = "ic-dialog js-duplicate-dialog";
        break;
      case "reset-stats":
        postParams.action = "iconvertpr_reset_stats_campaign";
        break;
      default:
        break;
    }

    const settings = {
      primary_button: primaryButton,
      secondary_button: "Cancel",
      ...settingExtraParams,
      callback: () => {
        if (title === "Duplicate") {
          const campaignName = $('input[name="duplicate-campaign-name"]').val();
          postParams.campaign_name = campaignName;
          if ($('select[name="duplicate-as"]').length) {
            postParams.duplicate_as = $('select[name="duplicate-as"]').val();
          }
        }

        $.post(cs_promo_settings.ajax_url, postParams, (response) => {
          if (response.success) {
            SnackBarAlert.alertMessage(response.data.message, "success");
            window.location.href = response.data.url_redirect;
            return;
          }
          SnackBarAlert.alertMessage(response.data, "error");
        });
      },
      onShow: () => {
        ICModal.beforePopupClose();
        $(".js-duplicate-dialog .button-primary").attr("disabled", true);
        $(".js-duplicate-dialog [name='duplicate-as']").val(promoType || "");
      },
    };

    ICModal.dialog(confirmTitle, confirmMessage, settings);
  });

  const toggleDuplicateBtn = (e) => {
    const elem = e.currentTarget;
    const duplicateBtn = $(elem)
      .parents(".js-duplicate-dialog")
      .find(".button-primary");

    if (elem.value !== "") {
      duplicateBtn.attr("disabled", false);
    } else {
      duplicateBtn.attr("disabled", true);
    }
  };

  $(document).on(
    "keyup",
    '.js-duplicate-dialog input[name="duplicate-campaign-name"]',
    toggleDuplicateBtn
  );
  $(document).on(
    "keypress",
    '.js-duplicate-dialog input[name="duplicate-campaign-name"]',
    function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const elem = e.currentTarget;
        const duplicateBtn = $(elem)
          .parents(".js-duplicate-dialog")
          .find(".button-primary");
        duplicateBtn.click();
      }
    }
  );

  $(".cs-list-popup-switch .cs-active-slider").on("click", function (e) {
    const elem = $(this);
    if (elem.parent().find("input").prop("disabled")) {
      e.preventDefault();
      elem.tooltip({
        title: elem.parent().data("no-content"),
      });
      elem.tooltip("show");
    }
  });
  $('[data-col-type="customize"] a').on("click", function (e) {
    if (deviceIsMobile) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
});
