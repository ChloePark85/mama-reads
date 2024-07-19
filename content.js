chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "readPage") {
    let pageText = document.body.innerText;
    chrome.runtime.sendMessage({
      action: "startReading",
      text: pageText,
      voiceId: request.voiceId,
      speed: request.speed,
    });
  }
});
