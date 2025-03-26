export const defaultConfig = {
    baseUrl: 'https://playwright.dev',
    timeouts: {
      navigation: 30000,
      element: 5000,
      global: 60000
    },
    retries: 1,
    browsers: ['chromium']
  };