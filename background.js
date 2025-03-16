// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "fontScanner",
    title: "Font Mango",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "fontScanner") {
    try {
      const [response] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getFontDetails,
      });
      
      // Display results in console (or modify to show in popup)
      console.log("Font Details:", response.result);
      alert(JSON.stringify(response.result, null, 2));
    } catch (error) {
      console.error("Font scan failed:", error);
    }
  }
});

function getFontDetails() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;

  const element = selection.getRangeAt(0)
                  .commonAncestorContainer.parentElement;

  const style = window.getComputedStyle(element);
  
  return {
    fontFamily: style.fontFamily || null,
    fontSize: style.fontSize || null,
    fontWeight: style.fontWeight || null,
    lineHeight: style.lineHeight || null,
    letterSpacing: style.letterSpacing || null
  };
}
