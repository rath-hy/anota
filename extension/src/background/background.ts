chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchNotes") {
    // Call the async function
    fetchNotesFromAPI(request.pageUrl, sendResponse);
    
    // IMPORTANT: Return true to keep the message channel open
    return true;
  }
});

async function fetchNotesFromAPI(pageUrl, sendResponse) {
  try {
    const url = `http://localhost:3001/api/notes?url=${encodeURIComponent(pageUrl)}`;
    console.log("Fetching from:", url);
    
    const response = await fetch(url);
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Got notes:", data);
    
    sendResponse({ success: true, notes: data });
    
  } catch (error) {
    console.error("Fetch error:", error);
    sendResponse({ success: false, error: error.message });
  }
}