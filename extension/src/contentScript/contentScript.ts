// This runs on facebook.com
console.log("Anota extension loaded on:", window.location.href);

// Request notes for this page
chrome.runtime.sendMessage(
  {
    action: "fetchNotes",
    pageUrl: window.location.href
  },
  (response) => {
    if (response.success) {
      console.log("Got notes:", response.notes);
      // Do something with the notes - display them on the page!
    } else {
      console.error("Failed to fetch notes:", response.error);
    }
  }
);