import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import noteService from "../services/notes";
import store from "../store";

const serifFont = "'EB Garamond', Georgia, 'Times New Roman', Times, serif";

const NewNoteForm = ({ onNoteCreated, urlOptions, prefilledUrl }) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [url, setUrl] = prefilledUrl ? useState(prefilledUrl) : useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState(null);

  const user = useSelector((state) => state.user);
  const theme = useTheme();

  const textColor = theme.palette.text.primary;
  const bgColor = theme.palette.background.paper;
  const borderColor = theme.palette.divider;
  const btnBg = theme.palette.mode === "dark" ? "#e0e0e0" : "#1a1a1a";
  const btnText = theme.palette.mode === "dark" ? "#1a1a1a" : "#fff";

  useEffect(() => {
    if (user?.token) {
      noteService.setToken(user.token);
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("user:", user);
    console.log("token:", user?.token);
    console.log("store token:", store.getState().token);

    const noteObject = {
      username: user.username,
      private: isPrivate,
      url,
      content,
      date: date ? date : null,
    };

    try {
      const newNote = await noteService.create(noteObject);
      setMessage("Note created successfully!");
      setTimeout(() => setMessage(""), 2000);
      setIsPrivate(false);
      setUrl("");
      setContent("");
      setDate("");
      onNoteCreated(newNote);
    } catch (error) {
      setMessage("Failed to create note");
      console.error(error);
    }
  };

  return (
    <div>
      <h1
        style={{
          fontFamily: serifFont,
          fontWeight: 500,
          marginBottom: "24px",
          fontSize: "24px",
          color: textColor,
        }}
      >
        Create a new note
      </h1>

      <form onSubmit={handleSubmit}>
        {/* URL field */}
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="url"
            style={{
              display: "block",
              marginBottom: "6px",
              fontFamily: serifFont,
              fontSize: "20px",
              color: textColor,
            }}
          >
            Link
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            required
            list="url-options"
            style={{
              width: "100%",
              padding: "6px 8px",
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
              color: textColor,
              fontFamily: serifFont,
              fontSize: "18px",
              borderRadius: 0,
              boxSizing: "border-box",
              outline: "none",
            }}
          />
          {urlOptions && urlOptions.length > 0 && (
            <datalist id="url-options">
              {urlOptions.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
          )}
        </div>

        {/* Note field */}
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="content"
            style={{
              display: "block",
              marginBottom: "6px",
              fontFamily: serifFont,
              fontSize: "20px",
              color: textColor,
            }}
          >
            Note
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write here..."
            required
            rows={12}
            style={{
              width: "100%",
              padding: "8px",
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
              color: textColor,
              fontFamily: serifFont,
              fontSize: "18px",
              lineHeight: "1.6",
              resize: "vertical",
              borderRadius: 0,
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        {/* Private checkbox */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: serifFont,
              fontSize: "20px",
              cursor: "pointer",
              color: textColor,
            }}
          >
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            Private (only visible to you)
          </label>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            style={{
              padding: "8px 20px",
              border: `1px solid ${btnBg}`,
              backgroundColor: btnBg,
              color: btnText,
              cursor: "pointer",
              fontFamily: serifFont,
              fontSize: "16px",
              borderRadius: 0,
            }}
          >
            Create
          </button>
        </div>
      </form>

      {message && (
        <p
          style={{
            fontFamily: serifFont,
            color: message.includes("Failed") ? "#cc0000" : textColor,
            marginTop: "12px",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default NewNoteForm;
