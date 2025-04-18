// Static sample data as per requirements
const sampleData = {
  "companyName": "TechCorp",
  "matchScore": 86,
  "accountStatus": "Target"
};

// List of terms that are NOT company names
const nonCompanyTerms = [
  // Programming languages and technologies
  'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'html', 'css',
  'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
  'bootstrap', 'jquery', 'typescript', 'swift', 'kotlin', 'objective-c',
  'mongodb', 'mysql', 'postgresql', 'sql', 'nosql', 'redis', 'graphql',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github',
  'frontend', 'backend', 'fullstack', 'devops', 'ui/ux', 'mobile', 'web',

  // Job types and work arrangements
  'full-time', 'part-time', 'freelance', 'contract', 'intern', 'internship',
  'remote', 'hybrid', 'on-site', 'on site', 'work from home', 'wfh',

  // LinkedIn section names and common terms
  'experience', 'education', 'skills', 'about', 'present', 'current',
  'former', 'previous', 'now', 'today', 'profile', 'summary', 'info',

  // Job titles
  'developer', 'engineer', 'designer', 'manager', 'director', 'coordinator',
  'specialist', 'analyst', 'consultant', 'assistant', 'associate',
  'junior', 'senior', 'lead', 'principal', 'chief', 'head of', 'vp of',
  'ceo', 'cto', 'cfo', 'coo', 'founder', 'co-founder', 'president',
  'software', 'product', 'project', 'program', 'marketing', 'sales',
  'hr', 'human resources', 'finance', 'accounting', 'operations',

  // Time-related terms
  'month', 'year', 'day', 'week', 'hour', 'minute', 'second',
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
  '2020', '2021', '2022', '2023', '2024', '2019', '2018', '2017', '2016'
];

