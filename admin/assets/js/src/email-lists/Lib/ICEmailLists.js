import { SnackBarAlert } from "../../snack-bar-alert";
import { ICModal } from "./ICModal";
const $ = jQuery;
const ajaxURL = cs_promo_settings.ajax_url;

const getProviderLists = (provider) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: ajaxURL,
      data: {
        action: "iconvertpr_email_lists_provider_lists",
        provider: provider,
      },
    })
      .then((response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const bindProvider = async (
  shadow,
  { provider: initialProvider, list: initialList } = {}
) => {
  const providerEl = shadow.querySelector('select[name="provider"]');
  const providerListEl = shadow.querySelector('select[name="provider_list"]');

  const fillProviderLists = async (provider, select = "") => {
    const $field = $(providerListEl.closest(".icp-field"));

    if (!provider) {
      $field.hide();
      providerListEl.removeAttribute("required");
      return;
    }

    providerListEl.setAttribute("required", "required");

    $field.show();

    $field.removeClass("loaded");

    const lists = await getProviderLists(provider);
    // console.log(lists);

    if (providerListEl) {
      // remove non default options
      const defaultOption = providerListEl.querySelector('option[value=""]');
      providerListEl.innerHTML = "";
      providerListEl.appendChild(defaultOption);
      lists.forEach((list) => {
        const option = document.createElement("option");
        option.value = list.id;
        option.text = list.name;
        providerListEl.appendChild(option);
      });

      providerListEl.value = select;
    }

    $field.addClass("loaded");
  };

  if (providerEl) {
    providerEl.value = initialProvider || "";

    providerEl.addEventListener("change", (event) => {
      fillProviderLists(event.target.value);
    });

    if (providerListEl) {
      await fillProviderLists(providerEl.value, initialList || "");
    }
  }
};

export const ICEmailLists = (() => {
  const setup = () => {
    const listElement = document.querySelector("#ic-listid");
    const __nonce = document.querySelector("#_wpnonce")?.value;
    let listID = 0;

    if (listElement) {
      listID = listElement?.value;
    }

    const listItemActive = document.querySelector(".list-item-active");
    if (listItemActive) {
      listItemActive.scrollIntoView();
    }

    deleteList(listID, __nonce);
    createList(__nonce);
    editList(listID, __nonce);
    syncList(listID, __nonce);
  };

  const toggleSubjectField = (elm) => {
    const template = elm.querySelector('select[name="templateID"]');
    const subject = elm.querySelector(".iwpa-subject");

    if (!template) {
      return false;
    }

    if (template.selectedOptions[0].value == 0) {
      subject.style.display = "none";
    }

    template.addEventListener("change", (event) => {
      if (event.target.value == 0) {
        subject.style.display = "none";
      } else {
        subject.style.display = "block";
      }
    });
  };

  const deleteList = (listID, __nonce) => {
    const deleteButton = document.querySelector(".ic-delete-list");

    if (deleteButton) {
      const settings = {
        primary_button: "Delete",
        secondary_button: "Cancel",
        callback: () => {
          removeListFromDB(listID, __nonce);
        },
      };

      deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        ICModal.dialog(
          "Delete Confirmation",
          "<p>Are you sure you want to delete this email list?</p>",
          settings
        );
      });
    }
  };

  const editList = (listID, __nonce) => {
    const editButton = document.querySelector(".ic-edit-list");

    if (editButton) {
      editButton.addEventListener("click", (e) => {
        e.preventDefault();

        getListFromServer({
          action: "iconvertpr_email_lists_edit",
          post_id: listID,
          _wpnonce: __nonce,
        });
      });
    }
  };

  const syncList = (listID, __nonce) => {
    const syncButton = document.querySelector(".ic-sync-list");

    function callSync() {
      return new Promise((resolve, reject) => {
        $.post(
          cs_promo_settings.ajax_url,
          {
            action: "iconvertpr_email_lists_sync",
            list_id: listID,
            _wpnonce: __nonce,
          },
          (response) => {
            if (response && response.success) {
              resolve(response.data);
            } else {
              reject(response.data);
            }
          }
        );
      });
    }

    const updateModalMessage = (modal, message) => {
      modal.find(".ic-sync-modal-wrapper-message").text(message);
    };

    const rejectCallback = (data, modal) => {
      SnackBarAlert.alertMessage(data || "Unkown error", "error");

      if (modal) {
        const modalObj = modal.data()["bs.modal"];
        modal.modal("hide");
      }
    };

    const callSyncCallback = (data, modal) => {
      if (data.finished) {
        if (modal) {
          const modalObj = modal.data()["bs.modal"];
          modal.modal("hide");
        }
        SnackBarAlert.alertMessage("The list was synced!", "success");
        return;
      }

      if (!data.finished) {
        callSync()
          .then((data) => callSyncCallback(data, modal))
          .catch((data) => rejectCallback(data, modal));
        updateModalMessage(modal, data.message);
      }
    };

    if (syncButton) {
      syncButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if ($(syncButton).is('[data-provider="none"]')) {
          const settings = {
            primary_button: "Edit configuration",
            callback: () => {
              setTimeout(() => {
                getListFromServer({
                  action: "iconvertpr_email_lists_edit",
                  post_id: listID,
                  _wpnonce: __nonce,
                });
              }, 300);
            },
            size: "custom",
          };
          ICModal.dialog(
            "Sync Not Configured",
            "<p>To sync this list with an external service (like Mailchimp), you must first link it to a list from your chosen provider in the configuration.</p>",
            settings
          );

          return;
        }

        ICModal.indeterminateLoading("Sync List", "Syncing list...", {
          size: null,
          onShow: (ev) => {
            const modal = $(ev.delegateTarget);
            callSync()
              .then((data) => callSyncCallback(data, modal))
              .catch((data) => rejectCallback(data, modal));
          },
        });
      });
    }
  };

  const createList = (__nonce) => {
    const createButton = document.querySelector(".ic-create-email-list");
    const html = document.querySelector("#ic-lists-create")?.innerHTML;

    if (createButton) {
      createButton.addEventListener("click", (e) => {
        e.preventDefault();

        const settings = {
          size: "custom",
          primary_button: "Create list",
          secondary_button: "Cancel",
          callback: () => {
            return createListDB(__nonce);
          },
        };

        const shadow = document.createElement("div");

        shadow.insertAdjacentHTML("beforeend", html);
        bindProvider(shadow, {
          provider: "",
          list: "",
        });

        ICModal.dialog("Create new list", shadow, settings);

        toggleSubjectField(document);
      });
    }
  };

  const createListDB = (__nonce) => {
    const name = document.querySelector('input[name="name"]');
    const subject = document.querySelector('input[name="subject"]');
    const description = document.querySelector('textarea[name="description"]');
    const template = document.querySelector('select[name="templateID"]');
    const form = document.querySelector("#ic-create-list-form");

    const provider = document.querySelector('select[name="provider"]');
    const providerList = document.querySelector('select[name="provider_list"]');

    const providerValue = provider?.value;
    const providerListValue = !!providerValue ? providerList?.value : "";

    if (form.checkValidity()) {
      form.querySelectorAll(".is-invalid").forEach((el) => {
        el.classList.remove("is-invalid");
      });

      $.post(
        cs_promo_settings.ajax_url,
        {
          action: "iconvertpr_email_lists_create",
          name: name?.value,
          description: description?.value,
          subject: subject?.value,
          template: template ? template.selectedOptions[0].value : 0,
          provider: providerValue,
          provider_list: providerListValue,
          _wpnonce: __nonce,
        },
        (response) => {
          if (response && response.success) {
            window.location.href = response.data.body;
          } else {
            SnackBarAlert.alertMessage(
              "The email list was not created!",
              "error"
            );
            return false;
          }
        }
      );
    } else {
      form.querySelectorAll("[required]").forEach((el) => {
        if (!el.value) {
          el.classList.add("is-invalid");
        }
      });
      return false;
    }
  };

  const getListFromServer = (settings) => {
    $.ajax({
      type: "GET",
      url: ajaxURL,
      data: settings,
    }).then(async (response) => {
      if (response.success) {
        const html = document.querySelector("#ic-lists-create").innerHTML;
        const shadow = document.createElement("div");

        shadow.insertAdjacentHTML("beforeend", html);

        const name = shadow.querySelector('input[name="name"]');
        const description = shadow.querySelector(
          'textarea[name="description"]'
        );
        const template = shadow.querySelector('select[name="templateID"]');
        const subject = shadow.querySelector('input[name="subject"]');

        if (name) {
          name.value = response.data.body.name;
        }

        if (subject) {
          subject.value = response.data.body.subject;
        }

        if (description) {
          description.value = response.data.body.description;
        }

        if (template) {
          template.value = response.data.body.templateID;
        }

        showEditForm(shadow, settings.post_id, settings._wpnonce);

        bindProvider(shadow, {
          provider: response.data.body.provider || "",
          list: response.data.body.providerList || "",
        });
      }

      return false;
    });
  };

  const showEditForm = (content, id, __nonce) => {
    toggleSubjectField(content);
    const settings = {
      primary_button: "Save",
      secondary_button: "Cancel",
      callback: () => {
        return editListDB(id, __nonce);
      },
      size: "custom",
    };
    ICModal.dialog("Edit list", content, settings);
  };

  const editListDB = (id, __nonce) => {
    const name = document.querySelector('input[name="name"]');
    const subject = document.querySelector('input[name="subject"]');
    const description = document.querySelector('textarea[name="description"]');
    const form = document.querySelector("#ic-create-list-form");
    const template = document.querySelector('select[name="templateID"]');
    const provider = document.querySelector('select[name="provider"]');
    const providerList = document.querySelector('select[name="provider_list"]');

    const providerValue = provider?.value;
    const providerListValue = !!providerValue ? providerList?.value : "";

    if (form.checkValidity()) {
      form.querySelectorAll(".is-invalid").forEach((el) => {
        el.classList.remove("is-invalid");
      });

      $.post(
        ajaxURL,
        {
          action: "iconvertpr_email_lists_update",
          post_id: id,
          name: name.value,
          template: template ? template.selectedOptions[0].value : 0,
          description: description.value,
          subject: subject?.value,
          provider: providerValue,
          provider_list: providerListValue,
          _wpnonce: __nonce,
        },
        (response) => {
          if (response && response.success) {
            window.location.reload();
          } else {
            SnackBarAlert.alertMessage("The list was not updated!", "error");
            return false;
          }
        }
      );
    } else {
      // name.classList.add("is-invalid");
      form.querySelectorAll("[required]").forEach((el) => {
        if (!el.value) {
          el.classList.add("is-invalid");
        }
      });
      return false;
    }
  };

  const removeListFromDB = (listID, __nonce) => {
    $.post(
      cs_promo_settings.ajax_url,
      {
        action: "iconvertpr_email_lists_delete",
        post_id: listID,
        _wpnonce: __nonce,
      },
      (response) => {
        if (response && response.success) {
          window.location.reload();
        } else {
          if (typeof response.data.message !== "undefined") {
            SnackBarAlert.alertMessage(response.data.message, "error");
          } else {
            SnackBarAlert.alertMessage(
              "The email list was not deleted!",
              "error"
            );
          }
        }
      }
    );
  };

  return {
    setup,
  };
})();
