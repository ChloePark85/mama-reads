let currentAudio = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startReading") {
    stopCurrentAudio();
    readText(request.text, request.voiceId, request.speed)
      .then(() => sendResponse({ status: "success" }))
      .catch((error) =>
        sendResponse({ status: "error", message: error.toString() })
      );
    return true; // Will respond asynchronously
  } else if (request.action === "stopReading") {
    stopCurrentAudio();
    sendResponse({ status: "success" });
  }
});

function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

async function readText(text, voiceId, speed) {
  const sentences = text
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim() !== "");

  for (const sentence of sentences) {
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

    try {
      const response = await fetch("http://61.250.94.154/tts", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      if (!blob.type.startsWith("audio/")) {
        throw new Error("The response is not an audio file");
      }

      await new Promise((resolve, reject) => {
        currentAudio = new Audio(URL.createObjectURL(blob));
        currentAudio.onended = resolve;
        currentAudio.onerror = reject;
        currentAudio.play().catch(reject);
      });

      // Add a small pause between sentences
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error("Error in readText:", error);
      chrome.runtime.sendMessage({
        action: "ttsError",
        error: error.toString(),
      });
      throw error;
    }
  }
}
