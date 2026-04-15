import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useTheme } from "@mui/material/styles"
import noteService from "../services/notes"
import teamService from "../services/teams"

const serifFont = "'EB Garamond', Georgia, 'Times New Roman', Times, serif"

const EditNotePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const theme = useTheme()

  const [url, setUrl] = useState("")
  const [content, setContent] = useState("")
  const [visibility, setVisibility] = useState("public")
  const [selectedTeamId, setSelectedTeamId] = useState("")
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const textColor = theme.palette.text.primary
  const bgColor = theme.palette.background.paper
  const borderColor = theme.palette.divider
  const mutedColor = theme.palette.text.secondary
  const btnBg = theme.palette.mode === "dark" ? "#e0e0e0" : "#1a1a1a"
  const btnText = theme.palette.mode === "dark" ? "#1a1a1a" : "#fff"

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const note = await noteService.getById(id)
        setUrl(note.url)
        setContent(note.content)
        if (note.teamId) {
          setVisibility("team")
          setSelectedTeamId(String(note.teamId))
        } else if (note.private) {
          setVisibility("private")
        } else {
          setVisibility("public")
        }
      } catch {
        setError("Could not load note.")
      } finally {
        setLoading(false)
      }
    }
    fetchNote()
  }, [id])

  useEffect(() => {
    if (visibility === "team" && teams.length === 0 && user) {
      teamService.getMyTeams().then((myTeams) => {
        setTeams(myTeams)
        if (myTeams.length > 0 && !selectedTeamId) {
          setSelectedTeamId(String(myTeams[0].id))
        }
      }).catch(console.error)
    }
  }, [visibility])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await noteService.update(id, {
        url,
        content,
        private: visibility === "private",
        teamId: visibility === "team" && selectedTeamId ? Number(selectedTeamId) : null,
      })
      navigate(`/users/${user.id}`)
    } catch {
      setError("Failed to save changes.")
      setSaving(false)
    }
  }

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontFamily: serifFont,
    fontSize: "20px",
    color: textColor,
  }

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
  }

  if (loading) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px", fontFamily: serifFont, color: textColor }}>
        Loading…
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px", fontFamily: serifFont, color: "#cc0000" }}>
        {error}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}>
      <h1 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: "24px", color: textColor, marginBottom: "24px" }}>
        Edit note
      </h1>

      <form onSubmit={handleSubmit}>
        {/* URL */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="url" style={labelStyle}>Link</label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {/* Content */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="content" style={labelStyle}>Note</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
                style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: serifFont, fontSize: "18px", cursor: "pointer", color: textColor }}
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

          {visibility === "team" && (
            <div style={{ marginTop: "12px" }}>
              {teams.length === 0 ? (
                <p style={{ fontFamily: serifFont, fontSize: "16px", color: mutedColor }}>
                  You're not on any teams yet.
                </p>
              ) : (
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  required
                  style={{ ...inputStyle, width: "auto", minWidth: "200px" }}
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "8px 20px",
              border: `1px solid ${btnBg}`,
              backgroundColor: btnBg,
              color: btnText,
              cursor: "pointer",
              fontFamily: serifFont,
              fontSize: "16px",
              borderRadius: 0,
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/users/${user.id}`)}
            style={{
              padding: "8px 20px",
              border: `1px solid ${borderColor}`,
              backgroundColor: "transparent",
              color: textColor,
              cursor: "pointer",
              fontFamily: serifFont,
              fontSize: "16px",
              borderRadius: 0,
            }}
          >
            Cancel
          </button>
        </div>

        {error && (
          <p style={{ fontFamily: serifFont, color: "#cc0000", marginTop: "12px" }}>{error}</p>
        )}
      </form>
    </div>
  )
}

export default EditNotePage
