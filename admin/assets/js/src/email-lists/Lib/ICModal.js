export const ICModal = (() => {
  const beforePopupClose = () => {
    cs_promo_settings.windowPopup.status = false;
  };

  const beforePopupShow = (modal) => {
    if (cs_promo_settings.windowPopup.status === false) {
      modal.modal("show");
    }
    cs_promo_settings.windowPopup.status = true;
  };

  const dialog = (title, message, settings) => {
    const {
      primary_button = "Save",
      primary_className = "ic-promo-button ic-promo-button-sm ic-promo-button-primary",
      secondary_button = "Cancel",
      secondary_className = "ic-promo-button ic-promo-button-sm  ic-promo-button-secondary",
      callback = () => {},
      secondary_callback = () => {},
      show = false,
      size = "custom",
      className = "ic-dialog",
      onShow = () => {
        beforePopupClose();
      },
      onEscape = () => {
        beforePopupClose();
      },
      onHide = () => {
        beforePopupClose();
      },
    } = settings;

    const modal = bootbox.dialog({
      title: title,
      message: message,
      onEscape: true,
      centerVertical: true,
      size,
      className,
      onHide,
      onShow,

      buttons: {
        submit: {
          label: primary_button,
          className: primary_className,
          callback: callback,
        },
        cancel: {
          label: secondary_button,
          className: secondary_className,
          callback: secondary_callback,
        },
      },
      show,
    });

    beforePopupShow(modal);

    return modal;
  };

  const confirmationDialog = (title, message, settings) => {
    const {
      primary_button = "Save",
      secondary_button = "Cancel",
      callback = () => {},
      secondary_callback = () => {},
      show = true,
      size = "small",
      className = "ic-dialog",
    } = settings;

    bootbox.dialog({
      title: title,
      message: message,
      onEscape: true,
      centerVertical: true,
      size,
      className,
      show,
      buttons: {
        delete: {
          label: primary_button,
          className: "ic-promo-button ic-promo-button-sm ic-promo-button-primary",
          callback: callback,
        },
        cancel: {
          label: secondary_button,
          className: "ic-promo-button ic-promo-button-sm  ic-promo-button-secondary",
          callback: secondary_callback,
        },
      },
    });

    if (!show) {
      modal.modal("show");
    }

    return modal;
  };

  const indeterminateLoading = (title, message, settings) => {
    const {
      show = true,
      size = "small",
      className = "ic-dialog ic-dialog-loading",
      onShow = () => {},
    } = settings;

    const modal = bootbox.dialog({
      title: title,
      message: `
            <div class="ic-sync-modal-wrapper">
              <div class="progress progress-bar-animated progress-bar-striped"></div>
              <p class="ic-sync-modal-wrapper-message">${message}</p>
            </div>
          `,
      onEscape: false,
      centerVertical: true,
      closeButton: false,
      size,
      className,
      show,
      buttons: {},
      onShow,
    });

    if (!show) {
      modal.modal("show");
    }

    return modal;
  };

  const previewModal = (title, message, settings) => {
    const {
      show = true,
      size = "large",
      className = "ic-dialog-preview",
    } = settings;

    const modal = bootbox.dialog({
      title: title,
      message: message,
      onEscape: true,
      centerVertical: true,
      size,
      className,
      show,
      buttons: {},
    });

    if (!show) {
      modal.modal("show");
    }

    return modal;
  };

  const info = (title, message, callback = () => {}) => {
    bootbox.dialog({
      title,
      message,
      onEscape: true,
      centerVertical: true,
      size: "custom",
      className: "ic-dialog",
      buttons: {
        ok: {
          label: "OK",
          className: "ic-promo-button ic-promo-button-sm ic-promo-button-primary",
          callback: callback,
        },
      },
    });

    return modal;
  };

  return {
    confirmationDialog,
    info,
    dialog,
    previewModal,
    beforePopupClose,
    indeterminateLoading,
  };
})();
