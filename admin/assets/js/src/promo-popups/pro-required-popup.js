jQuery(function ($) {
  const url = new URL(window.location.href);

  const allowedRoutes = [
    "promo.edit",
    "promo.create",
    "subscribers.lists.emails",
  ];

  const allowedPages = ["promoter-integrations","promoter-subscribers"];

  const route = url.searchParams.get("route");
  const page = url.searchParams.get("page");

  const isPageAllowed = allowedPages.some((allowedPage) => {
    return page && page.includes(allowedPage);
  });

  const isRouteAllowed = allowedRoutes.some((allowedRoute) => {
    return route && route.includes(allowedRoute);
  });

  if (!isPageAllowed && !isRouteAllowed) {
    return;
  }

  const template = /*html*/ `
    <div class="popover" role="tooltip">
      <h3 class="popover-header"></h3>
      <div class="popover-body"></div>
    </div>
  `;

  const content =
    document.querySelector("#icp-promo-available-in-pro-template")?.innerHTML ||
    "";

  if (!content) {
    return;
  }

  const proPopoverSelectors = [
    `[data-pro=required]:not([data-pro-template])`,
    `[ic-promo-integration-field]`,
  ].join(",");

  $(proPopoverSelectors).not("a").attr("disabled", true);

  let activePopover = null;

  $(document).on(
    "click ic-promo-display-pro-message",
    proPopoverSelectors,
    function (e) {
      const $this = $(this);

      const placement = $this.data("placement") || "top";
      const offset = $this.data("offset") || 0;
      const selfBoundary = $this.data("self-boundary");
      const $content = $(content);
      const text =
        $this.data("pro-text") ||
        $content.find("[data-text]").attr("data-text");

      $content.find("[data-text]").html(text);

      const props = {
        content: $content,
        html: true,
        placement,
        template,
        trigger: "click",
        offset:[0, offset],
      };

      if (selfBoundary) {
        props.container = this;
      }

      $this.popover(props);

      $this.on("shown.bs.popover", function () {
        jQuery(".popover.show").css("z-index", 100000);
      });

      if (activePopover) {
        activePopover.popover("hide");
      }

      $this.popover("show");
      activePopover = $(this);
    }
  );

  $(document).on("click", function (e) {
    if (activePopover) {
      // is inside the popover
      if (e.target.closest(".popover")) {
        return;
      }

      // is the popover trigger
      if (e.target.closest(proPopoverSelectors)) {
        return;
      }

      activePopover.popover("hide");
    }
  });
});
