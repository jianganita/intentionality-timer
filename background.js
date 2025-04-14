const defaultSettings = {
  blockedUrls: [
    { url: "https://www.youtube.com/feed/subscriptions", name: "YouTube Subscriptions" }
  ],
  waitTime: 30 // in seconds
};

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get(['settings'], (result) => {
    if (!result.settings) {
      browser.storage.local.set({ settings: defaultSettings });
    }
  });
});

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.url.includes(browser.runtime.getURL("redirect.html"))) {
      return { cancel: false };
    }

    return browser.storage.local.get(['settings']).then((result) => {
      const settings = result.settings || defaultSettings;
      for (const blockedUrl of settings.blockedUrls) {
        if (details.url.startsWith(blockedUrl.url)) {
          const redirectUrl = browser.runtime.getURL(
            `redirect.html?target=${encodeURIComponent(details.url)}&name=${encodeURIComponent(blockedUrl.name)}&waitTime=${settings.waitTime}`
          );
          
          return { redirectUrl };
        }
      }
      
      return { cancel: false };
    });
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["blocking"]
);