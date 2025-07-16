const conditionalLoaderParser = require("../page-builder/bin/conditional-loader");


module.exports = function conditionalLoader(source) {
  const options = this.getOptions() || {};
  const callback = this.async(); // If you want to support async processing

  try {
    const result = conditionalLoaderParser(source, options);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
}