// Function to check if text is likely a company name
function isLikelyCompanyName(text) {
  if (!text || text.length < 3) return false;

  // Convert to lowercase for comparison
  const lowerText = text.toLowerCase();

  // Check against non-company terms
  for (const term of nonCompanyTerms) {
    if (lowerText === term) return false;
  }

  // Check for patterns that suggest it's not a company name
  if (text.match(/^\d/)) return false; // Starts with a number
  if (text.match(/^\(/)) return false; // Starts with a parenthesis
  if (text.length > 50) return false; // Too long to be a company name
  if (text.split(' ').length > 8) return false; // Too many words

  // Check for common non-company patterns
  if (lowerText.includes('years')) return false;
  if (lowerText.includes('months')) return false;
  if (lowerText.includes('present')) return false;
  if (lowerText.includes('current')) return false;
  if (lowerText.includes('former')) return false;
  if (lowerText.includes('previous')) return false;
  if (lowerText.match(/^[0-9\-]+$/)) return false; // Just numbers and hyphens
  if (lowerText.match(/^\d{1,2}\/\d{1,2}\/\d{2,4}$/)) return false; // Date format

  // Check for years (common in education sections)
  if (lowerText.match(/^\d{4}$/)) return false; // Just a 4-digit year
  if (lowerText.match(/^\d{4}\s*-\s*\d{4}$/)) return false; // Year range like "2018-2022"
  if (lowerText.match(/^\d{4}\s*-\s*(present|current|now)$/i)) return false; // Year to present

  // Check for education-related terms
  const educationTerms = ['university', 'college', 'school', 'academy', 'institute', 'bachelor', 'master', 'phd', 'degree', 'diploma', 'certificate', 'education', 'student'];
  for (const term of educationTerms) {
    if (lowerText.includes(term)) {
      console.log('Rejected as company name due to education term:', text);
      return false;
    }
  }

  // Check for programming languages and technologies as standalone words
  const techTerms = ['javascript', 'python', 'java', 'react', 'angular', 'vue', 'node'];
  const words = lowerText.split(/\s+/);
  for (const word of words) {
    if (techTerms.includes(word)) {
      console.log('Rejected as company name due to tech term:', text);
      return false;
    }
  }

  return true;
}

// Function to extract company name from LinkedIn profile's experience section
function extractCompanyFromProfile() {
  try {
    // DIRECT DOM INSPECTION - Most reliable method for current LinkedIn
    console.log('Attempting to extract company name from LinkedIn profile');

    // Method 0: Handle the newest LinkedIn layout (2024)
    const newLayoutExperience = document.querySelector('#experience');
    if (newLayoutExperience) {
      console.log('Found new layout experience section');

      // In the new layout, company names are often in specific elements
      const newLayoutCompanyElements = newLayoutExperience.querySelectorAll(
        '.display-flex.align-items-center.t-14.t-normal.t-black, ' +
        '.t-bold.hoverable-link-text, ' +
        '.t-16.t-black.t-bold'
      );

      if (newLayoutCompanyElements && newLayoutCompanyElements.length > 0) {
        // Try the first few elements
        for (let i = 0; i < Math.min(5, newLayoutCompanyElements.length); i++) {
          const text = newLayoutCompanyElements[i].textContent.trim();
          // Check if it looks like a company name
          if (isLikelyCompanyName(text) &&
              !text.includes('Experience') &&
              !text.includes('Full-time') &&
              !text.includes('Part-time') &&
              !text.includes('present') &&
              !text.includes('Present')) {
            console.log('Found company in new layout:', text);
            return text;
          }
        }
      }
    }

    // Method 1: Look for experience section by finding the heading first
    const experienceHeadings = Array.from(document.querySelectorAll('h2, h3, section h2'));
    let experienceSection = null;

    for (const heading of experienceHeadings) {
      if (heading.textContent.includes('Experience')) {
        console.log('Found Experience heading:', heading.textContent);
        // Get the parent section or container
        experienceSection = heading.closest('section') || heading.parentElement.closest('section');
        break;
      }
    }

    // If we found the experience section
    if (experienceSection) {
      console.log('Found experience section');

      // Get all list items or cards in the experience section
      const experienceItems = experienceSection.querySelectorAll('li, .pv-entity, .pv-profile-section__card-item');

      if (experienceItems && experienceItems.length > 0) {
        console.log('Found', experienceItems.length, 'experience items');

        // The first item is usually the current position
        const firstItem = experienceItems[0];

        // Try to find company name in the first item
        const possibleCompanyElements = [
          firstItem.querySelector('h3'),
          firstItem.querySelector('h4'),
          firstItem.querySelector('.pv-entity__secondary-title'),
          firstItem.querySelector('.t-14.t-normal'),
          firstItem.querySelector('span[aria-hidden="true"]'),
          firstItem.querySelector('.inline-show-more-text'),
          firstItem.querySelector('a[data-field="company_name"]')
        ].filter(Boolean); // Remove null elements

        if (possibleCompanyElements.length > 0) {
          for (const element of possibleCompanyElements) {
            const companyName = element.textContent.trim();
            if (isLikelyCompanyName(companyName)) {
              console.log('Found company name:', companyName);
              return companyName;
            }
          }
        }
      }
    }

    // Method 2: Direct search for company elements
    console.log('Trying direct search for company elements');
    const directCompanySelectors = [
      '.experience-item .pv-entity__secondary-title',
      '.pv-entity__company-summary-info > span',
      '.pv-profile-section__card-subtitle',
      '.pv-entity__company-details',
      '.pv-profile-section__card-heading',
      '.pvs-entity__caption-wrapper',
      // New LinkedIn selectors (2024)
      '.pvs-entity__path-node',
      '.display-flex.align-items-center.t-14.t-normal.t-black',
      '.t-bold.hoverable-link-text',
      '.inline-show-more-text.inline-show-more-text--is-collapsed.inline-show-more-text--is-collapsed-with-line-clamp',
      '.display-flex.flex-wrap.align-items-center.full-width',
      '.display-flex.flex-row.justify-space-between',
      '.t-black.t-normal',
      '.t-16.t-black.t-bold'
    ];

    for (const selector of directCompanySelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements && elements.length > 0) {
        // Try the first few elements (sometimes the first one isn't the company)
        for (let i = 0; i < Math.min(5, elements.length); i++) {
          const text = elements[i].textContent.trim();
          // Check if it looks like a company name
          if (isLikelyCompanyName(text)) {
            console.log('Found company via direct selector:', text);
            return text;
          }
        }
      }
    }

    // Method 2.5: Look for any element with "Company Name" in it
    const allElements = document.querySelectorAll('*');
    for (const element of allElements) {
      if (element.textContent && element.textContent.includes('Company Name:')) {
        const companyText = element.textContent.split('Company Name:')[1].trim();
        if (companyText) {
          console.log('Found explicit company name:', companyText);
          return companyText;
        }
      }
    }

    // Method 3: Look for "at [Company]" pattern in the headline
    const headline = document.querySelector('.pv-top-card-section__headline, .text-body-medium');
    if (headline && headline.textContent) {
      const headlineText = headline.textContent.trim();
      if (headlineText.includes(' at ')) {
        const company = headlineText.split(' at ')[1].trim();
        console.log('Found company in headline:', company);
        return company;
      }
    }

    // Method 4: Extract from page title
    const pageTitle = document.title;
    if (pageTitle.includes(' at ')) {
      const company = pageTitle.split(' at ')[1].split(' |')[0].trim();
      console.log('Found company in page title:', company);
      return company;
    }

    // Method 5: Look for elements with "Present" text and get nearby company name
    console.log('Looking for elements with Present text');
    const presentElements = Array.from(document.querySelectorAll('*')).filter(el =>
      el.textContent &&
      (el.textContent.includes('Present') || el.textContent.includes('present'))
    );

    for (const element of presentElements) {
      // Look at parent elements to find company name
      let parent = element.parentElement;
      for (let i = 0; i < 3; i++) { // Check up to 3 levels up
        if (!parent) break;

        // Look for company name in siblings
        const siblings = Array.from(parent.children);
        for (const sibling of siblings) {
          if (sibling !== element && sibling.textContent) {
            const text = sibling.textContent.trim();
            // Check if it looks like a company name
            if (isLikelyCompanyName(text)) {
              console.log('Found company near Present text:', text);
              return text;
            }
          }
        }

        parent = parent.parentElement;
      }
    }

    // Method 6: Last resort - scan all text for company patterns
    console.log('Scanning page for company patterns');
    const allText = document.body.innerText;
    const companyPatterns = [
      /working at ([A-Z][A-Za-z0-9\s&\-\.]+)/i,
      /employed at ([A-Z][A-Za-z0-9\s&\-\.]+)/i,
      /present.*?([A-Z][A-Za-z0-9\s&\-\.]+)/i,
      /current.*?([A-Z][A-Za-z0-9\s&\-\.]+)/i
    ];

    for (const pattern of companyPatterns) {
      const match = allText.match(pattern);
      if (match && match[1]) {
        const company = match[1].trim();
        console.log('Found company via text pattern:', company);
        return company;
      }
    }

    // Check if there's any experience section at all
    const anyExperienceSection = document.querySelector('#experience, [data-section="experience"], .experience-section');
    if (!anyExperienceSection) {
      console.log('No experience section found on profile');
      return 'Not working in any company';
    }

    // If we have an experience section but couldn't find a company name
    console.log('Experience section found but no valid company name extracted');
  } catch (error) {
    console.error('Error extracting company name:', error);
  }

  // If no company found, explicitly return 'Not working in any company'
  return 'Not working in any company';
}

