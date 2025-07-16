export const FormValidator = (() => {
  const $ = jQuery;
  let validateFields = [
    '[name="promo-name"]',
    ".wrapper-trigger-value.active input[required]:not(:disabled)",
    ".wrapper-trigger-value.active select.select2-dropdown[required]:not(:disabled)",
    ".wrapper-display-condition-value select.select2-dropdown[required]:not(:disabled)",
  ].join(",");

  let validateFieldsAtLeastOne = [
    ".validate-at-least-one .wrapper-trigger-value.active input:not(:disabled)",
    ".validate-at-least-one .wrapper-trigger-value.active select.select2-dropdown:not(:disabled)",
    ".validate-at-least-one .wrapper-display-condition-value select.select2-dropdown:not(:disabled)",
    ".validate-at-least-one .container-specific-device input:not(:disabled)",
  ].join(",");

  const isEmpty = (fieldVal) => {
    if (typeof fieldVal === "object") {
      return fieldVal.length === 0;
    } else if (typeof fieldVal === "string") {
      return !fieldVal.trim().length;
    } else {
      return false;
    }
  };
  const addValidationFailClass = (aField) => {
    if (aField.is("[name='promo-name']")) {
      aField.addClass("validation-fail");
    }

    aField.parents(".wrapper-trigger-value").addClass("validation-fail");
  };
  const removeValidationFailClass = (aField) => {
    if (aField.is("[name='promo-name']")) {
      aField.removeClass("validation-fail");
    }

    aField.parents(".wrapper-trigger-value").removeClass("validation-fail");
  };

  const validateForm = (ajQueryFormElem, callbackAlertMessage) => {
    let formValid = true;

    removeFormFieldErrors(ajQueryFormElem);

    const errorMessages = [];
    const formFields = ajQueryFormElem.find(validateFields);

    const validateField = (aField) => {
      if (isEmpty(aField.val())) {
        formValid = false;
        addValidationFailClass(aField);
        const fieldErrorMessage = aField.data("text-validation");

        if (
          typeof fieldErrorMessage !== "undefined" &&
          fieldErrorMessage.length > 0
        ) {
          errorMessages.push(fieldErrorMessage);
        } else {
          errorMessages.push(`${aField.attr("name")} is required.`);
        }
      } else if (aField.data("valid-selector")) {
        const selectorType = $(
          `[name="${aField.data("valid-selector")}"]`
        ).val();
        const selectorValue = aField.val();
        const fieldErrorMessage = aField.data("valid-selector-message");
        switch (selectorType) {
          case "class":
            // regex to validate a single class name, allow starting with dot
            const isSingleClassRegex = /^(\.?[_a-zA-Z]+[_a-zA-Z0-9-]*)$/;
            if (!selectorValue.match(isSingleClassRegex)) {
              formValid = false;
              addValidationFailClass(aField);

              if (fieldErrorMessage) {
                errorMessages.push(fieldErrorMessage);
              } else {
                errorMessages.push(
                  `${aField.attr("name")} must be a valid class name.`
                );
              }
            }
            break;
          case "id":
            // regex to validate a single id name, allow starting with hash
            const isSingleIdRegex = /^(\#?[_a-zA-Z]+[_a-zA-Z0-9-]*)$/;
            if (!selectorValue.match(isSingleIdRegex)) {
              formValid = false;
              addValidationFailClass(aField);

              if (fieldErrorMessage) {
                errorMessages.push(fieldErrorMessage);
              } else {
                errorMessages.push(
                  `${aField.attr("name")} must be a valid ID name.`
                );
              }
            }
            break;
          default:
            // check if selector is valid CSS selector
            try {
              document.querySelector(selectorValue);
            } catch (e) {
              formValid = false;
              addValidationFailClass(aField);

              if (fieldErrorMessage) {
                errorMessages.push(fieldErrorMessage);
              } else {
                errorMessages.push(
                  `${aField.attr("name")} must be a valid CSS selector.`
                );
              }
            }
        }
      } else {
        removeValidationFailClass(aField);
      }
    };

    formFields.each((i, thisElem) => {
      const fieldElem = $(thisElem);
      validateField(fieldElem);
    });

    const atLeastOne = new Map();

    ajQueryFormElem.find(validateFieldsAtLeastOne).each((_, field) => {
      const fieldElem = $(field);
      const group = fieldElem.closest(".validate-at-least-one");

      let groupUID = group.attr("data-uid");

      if (!groupUID) {
        groupUID = Math.random().toString(36).substring(2, 15);
        group.attr("data-uid", groupUID);
      }

      if (!atLeastOne.has(groupUID)) {
        atLeastOne.set(groupUID, {
          value: false,
          group: group,
        });
      }

      const prevValue = atLeastOne.get(groupUID);
      let fieldValue = fieldElem.val();

      if (fieldElem.is(":checkbox")) {
        fieldValue = fieldElem.is(":checked");
      }

      atLeastOne.set(groupUID, {
        value: prevValue.value || !!fieldValue,
        group: group,
      });
    });

    atLeastOne.forEach((data) => {
      const { group, value } = data;
      if (!value) {
        formValid = false;
        errorMessages.push(group.data("text-validation"));
      }
    });

    if (!formValid) {
      let errorText =
        "The form contains invalid values. Please correct them and try again!";
      if (errorMessages) {
        errorText += "<ul>";
        errorMessages.forEach(function (message) {
          errorText += `<li>${message}</li>`;
        });
        errorText += "</ul>";
      }
      callbackAlertMessage(errorText, "error", { timeout: false });
    } else {
      // after every validation is ok we check if at least one trigger is checked
      if (
        $(".optrix-at-least-one").length &&
        $(".optrix-at-least-one:checked").length === 0
      ) {
        $("#switch_page_load").attr("checked", true).trigger("click");
        // formValid = false;
      }
      $(".js-snackbar__close").trigger("click");
    }

    return formValid;
  };

  const removeFormFieldErrors = (ajQueryFormElem) => {
    ajQueryFormElem.find(".validation-fail").removeClass("validation-fail");
  };

  const revalidateFieldOnChange = (aField) => {
    if (isEmpty(aField.val())) {
      addValidationFailClass(aField);
    } else {
      removeValidationFailClass(aField);
    }
  };

  $(document).on("keydown, change", validateFields, function () {
    revalidateFieldOnChange($(this));
  });

  return {
    validateForm,
  };
})();
