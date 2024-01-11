chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "findContext",
      title: "Find Context",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "findContext") {
      // Send a message to the content script
      chrome.tabs.sendMessage(tab.id, {
        action: "findContext",
        selectedText: info.selectionText
      });
    }
  });
  