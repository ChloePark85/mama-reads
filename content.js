function getSelectedText() {
  return window.getSelection().toString();
}

function playTTS(text, voiceId) {
  const tts_api_url = "http://61.250.94.154/tts";

  const payload = {
    mode: "openfont",
    sentences: [
      {
        type: "text",
        text: text,
        version: "0",
        voice_id: voiceId,
        options: {
          speed: 1,
        },
      },
      {
        type: "duration",
        time: 0.2,
      },
    ],
  };

  fetch(tts_api_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    })
    .catch((error) => {
      console.error("TTS API 호출 중 오류 발생:", error);
      alert("TTS 변환 중 오류가 발생했습니다.");
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "readSelectedText") {
    const selectedText = getSelectedText();
    if (selectedText) {
      playTTS(selectedText, request.voiceId);
    } else {
      alert("선택된 텍스트가 없습니다.");
    }
  }
});
