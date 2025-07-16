import { ICModal } from "./ICModal";
import { SnackBarAlert } from "../../snack-bar-alert";

export const ICSubscriber = (() => {
  const $ = jQuery;
  const ajaxURL = cs_promo_settings.ajax_url;

  const setup = () => {
    const listElement = document.querySelector("#ic-listid");
    const __nonce = document.querySelector("#_wpnonce")?.value;
    let listID = 0;

    if (listElement) {
      listID = listElement?.value;
    }

    deleteSubscriber(listID, __nonce);
    editSubscriber(listID, __nonce);
  };

  const editSubscriber = (listID, __nonce) => {
    const editButtons = document.querySelectorAll(".cs-el-edit");

    if (editButtons) {
      editButtons.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const id = item.dataset.id;

          getSubscriberFromServer({
            action: "iconvertpr_subscribers_edit",
            post_id: id,
            _wpnonce: __nonce,
          });
        });
      });
    }
  };

  const showEditSubscribeForm = (content, id, __nonce) => {
    const settings = {
      primary_button: "Save",
      secondary_button: "Cancel",
      callback: () => {
        return editSubscriberFromDB(id, __nonce);
      },
      size: "custom",
    };
    ICModal.dialog("Edit subscriber", content, settings);
  };

  const editSubscriberFromDB = (id, __nonce) => {
    const name = document.querySelector('input[name="name"]');
    const email = document.querySelector('input[name="email"]');
    const form = document.querySelector("#ic-create-list-form");

    if (form.checkValidity()) {
      email.classList.remove("is-invalid");

      $.post(
        ajaxURL,
        {
          action: "iconvertpr_subscribers_update",
          post_id: id,
          name: name.value,
          email: email.value,
          _wpnonce: __nonce,
        },
        (response) => {
          if (response && response.success) {
            window.location.reload();
          } else {
            SnackBarAlert.alertMessage(
              "The subscriber was not updated!",
              "error"
            );

            return false;
          }
        }
      );
    } else {
      email.classList.add("is-invalid");
      return false;
    }
  };

  const deleteSubscriber = (listID, __nonce) => {
    const deleteButtons = document.querySelectorAll(".cs-el-delete");

    if (deleteButtons) {
      deleteButtons.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const id = item.dataset.id;
          const settings = {
            primary_button: "Remove from this list",
            secondary_button: "Remove from all lists",
            callback: () => {
              const removeFromMarketingProviders = jQuery(
                `[name=remove_from_marketing_providers_lists]`
              ).prop("checked");
              removeFromDB(id, {
                where: "list",
                list_id: listID,
                _wpnonce: __nonce,
                include_marketing_providers: removeFromMarketingProviders,
              });
            },
            secondary_callback: () => {
              const removeFromMarketingProviders = jQuery(
                `[name=remove_from_marketing_providers_lists]`
              ).prop("checked");
              removeFromDB(id, {
                where: "all_lists",
                _wpnonce: __nonce,
                include_marketing_providers: removeFromMarketingProviders,
              });
            },
            size: "custom",
          };

          let removeFromMarketingTemplate =
            cs_promo_settings.has_providers_configured
              ? `<label class="align-items-center d-flex">
                <input type="checkbox" class="mb-0 mt-0" name="remove_from_marketing_providers_lists">
                <span class="flex-grow-1">Also remove from marketing associated provider(s) list(s)</span>
              </label>
            `
              : "";

          ICModal.dialog(
            "Remove email list item",
            `<p>From where do you want to remove the email list item?</p>` +
              removeFromMarketingTemplate,
            settings
          );
        });
      });
    }
  };

  const removeFromDB = (
    id,
    {
      where = "list",
      list_id = 0,
      _wpnonce = "",
      include_marketing_providers = false,
    } = {}
  ) => {
    $.post(
      ajaxURL,
      {
        action: "iconvertpr_subscribers_delete",
        post_id: id,
        list_id: list_id,
        where: where,
        _wpnonce: _wpnonce,
        include_marketing_providers: include_marketing_providers ? 1 : 0,
      },
      (response) => {
        if (response && response.success) {
          window.location.reload();
          return;
        } else {
          SnackBarAlert.alertMessage("The email was not deleted!", "error");
        }
      }
    );
  };

  const getSubscriberFromServer = (settings) => {
    $.ajax({
      type: "GET",
      url: ajaxURL,
      data: settings,
    }).then((response) => {
      if (response.success) {
        showEditSubscribeForm(
          response.data.body,
          settings.post_id,
          settings._wpnonce
        );
      }

      return false;
    });
  };

  return {
    setup,
  };
})();
