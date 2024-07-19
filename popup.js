document.getElementById("readPage").addEventListener("click", function () {
  const voiceId = document.getElementById("voiceSelect").value;
  const speed = parseFloat(document.getElementById("speedControl").value);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "readPage",
      voiceId: voiceId,
      speed: speed,
    });
  });
});

document.getElementById("speedControl").addEventListener("input", function () {
  document.getElementById("speedValue").textContent = this.value;
});
