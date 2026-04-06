import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import noteService from "../services/notes";
import teamService from "../services/teams";
import store from "../store";

const serifFont = "'EB Garamond', Georgia, 'Times New Roman', Times, serif";

const NewNoteForm = ({ onNoteCreated, urlOptions, prefilledUrl }) => {
  const [url, setUrl] = prefilledUrl ? useState(prefilledUrl) : useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState("public"); // "public" | "private" | "team"
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState(null);

  const user = useSelector((state) => state.user);
  const theme = useTheme();

  const textColor = theme.palette.text.primary;
  const bgColor = theme.palette.background.paper;
  const borderColor = theme.palette.divider;
  const mutedColor = theme.palette.text.secondary;
  const btnBg = theme.palette.mode === "dark" ? "#e0e0e0" : "#1a1a1a";
  const btnText = theme.palette.mode === "dark" ? "#1a1a1a" : "#fff";

  useEffect(() => {
    if (user?.token) noteService.setToken(user.token);
  }, [user]);

  // Fetch teams when "team" visibility is selected
  useEffect(() => {
    if (visibility === "team" && teams.length === 0 && user) {
      teamService.getMyTeams().then((myTeams) => {
        setTeams(myTeams);
        if (myTeams.length > 0) setSelectedTeamId(String(myTeams[0].id));
      }).catch(console.error);
    }
  }, [visibility]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const noteObject = {
      username: user.username,
      private: visibility === "private",
      url,
      content,
      date: date ? date : null,
      teamId: visibility === "team" && selectedTeamId ? Number(selectedTeamId) : null,
    };

    try {
      const newNote = await noteService.create(noteObject);
      setMessage("Note created successfully!");
      setTimeout(() => setMessage(""), 2000);
      setVisibility("public");
      setUrl("");
      setContent("");
      setDate("");
      setSelectedTeamId("");
      onNoteCreated(newNote);
    } catch (error) {
      setMessage("Failed to create note");
      console.error(error);
    }
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontFamily: serifFont,
    fontSize: "20px",
    color: textColor,
  };

  const inputStyle = {
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
          <label htmlFor="url" style={labelStyle}>Link</label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            required
            list="url-options"
            style={inputStyle}
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
          <label htmlFor="content" style={labelStyle}>Note</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write here..."
            required
            rows={12}
            style={{ ...inputStyle, lineHeight: "1.6", resize: "vertical" }}
          />
        </div>

        {/* Visibility */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Visibility</label>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[
              { value: "public", label: "Public" },
              { value: "private", label: "Private" },
              { value: "team", label: "Team" },
            ].map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: serifFont,
                  fontSize: "18px",
                  cursor: "pointer",
                  color: textColor,
                }}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={opt.value}
                  checked={visibility === opt.value}
                  onChange={() => setVisibility(opt.value)}
                  style={{ cursor: "pointer" }}
                />
                {opt.label}
              </label>
            ))}
          </div>

          {/* Team selector — shown only when "team" is selected */}
          {visibility === "team" && (
            <div style={{ marginTop: "12px" }}>
              {teams.length === 0 ? (
                <p style={{ fontFamily: serifFont, fontSize: "16px", color: mutedColor }}>
                  You're not on any teams yet. Create or join one first.
                </p>
              ) : (
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  required={visibility === "team"}
                  style={{
                    ...inputStyle,
                    width: "auto",
                    minWidth: "200px",
                  }}
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
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
