document.addEventListener("DOMContentLoaded", function () {
  const speedControl = document.getElementById("speedControl");
  const speedValue = document.getElementById("speedValue");
  const readPageButton = document.getElementById("readPageButton");
  const readSelectedButton = document.getElementById("readSelectedButton");
  const stopButton = document.getElementById("stopButton");
  const voiceSelect = document.getElementById("voiceSelect");
  const errorMessage = document.getElementById("errorMessage");

  speedControl.addEventListener("input", function () {
    speedValue.textContent = this.value;
  });

  function startReading(mode) {
    const voiceId = voiceSelect.value;
    const speed = parseFloat(speedControl.value);
    errorMessage.textContent = ""; // Clear previous error messages
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "readPage",
        mode: mode,
        voiceId: voiceId,
        speed: speed,
      });
    });
  }

  readPageButton.addEventListener("click", () => startReading("full"));
  readSelectedButton.addEventListener("click", () => startReading("selected"));

  stopButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "stopReading" });
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "ttsError") {
      errorMessage.textContent = request.error;
    }
  });
});
