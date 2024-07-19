chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "startReading") {
    readText(request.text, request.voiceId, request.speed);
  }
});

function readText(text, voiceId, speed) {
  const sentences = text
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim() !== "");

  sentences.forEach((sentence, index) => {
    const payload = {
      mode: "openfont",
      sentences: [
        {
          type: "text",
          text: sentence.trim(),
          version: "0",
          voice_id: voiceId,
          options: {
            speed: speed,
          },
        },
      ],
    };

    if (index < sentences.length - 1) {
      payload.sentences.push({
        type: "duration",
        time: 0.2,
      });
    }

    fetch("http://61.250.94.154/tts", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
      })
      .catch((error) => console.error("Error:", error));
  });
}