// Function to create and inject the widget
function createWidget(data) {
  // Remove existing widget if it exists
  const existingWidget = document.getElementById('linkedin-enhancer-widget');
  if (existingWidget) {
    existingWidget.remove();
  }

  // Create widget container
  const widget = document.createElement('div');
  widget.id = 'linkedin-enhancer-widget';

  // Create toggle button with icon
  const toggleBtn = document.createElement('div');
  toggleBtn.className = 'widget-toggle';
  toggleBtn.innerHTML = '<span class="toggle-icon">◀</span>';
  toggleBtn.title = 'Toggle Profile Enhancer';
  toggleBtn.addEventListener('click', toggleWidgetVisibility);

  // Create widget header
  const header = document.createElement('div');
  header.className = 'widget-header';

  const headerTitle = document.createElement('span');
  headerTitle.textContent = 'LinkedIn Enhancer';
  header.appendChild(headerTitle);

  // Create refresh button
  const refreshBtn = document.createElement('button');
  refreshBtn.className = 'refresh-button';
  refreshBtn.innerHTML = '↻';
  refreshBtn.title = 'Refresh data';
  refreshBtn.addEventListener('click', updateWidgetData);
  header.appendChild(refreshBtn);

  // Create widget content
  const content = document.createElement('div');
  content.className = 'widget-content';

  // Company name
  const companyName = document.createElement('div');
  companyName.className = 'company-name';
  companyName.textContent = data.companyName;

  // Add special styling if not working in any company
  if (data.companyName === 'Not working in any company') {
    companyName.classList.add('no-company');
  }

  // Match score
  const matchScore = document.createElement('div');
  matchScore.className = 'match-score';

  const scoreLabel = document.createElement('div');
  scoreLabel.className = 'score-label';

  const scoreText = document.createElement('span');
  scoreText.textContent = 'Match Score';

  const scoreValue = document.createElement('span');
  scoreValue.textContent = `${data.matchScore}%`;

  scoreLabel.appendChild(scoreText);
  scoreLabel.appendChild(scoreValue);

  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';

  const progressFill = document.createElement('div');
  progressFill.className = 'progress-fill';
  progressFill.style.width = `${data.matchScore}%`;

  progressBar.appendChild(progressFill);

  matchScore.appendChild(scoreLabel);
  matchScore.appendChild(progressBar);

  // Account status
  const accountStatus = document.createElement('div');
  accountStatus.className = 'account-status';
  accountStatus.textContent = data.accountStatus;

  if (data.accountStatus === 'Target') {
    accountStatus.classList.add('status-target');
  } else {
    accountStatus.classList.add('status-not-target');
  }

  // Assemble the widget
  content.appendChild(companyName);
  content.appendChild(matchScore);
  content.appendChild(accountStatus);

  widget.appendChild(toggleBtn);
  widget.appendChild(header);
  widget.appendChild(content);

  // Add the widget to the page
  document.body.appendChild(widget);

  // Check stored visibility state
  chrome.storage.sync.get('widgetVisible', (data) => {
    if (data.widgetVisible === false) {
      widget.classList.add('hidden');
      toggleBtn.querySelector('.toggle-icon').textContent = '▶';
    }
  });
}

