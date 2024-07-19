let isLoggedIn = false;

const voiceOptions = [
  {
    id: "47487a3f8ff5ca6fa7840f912a49e868",
    description: "부드럽고 따뜻한 30대 여성 목소리",
  },
  { id: "uka", description: "성숙하고 자상한 40대 여성 목소리" },
  {
    id: "465c8efcfa99a9adb75333263faa6fde",
    description: "지적이고 또박또박한 40대 여성 목소리",
  },
  { id: "hg", description: "차분하고 친절한 30대 여성 목소리" },
  {
    id: "4488664c9dd3ba708e890205004c02e4",
    description: "지적이고 또박또박한 30대 남성 목소리",
  },
  {
    id: "4ab2aba432bebd5bac841009dde5a1ae",
    description: "부드럽고 차분한 30대 남성 목소리",
  },
  {
    id: "448ed1140cb9a309bb9723b4238c1648",
    description: "독특한 40대 남성 목소리",
  },
  {
    id: "41d26d93b9ae059384c6fd810cc5d30c",
    description: "귀여운 10대 남성 목소리",
  },
];

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const ttsControls = document.getElementById("ttsControls");
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");
  const readTextButton = document.getElementById("readText");
  const ttsSelect = document.getElementById("ttsSelect");

  // 저장된 로그인 상태 확인
  chrome.storage.local.get(["isLoggedIn", "selectedVoice"], function (result) {
    isLoggedIn = result.isLoggedIn || false;
    updateUIState();
    if (isLoggedIn) {
      populateTTSOptions(result.selectedVoice);
    }
  });

  loginButton.addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    // 여기에 실제 로그인 API 호출 로직을 구현해야 합니다
    console.log("로그인 시도:", username, password);
    // 임시로 로그인 성공으로 처리
    isLoggedIn = true;
    chrome.storage.local.set({ isLoggedIn: true });
    updateUIState();
    populateTTSOptions();
  });

  logoutButton.addEventListener("click", function () {
    isLoggedIn = false;
    chrome.storage.local.set({ isLoggedIn: false, selectedVoice: null });
    updateUIState();
  });

  readTextButton.addEventListener("click", function () {
    const selectedVoice = ttsSelect.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "readSelectedText",
        voiceId: selectedVoice,
      });
    });
  });

  ttsSelect.addEventListener("change", function () {
    chrome.storage.local.set({ selectedVoice: ttsSelect.value });
  });

  function updateUIState() {
    loginForm.style.display = isLoggedIn ? "none" : "block";
    ttsControls.style.display = isLoggedIn ? "block" : "none";
  }

  function populateTTSOptions(selectedVoice) {
    ttsSelect.innerHTML = "";
    voiceOptions.forEach(function (option) {
      const optionElement = document.createElement("option");
      optionElement.value = option.id;
      optionElement.textContent = option.description;
      if (option.id === selectedVoice) {
        optionElement.selected = true;
      }
      ttsSelect.appendChild(optionElement);
    });
  }
});
