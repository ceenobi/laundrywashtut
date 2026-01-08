// Safe localStorage utilities that handle SecurityError when storage is blocked

/**
 * Safely get an item from localStorage
 * @param {string} key - The key to retrieve
 * @returns {string|null} - The value or null if unavailable
 */
export const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    // SecurityError or other errors when localStorage is blocked
    if (import.meta.env.DEV) {
      console.warn(`localStorage access denied for key "${key}":`, error.message);
    }
    return null;
  }
};

/**
 * Safely set an item in localStorage
 * @param {string} key - The key to set
 * @param {string} value - The value to store
 * @returns {boolean} - True if successful, false otherwise
 */
export const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    // SecurityError or other errors when localStorage is blocked
    if (import.meta.env.DEV) {
      console.warn(`localStorage access denied for key "${key}":`, error.message);
    }
    return false;
  }
};

/**
 * Safely remove an item from localStorage
 * @param {string} key - The key to remove
 * @returns {boolean} - True if successful, false otherwise
 */
export const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`localStorage access denied for key "${key}":`, error.message);
    }
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} - True if localStorage is accessible
 */
export const isStorageAvailable = () => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};
