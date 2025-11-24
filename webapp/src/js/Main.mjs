/**
 * Generates a random ID of specified length
 * @param {number} length - Length of the ID (default: 8)
 * @returns {string} Random ID
 */
function generateRandomId (length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export { generateRandomId };
