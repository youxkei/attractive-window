chrome.tabs.onCreated.addListener(tab => {
  if (tab.pinned) {
    return
  }

  chrome.windows.getAll({ populate: true }, windows => {
    const specifiedWindows = windows.filter(window => window.tabs[0].url === "about:blank")
    if (specifiedWindows.length === 0) {
      return
    }

    const specifiedWindow = specifiedWindows[0]

    if (tab.windowId === specifiedWindow.id) {
      return
    }

    chrome.tabs.move(tab.id, { windowId: specifiedWindow.id, index: -1 }, () => {
      chrome.windows.update(specifiedWindow.id, { focused: true }, () => {
        chrome.tabs.update(tab.id, { active: true })
      })
    })
  })
})
