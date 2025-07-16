import { ICModal } from "../../email-lists/Lib/ICModal";
import { SnackBarAlert } from "../../snack-bar-alert";

jQuery(document).ready(function ($) {
  let newPromoTemplate = null;
  let templateItems = [];
  let displayProMarks = true;

  function createTemplateItemNode(item, _selected = false) {
    const { id, name, image: preview, is_pro, is_blank, settings } = item;

    const wrapperItem = document.createElement("div");
    wrapperItem.classList.add(
      "col-xl-4",
      "col-lg-6",
      "col-md-12",
      "col-sm-12",
      "col-xs-12",
      "box-item"
    );
    wrapperItem.setAttribute("data-category", item?.categories || "*");

    const itemTemplateNode = document.createElement("div");
    itemTemplateNode.classList.add("item", "d-flex", "flex-column");

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

    if (is_pro == 1 && displayProMarks) {
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

    itemTemplateNode.appendChild(inputHidden);
    itemTemplateNode.setAttribute("data-settings", item.settings);
    wrapperItem.appendChild(itemTemplateNode);

    if (_selected) {
      selectTemplateItem($(itemTemplateNode));
    }

    return wrapperItem;
  }

  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const selectTemplateItem = (item) => {
    const isPRO = item.closest("[data-pro-template]").length;
    item.closest(".templates").find(".item").removeClass("selected");

    if (isPRO) {
      item
        .closest(".modal-content")
        .find(".modal-footer .ic-promo-button-primary")
        .attr("data-pro", "required")
        .on("click", preventDefault)
        .attr(
          "data-pro-text",
          "The selected template is only available in PRO."
        )
        .trigger("ic-promo-display-pro-message");
    } else {
      item
        .closest(".modal-content")
        .find(".modal-footer .ic-promo-button-primary")
        .removeAttr("data-pro")
        .off("click", preventDefault);
    }

    const newPromoTemplateId = item.find(`[name="template-selected"]`).val();
    newPromoTemplate =
      templateItems.find((template) => template.id == newPromoTemplateId) ||
      null;
    item.addClass("selected");
  };

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

  const getTemplates = (
    templatesNode,
    templatesCategoriesNode,
    promoTypeVal
  ) => {
    $(templatesCategoriesNode).on("click", "button", function () {
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

    return new Promise((resolve, reject) => {
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
            const { categories, templates } = response.data;

            templateItems = templates;

            templates.forEach((item, index) => {
              templatesNode.append(createTemplateItemNode(item, index === 0));
            });

            templatesCategoriesNode
              .find("button:not([data-category='*'])")
              .remove();
            categories.forEach((category) => {
              templatesCategoriesNode.append(
                createTemplateCategoryNode(category)
              );
            });

            templatesCategoriesNode
              .closest(".in-progress")
              .removeClass("in-progress");
          }
        }
      );
    });
  };

  function changeTemplate(promoId, promoTypeVal) {
    newPromoTemplate = null;
    const $content = $(`
        <div class="iconvert-change-template-modal-wrapper">
            <div class="templates-categories in-progress">
              <span class="templates-cats-label">Category</span>
              <div class="templates-categories-list">
                <button data-category="*" class="ic-promo-button ic-promo-button-primary ic-promo-button-sm active">All</button>
              </div>
            </div>
            <div class="iconvert-change-template-wrapper-templates">
                    <div class="d-flex flex-wrap align-content-start templates">
                        <div class="templates-loader-spinner">
                            <div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>
                        </spinner>
                    </div>
			</div>
        </div>`);

    const templatesNode = $content.find(".templates");
    const templatesCategoriesNode = $content.find(".templates-categories-list");

    $content.on("click", ".templates .box-item .item", function () {
      selectTemplateItem($(this));
    });

    getTemplates(templatesNode, templatesCategoriesNode, promoTypeVal);

    let modal = null;

    function callAjaxAction() {
      let $notice = modal.find(".modal-notice");
      if (!$notice.length) {
        $notice = $('<div class="modal-notice"></div>');
        modal.find(".modal-footer").append($notice);
      }

      $notice.html(
        "<span class='spinner visible'></span><span>Changing template...</span>"
      );

      $.post(
        cs_promo_settings.ajax_url,
        {
          action: "iconvertpr_change_popup_template",
          post_id: promoId,
          template_id: newPromoTemplate.id,
          _wpnonce: $('input[name="_wpnonce_iconvertpr_change_popup_template"]').val(),
        },
        (response) => {
          if (response.success) {
            modal.modal("hide");
            SnackBarAlert.alertMessage(response.data.message, "success", {
              keepInfo: true,
            });
          } else {
            $notice.html(`<span class="text-danger">${response.data}</span>`);
          }
        }
      );
    }

    function showConfirmationMessage() {
      const confirmMessage = $(`<div class="ic-change-template-confirm-modal">
            <div class="modal-confirm-message">
               <div class="row">
                <div class="col col-auto">
                  <img src="${newPromoTemplate?.image}" alt="Image ${newPromoTemplate?.name}" class="template-preview" />
                </div>
                <div class="col d-flex flex-column justify-content-center">
                  <h6>Are you sure you want to change the template?</h6>
                  <p>This action will remove your current content and replace it with the new template.</p>
                </div>
            </div>
        </div>
      `);

      modal = ICModal.dialog("Change template", confirmMessage, {
        primary_button: "Change template",
        primary_className:
          "ic-promo-button ic-promo-button-sm ic-promo-button-danger",
        secondary_button: "Cancel",
        callback: () => {
          callAjaxAction();
          return false;
        },
        className: "ic-dialog ic-change-template-confirm-modal",
      });
    }

    modal = ICModal.dialog("Change Template", $content, {
      primary_button: "Use selected template",
      secondary_button: "Cancel",
      callback: (...args) => {
        setTimeout(() => {
          showConfirmationMessage();
        }, 500);
      },
      className: "ic-dialog ic-change-template-modal",
    });
  }

  $(".modal-change-template-popup").on("click", function () {
    displayProMarks = !!$(this).attr("data-template-pro-preview");
    changeTemplate($(this).data("id"), $(this).data("promo-type"));
  });
});
