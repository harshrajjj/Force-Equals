// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get references to the form elements
  const companyNameInput = document.getElementById('companyName');
  const matchScoreInput = document.getElementById('matchScore');
  const accountStatusSelect = document.getElementById('accountStatus');
  const testButton = document.getElementById('testButton');
  const resetButton = document.getElementById('resetButton');
  const statusDiv = document.getElementById('status');
  
  // Default data
  const defaultData = {
    companyName: "TechCorp",
    matchScore: 86,
    accountStatus: "Target"
  };
  
  // Function to show status message
  function showStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + (isError ? 'error' : 'success');
    
    // Hide the status message after 3 seconds
    setTimeout(() => {
      statusDiv.className = 'status';
    }, 3000);
  }
  
  // Function to test the widget with custom data
  function testWidget() {
    // Get values from form
    const companyName = companyNameInput.value.trim();
    const matchScore = parseInt(matchScoreInput.value, 10);
    const accountStatus = accountStatusSelect.value;
    
    // Validate input
    if (!companyName) {
      showStatus('Company name cannot be empty', true);
      return;
    }
    
    if (isNaN(matchScore) || matchScore < 0 || matchScore > 100) {
      showStatus('Match score must be between 0 and 100', true);
      return;
    }
    
    // Create data object
    const customData = {
      companyName: companyName,
      matchScore: matchScore,
      accountStatus: accountStatus
    };
    
    // Send message to background script
    chrome.runtime.sendMessage({
      action: 'testWidgetWithCustomData',
      data: customData
    }, response => {
      if (response && response.success) {
        showStatus('Widget updated with custom data');
      } else {
        showStatus('Failed to update widget: ' + (response?.error || 'Unknown error'), true);
      }
    });
  }
  
  // Function to reset to default data
  function resetToDefault() {
    companyNameInput.value = defaultData.companyName;
    matchScoreInput.value = defaultData.matchScore;
    accountStatusSelect.value = defaultData.accountStatus;
    
    // Test widget with default data
    chrome.runtime.sendMessage({
      action: 'testWidgetWithCustomData',
      data: defaultData
    }, response => {
      if (response && response.success) {
        showStatus('Widget reset to default data');
      } else {
        showStatus('Failed to reset widget: ' + (response?.error || 'Unknown error'), true);
      }
    });
  }
  
  // Add event listeners
  testButton.addEventListener('click', testWidget);
  resetButton.addEventListener('click', resetToDefault);
});
