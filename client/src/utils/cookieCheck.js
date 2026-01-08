// Function to detect if cookies are blocked
export const detectCookiesBlocked = () => {
    try {
      // Try to set a test cookie
      const testCookieName = "cookieTest";
      const testCookieValue = "test" + Date.now();
      document.cookie = `${testCookieName}=${testCookieValue}; path=/; max-age=60`;
      
      // Try to read it back
      const cookies = document.cookie.split(";");
      const testCookie = cookies.find((cookie) =>
        cookie.trim().startsWith(`${testCookieName}=`)
      );
      
      // Clean up the test cookie
      document.cookie = `${testCookieName}=; path=/; max-age=0`;
      
      // If we can't find the cookie, it's likely blocked
      return !testCookie || !testCookie.includes(testCookieValue);
    } catch {
      // If there's an error, assume cookies are blocked
      return true;
    }
  };