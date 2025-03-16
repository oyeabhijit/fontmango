// popup.js
document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "showFontDetails") {
      const fontDetailsElement = document.getElementById("fontDetails");
      fontDetailsElement.innerText = JSON.stringify(request.fontDetails, null, 2);
    }
  });
});
