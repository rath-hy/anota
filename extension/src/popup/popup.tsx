import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './popup.css'

const App: React.FC<{}> = () => {
  const [notes, setNotes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Rendering with:", { notes, loading, error });

  useEffect(() => {
    fetchNotesForCurrentTab();
  }, []);

  const fetchNotesForCurrentTab = async () => {
    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url) {
        setError("No URL found");
        setLoading(false);
        return;
      }

      console.log("Current tab URL:", tab.url);

      // Send message to background script
      chrome.runtime.sendMessage(
        {
          action: "fetchNotes",
          pageUrl: tab.url
        },
        (response) => {
          console.log("Response from background:", response);
          
          if (response.success) {
            console.log("Notes data:", response.notes);
            setNotes(response.notes);
          } else {
            setError(response.error);
          }
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', minWidth: '300px' }}>
      <h2>Anota Notes</h2>
      
      {loading && <p>Loading notes...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {notes && (
        <div>
          <p>Found {notes.length || 0} notes</p>
          <pre>{JSON.stringify(notes, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)