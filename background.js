// background.js (updated)
const createSubMenu = (fontData) => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "mainMenu",
      title: "FontMango Scan",
      contexts: ["selection"]
    });

    Object.entries(fontData).forEach(([property, value]) => {
      chrome.contextMenus.create({
        parentId: "mainMenu",
        id: property,
        title: `${property}: ${value || 'Null'}`,
        contexts: ["selection"]
      });
    });
  });
};

function getFontDetails() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;

  // Get deepest node in selection
  const range = selection.getRangeAt(0);
  let node = range.startContainer;

  // Handle text nodes
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentElement;
  }

  // Find first element with explicit font declaration
  const findFontSource = (element) => {
    const style = window.getComputedStyle(element);
    if (!element || element === document.documentElement) return style;
    
    // Check for actual font declaration
    const hasFontFamily = style.fontFamily !== 'serif' && 
                         style.fontFamily !== 'sans-serif' &&
                         style.fontFamily !== 'monospace';
    
    return hasFontFamily ? style : findFontSource(element.parentElement);
  };

  const computedStyle = findFontSource(node);
  
  return {
    "Font Family": computedStyle.fontFamily.replace(/"/g, ''),
    "Font Size": computedStyle.fontSize,
    "Font Weight": computedStyle.fontWeight,
    "Line Height": computedStyle.lineHeight,
    "Letter Spacing": computedStyle.letterSpacing
  };
}
