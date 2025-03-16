const createSubMenu = (fontData) => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "mainMenu",
      title: "FontMango",
      contexts: ["selection"]
    });

    for (const [property, value] of Object.entries(fontData)) {
      chrome.contextMenus.create({
        parentId: "mainMenu",
        id: property,
        title: `${property}: ${value || 'Null'}`,
        contexts: ["selection"]
      });
    }
  });
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "mainMenu",
    title: "FontMango",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "mainMenu") {
    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getFontDetails
      });
      
      if (result.result) {
        createSubMenu(result.result);
      }
    } catch (error) {
      console.error("Font scan error:", error);
    }
  }
});

function getFontDetails() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;

  const range = selection.getRangeAt(0);
  const element = range.startContainer.parentElement;
  const style = window.getComputedStyle(element);

  // Track up DOM tree until we find explicit font-family
  let fontFamily = style.fontFamily;
  if (fontFamily === "serif" || fontFamily === "sans-serif") {
    let parent = element.parentElement;
    while (parent) {
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.fontFamily !== "serif" && 
          parentStyle.fontFamily !== "sans-serif") {
        fontFamily = parentStyle.fontFamily;
        break;
      }
      parent = parent.parentElement;
    }
  }

  return {
    "Font Family": fontFamily || 'Null',
    "Font Size": style.fontSize || 'Null',
    "Font Weight": style.fontWeight || 'Null',
    "Line Height": style.lineHeight || 'Null',
    "Letter Spacing": style.letterSpacing || 'Null'
  };
}
