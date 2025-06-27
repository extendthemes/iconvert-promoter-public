import { PromoAfterInactivity } from "../Triggers/PromoAfterInactivity";
import { PromoManuallyOpen } from "../Triggers/PromoManuallyOpen";
import { PromoOnClick } from "../Triggers/PromoOnClick";
import { PromoPageLoad } from "../Triggers/PromoPageLoad";
import { PromoPreview } from "../Triggers/PromoPreview";
import { PromoScrollPercent } from "../Triggers/PromoScrollPercent";
import { PromoScrollToElement } from "../Triggers/PromoScrollToElement";
import { LocalStorage } from "./LocalStorage";
import { PromoPopup } from "./PromoPopup";
import { PromoTriggers } from "./PromoTriggers";

const $ = jQuery;


export class PromoTriggerSetup {
  constructor(triggers, extraData) {
    this.cartEventActivate = false;
    this.triggers = triggers;
    this.extraData = extraData;
    this.addExtras();
    this.setup();
    this.cartDetails();
  }
  customEventCartDetails(cartDetails) {
    const event = new CustomEvent("icpPromoCartDetailsChanged", {
      detail: {
        countItemsCart: cartDetails?.count || 0,
        amountTotalCart: cartDetails?.total || 0,
        productsIdsCart: cartDetails?.productsIds || [],
      },
    });
    document.body.dispatchEvent(event);
  }

  loadCartDetails() {
    $.post(
      cs_promo_settings.ajax_url,
      {
        action: "iconvertpr_promo_get_cart_details",
        cart: "cart_details",
      },
      (response) => {
        if (response.success) {
          this.customEventCartDetails(response.data);
        }
      }
    );
  }

  addWCDomEvents() {
    $(document.body).on(
      "added_to_cart removed_from_cart updated_cart_totals wc_cart_button_updated",
      (e) => {
        this.loadCartDetails();
      }
    );
  }

  addWCEvents() {
    if (window.wp && window.wp.data) {
      const unsub = window.wp.data.subscribe(() => {
        const wcCartStore = window.wp.data.select("wc/store/cart");

        if (wcCartStore) {
          const cartItems = wcCartStore.getCartData().items;
          const cartTotals = wcCartStore?.getCartTotals();

          const total =
            parseInt(cartTotals.total_price, 10) /
            10 ** cartTotals.currency_minor_unit;

          const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

          const productsIds = cartItems.map((item) => item.id);

          this.customEventCartDetails({
            count,
            total,
            productsIds,
          });
        } else {
          unsub();
          this.addWCDomEvents();
        }
      });

      return;
    } else {
      this.addWCDomEvents();
    }
  }

  cartDetails() {
    this.cartEventActivate = true;
    if (this.extraData?.wc?.active) {
      this.addWCEvents();
      this.customEventCartDetails(this.extraData.wc.cart);
    }
  }

  addExtras() {
    if (this.extraData?.wc?.is_product) {
      LocalStorage.setProductPageViewed(this.extraData.page_id);
    }

    LocalStorage.increasePageViews();
  }

  setup() {
    Object.keys(this.triggers).forEach((popupID) => {
      PromoPopup.promoRemovePopupEvent(popupID);
      PromoTriggers.initPopup(popupID);

      Object.keys(this.triggers[popupID]).forEach((triggerName) => {
        this.addTrigger(popupID, triggerName);
      });
    });
  }

  addTrigger(popupID, triggerName) {
    popupID = popupID + "";
    // console.log('setup triggerName', this.triggers);
    switch (triggerName) {
      case PromoPreview.name:
        PromoPreview.setup(this.triggers[popupID][triggerName], popupID);
        break;

      case PromoOnClick.name:
        PromoOnClick.setup(this.triggers[popupID][triggerName], popupID);
        break;

      case PromoAfterInactivity.name:
        PromoAfterInactivity.setup(
          this.triggers[popupID][triggerName],
          popupID
        );
        break;

      case PromoPageLoad.name:
        PromoPageLoad.setup(
          this.triggers[popupID][triggerName],
          popupID,
          this.triggers[popupID]
        );
        break;

      case PromoManuallyOpen.name:
        PromoManuallyOpen.setup(this.triggers[popupID][triggerName], popupID);
        break;

      case PromoScrollPercent.name:
        PromoScrollPercent.setup(this.triggers[popupID][triggerName], popupID);
        break;

      case PromoScrollToElement.name:
        PromoScrollToElement.setup(
          this.triggers[popupID][triggerName],
          popupID
        );
        break;
    }
  }
}
