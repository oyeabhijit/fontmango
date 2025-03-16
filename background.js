chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "fontScanner",
    title: "Scan Font Details",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "fontScanner") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scanFontDetails
    });
  }
});

function scanFontDetails() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const parentElement = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? range.commonAncestorContainer
    : range.commonAncestorContainer.parentElement;

  const computedStyle = window.getComputedStyle(parentElement);
  
  const fontDetails = {
    fontFamily: computedStyle.fontFamily || null,
    fontSize: computedStyle.fontSize || null,
    fontWeight: computedStyle.fontWeight || null,
    lineHeight: computedStyle.lineHeight || null,
    letterSpacing: computedStyle.letterSpacing || null
  };

  alert(JSON.stringify(fontDetails, null, 2));
}
