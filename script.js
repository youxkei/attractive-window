chrome.tabs.onCreated.addListener((tab) => {
  if (tab.pinned) {
    return;
  }

  chrome.windows.getAll({ populate: true }, (windows) => {
    const distractiveWindows = windows.filter(
      (window) => window.tabs[0].url === "about:blank#from"
    );
    const attractiveWindows = windows.filter(
      (window) => window.tabs[0].url === "about:blank#to"
    );

    console.log(attractiveWindows);
    console.log(distractiveWindows);

    if (attractiveWindows.length === 0 || distractiveWindows.length === 0) {
      return;
    }

    const attractiveWindow = attractiveWindows[0];
    const distractiveWindow = distractiveWindows[0];

    if (
      tab.windowId !== distractiveWindow.id ||
      tab.windowId === attractiveWindow.id
    ) {
      return;
    }

    chrome.tabs.move(
      tab.id,
      { windowId: attractiveWindow.id, index: -1 },
      () => {
        chrome.windows.update(attractiveWindow.id, { focused: true }, () => {
          chrome.tabs.update(tab.id, { active: true });
        });
      }
    );
  });
});
