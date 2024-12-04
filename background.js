browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openNewTab") {
    browser.tabs.create({ url: request.url, active: false });
  }
});
