// Initialize default settings when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ widgetVisible: true }, () => {
    console.log('Widget visibility set to true by default');
  });
});

// Listen for tab updates to detect LinkedIn profile navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the URL contains a LinkedIn profile and the page has completed loading
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('linkedin.com/in/')) {
    // Send a message to the content script to update the widget
    chrome.tabs.sendMessage(tabId, { action: 'updateWidget' })
      .catch(() => {
        // This might fail if the content script isn't ready yet, which is fine
      });
  }
});

// Function to test the widget with custom data
function testWidgetWithCustomData(tabId, customData) {
  chrome.tabs.sendMessage(tabId, {
    action: 'testWidget',
    data: customData
  }).catch(error => {
    console.error('Error testing widget:', error);
  });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  // Handle toggle widget visibility
  if (request.action === 'toggleWidget') {
    chrome.storage.sync.get('widgetVisible', (data) => {
      const newVisibility = !data.widgetVisible;
      chrome.storage.sync.set({ widgetVisible: newVisibility }, () => {
        sendResponse({ widgetVisible: newVisibility });
      });
    });
    return true; // Required for async sendResponse
  }

  // Handle test widget request
  if (request.action === 'testWidgetWithCustomData' && request.data) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
        testWidgetWithCustomData(tabs[0].id, request.data);
        sendResponse({success: true});
      } else {
        sendResponse({success: false, error: 'No active tab found'});
      }
    });
    return true; // Required for async sendResponse
  }
});
