chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "readPage") {
    let text;
    if (request.mode === "selected") {
      text = window.getSelection().toString();
    } else {
      text = document.body.innerText;
    }
    chrome.runtime.sendMessage(
      {
        action: "startReading",
        text: text,
        voiceId: request.voiceId,
        speed: request.speed,
      },
      (response) => {
        if (response.status === "error") {
          console.error("TTS Error:", response.message);
        }
      }
    );
  }
  return true; // Will respond asynchronously
});
