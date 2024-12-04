let currentIndex = -1;
const searchResults = [];

function injectCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .keyboard-highlight {
      outline: 2px solid #282828 !important;
      box-shadow: 0 0 0 3px rgba(40,40,40) !important;
      background-color: rgba(40,40,40) !important;
      border-radius: 5px !important;
    }
  `;
  document.head.appendChild(style);
}

function initializeSearchResults() {
  searchResults.length = 0;
  document.querySelectorAll('.g:not(.g-blk)').forEach((result) => {
    if (result.querySelector('cite')) {
      searchResults.push(result);
    }
  });
  console.log(`Found ${searchResults.length} valid search results`);
}

function highlightResult(index) {
  console.log(`Highlighting result at index ${index}`);
  if (currentIndex >= 0 && currentIndex < searchResults.length) {
    searchResults[currentIndex].classList.remove('keyboard-highlight');
  }
  if (index >= 0 && index < searchResults.length) {
    searchResults[index].classList.add('keyboard-highlight');
    searchResults[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  currentIndex = index;
}

function handleKeyPress(e) {
  console.log(`Key pressed: ${e.key}`);
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }

  switch (e.key) {
    case 'Enter':
      if (currentIndex >= 0 && currentIndex < searchResults.length) {
        const link = searchResults[currentIndex].querySelector('a');
        if (link) {
          window.location.href = link.href;
        }
      }
      break;
    case 'j':
      highlightResult(Math.min(currentIndex + 1, searchResults.length - 1));
      break;
    case 'k':
      highlightResult(Math.max(currentIndex - 1, 0));
      break;
    case 'o':
      if (currentIndex >= 0 && currentIndex < searchResults.length) {
        const link = searchResults[currentIndex].querySelector('a');
        if (link) {
          browser.runtime.sendMessage({
            action: "openNewTab",
            url: link.href
          });
        }
      }
      break;
  }
}

function init() {
  console.log("Extension initialized");
  injectCSS();
  initializeSearchResults();
  document.addEventListener('keydown', handleKeyPress);
}

// Run the init function when the page loads and when the URL changes
init();
window.addEventListener('popstate', init);

// Re-initialize results when new results are loaded dynamically
const observer = new MutationObserver(() => {
  initializeSearchResults();
});
observer.observe(document.body, { childList: true, subtree: true });
