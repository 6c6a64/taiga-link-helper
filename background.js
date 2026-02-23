chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openTabs") {
    message.links.forEach(url => {
      chrome.tabs.create({ url });
    });
  }
});

