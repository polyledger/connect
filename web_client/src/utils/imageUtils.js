/**
 * Returns the image from the assets folder.
 * @param {string} resource - The resource type, e.g. "coins" or "exchanges"
 * @param {string} name - The name of the image file
 * @param {string} extension - The image file extension
 */
function getImageSource(resource, name, extension = "svg") {
  if (resource === "coins") {
    try {
      return require(`../assets/coins/${name}.svg`);
    } catch (error) {
      try {
        return require(`../assets/coins/${name}.png`);
      } catch (error) {
        return require(`../assets/default.png`);
      }
    }
  } else if (resource === "exchanges") {
    return require(`../assets/exchanges/${name}.${extension}`);
  }
}

export default getImageSource;
