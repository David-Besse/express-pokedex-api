/**
 * Removes accents from the given string.
 *
 * @param {string} str - the input string with accents
 * @return {string} the input string without accents
 */
const strNoAccent = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

module.exports = {
  strNoAccent,
};