// Function to toggle widget visibility
function toggleWidgetVisibility(event) {
  // Prevent default behavior
  if (event) {
    event.preventDefault();
  }

  const widget = document.getElementById('linkedin-enhancer-widget');
  if (!widget) return;

  const toggleIcon = widget.querySelector('.toggle-icon');
  if (!toggleIcon) return;

  // Toggle the hidden class
  widget.classList.toggle('hidden');

  // Update toggle icon
  if (widget.classList.contains('hidden')) {
    toggleIcon.textContent = '\u25b6'; // Right arrow
  } else {
    toggleIcon.textContent = '\u25c0'; // Left arrow
  }

  // Save visibility state
  const isHidden = widget.classList.contains('hidden');
  chrome.storage.sync.set({ widgetVisible: !isHidden });
}

// Function to update widget data based on current profile
function updateWidgetData() {
  console.log('Updating widget data for LinkedIn profile');

  // Extract company name from the profile's experience section
  const companyName = extractCompanyFromProfile();
  console.log('Extracted company name result:', companyName);

  // Create a new data object based on the static sample data
  // This ensures we're using the exact format specified in the requirements
  const widgetData = {
    "companyName": companyName,
    "matchScore": sampleData.matchScore,
    "accountStatus": sampleData.accountStatus
  };

  console.log('Widget data:', widgetData);

  // Create and inject the widget
  createWidget(widgetData);
}

// Function to check if URL has changed (for SPA navigation)
function checkURLChange() {
  const currentURL = window.location.href;

  // If we're on a LinkedIn profile page and the URL has changed
  if (currentURL.includes('linkedin.com/in/') && currentURL !== lastURL) {
    lastURL = currentURL;
    updateWidgetData();
  }
}

// Initialize the widget when the page is loaded
let lastURL = '';
window.addEventListener('load', () => {
  // Check if we're on a LinkedIn profile page
  if (window.location.href.includes('linkedin.com/in/')) {
    lastURL = window.location.href;
    updateWidgetData();
  }
});

// Also initialize on DOM content loaded to handle single-page applications
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on a LinkedIn profile page
  if (window.location.href.includes('linkedin.com/in/')) {
    lastURL = window.location.href;
    updateWidgetData();
  }
});

// Set up URL change detection for single-page applications
setInterval(checkURLChange, 1000);

// Function to test the widget with custom data
function testWidgetWithCustomData(customData) {
  console.log('Testing widget with custom data:', customData);
  createWidget(customData);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === 'updateWidget') {
    updateWidgetData();
    sendResponse({success: true});
  } else if (request.action === 'testWidget' && request.data) {
    // Allow testing with custom data
    testWidgetWithCustomData(request.data);
    sendResponse({success: true});
  }
});
