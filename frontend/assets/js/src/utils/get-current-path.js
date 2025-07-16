export const getCurrentPath = () => {
  const url = new URL(window.location);
  const urlParams = new URLSearchParams(url.search);
  const wpQueryVars = cs_promo_settings.query_vars_keys;

  let varsValue = new URLSearchParams();

  wpQueryVars.forEach((key) => {
    if (urlParams.has(key)) {
      varsValue.append(key, urlParams.get(key));
    }
  });

  const siteURL = new URL(cs_promo_settings.site_url);
  const siteURLPath = siteURL.pathname.replace(/\/$/, "");
  const currentPath = url.pathname.replace(/\/$/, "");

  const rel = currentPath.replace(siteURLPath, "") || "/";

  return `${rel}${varsValue.toString()}`;
};
