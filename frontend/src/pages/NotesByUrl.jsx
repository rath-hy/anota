import { useState, useEffect } from "react";
import noteService from "../services/notes";
import { useSearchParams } from "react-router-dom";
import StyledNote from "../components/StyledNote";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const serifFont = "'EB Garamond', Georgia, 'Times New Roman', Times, serif";

const NotesByUrlPage = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");
  const [notes, setNotes] = useState([]);
  const theme = useTheme();
  const linkColor = theme.palette.mode === "dark" ? "#7eb3ff" : "#0000EE";

  const fetchNotes = async () => {
    try {
      const response = await noteService.getPublicByUrl(url);
      setNotes(response);
    } catch (error) {
      console.error("error fetching notes by url", error);
    }
  };

  useEffect(() => {
    if (url) fetchNotes();
  }, [url]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}>
      {/* Back link */}
      <div style={{ marginBottom: "12px" }}>
        <Link
          to="/"
          style={{
            color: "inherit",
            textDecoration: "none",
            fontFamily: serifFont,
            fontSize: "16px",
          }}
        >
          ← Home
        </Link>
      </div>

      {/* URL header */}
      <div
        style={{
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "2px solid #1a1a1a",
        }}
      >
        {/* <div style={{ fontSize: '14px', color: '#666', fontFamily: serifFont, marginBottom: '4px' }}>
          URL:
        </div> */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: linkColor, textDecoration: "none" }}
          >
            <Typography variant="h2" sx={{ wordBreak: "break-all" }}>
              {url}
            </Typography>
          </a>

          {/* <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'none', fontSize: '16px', lineHeight: 1, flexShrink: 0 }}
            title="Visit URL"
          >
            ↗
          </a> */}
        </div>
      </div>

      {/* Notes header */}
      <h2
        style={{
          fontFamily: serifFont,
          fontWeight: 400,
          marginBottom: "0",
          fontSize: "20px",
        }}
      >
        Notes ({notes.length})
      </h2>

      {/* Notes list */}
      <div>
        {notes.length === 0 ? (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              color: "#666",
              border: "1px solid #ddd",
              fontFamily: serifFont,
              marginTop: "16px",
            }}
          >
            No notes yet for this URL.
          </div>
        ) : (
          notes.map((note) => <StyledNote key={note.id} note={note} />)
        )}
      </div>
    </div>
  );
};

export default NotesByUrlPage;
