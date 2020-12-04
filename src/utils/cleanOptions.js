/**
 * Clean up customization options
 * @param {Array}  list    List of initial options supported by Fetch
 * @param {Object} options Customization Options
 * @return {Objtct}        Output Standard Options
 */
export default (list = [], options = {}) => {
  const optionsKeys = Object.keys(options);
  return list.reduce(
    (acc, cur) =>
      optionsKeys.includes(cur) ? { ...acc, [cur]: options[cur] } : acc,
    {}
  );
};
