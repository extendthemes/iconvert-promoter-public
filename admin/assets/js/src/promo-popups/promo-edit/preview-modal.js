import { ICModal } from "../../email-lists/Lib/ICModal";
import { ICPromoTypesSettings } from "../ICPromoTypesSettings";

jQuery(document).ready(function ($) {
  $(".modal-preview-popup").on("click", function (e) {
    e.preventDefault();

    let deviceIsMobile = window.innerWidth < 1024;

    const url = new URL($(this).data("href"));

    url.searchParams.append(
      "settings",
      JSON.stringify(ICPromoTypesSettings.buildPromoTypeSettings())
    );

    if (deviceIsMobile) {
      window.open(url, "_blank").focus();
      return;
    }
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    iframe.style.width = "100%";
    iframe.style.height = "100%";

    const settings = {
      size: "large",
      primary_button: "x",
      secondary_button: "Cancel",
      callback: () => {},
    };

    const label = $(this)
      .closest(".table-row")
      .find('[data-col-group="name"]')
      .text();

    ICModal.previewModal(
      label ? `Previewing - ${label}` : "Preview",
      iframe,
      settings
    );
  });
});
