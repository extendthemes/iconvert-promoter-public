import { ICPromoTypesSettings } from "../ICPromoTypesSettings";

jQuery(function ($) {
  const url = new URL(window.location.href);

  if (url.searchParams.get("route") !== "promo.edit") {
    return;
  }

  const promoTypeInput = $(this).find('input[name="promo-type"]');

  ICPromoTypesSettings.setOptionsVisible(promoTypeInput);
  ICPromoTypesSettings.setDefaultSettings(promoTypeInput.data().settings);
});
