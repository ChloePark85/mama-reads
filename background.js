chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "readText",
    title: "Read Text with TTS",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "readText" && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, { action: "readText", text: info.selectionText });
  }
});