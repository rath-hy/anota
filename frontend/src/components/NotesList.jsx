import { useState, useEffect } from "react";
import noteService from "../services/notes";
import userService from "../services/users";
import UrlSearchBar from "./UrlSearchBar";
import FeedNote from "./FeedNote";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";

const serifFont = "'EB Garamond', Georgia, 'Times New Roman', Times, serif";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const user = useSelector((state) => state.user);
  const [following, setFollowing] = useState([]);
  const theme = useTheme();

  const fetchNotes = async () => {
    try {
      const response = await noteService.getAllPublic();
      setNotes(response);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchFollowing = async () => {
    if (!user) return;
    try {
      const followingData = await userService.getFollowing(user.id);
      setFollowing(followingData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);
  useEffect(() => {
    if (user) fetchFollowing();
  }, [user?.id]);

  const followingNotes = notes.filter((note) =>
    following.some((u) => u.id === note.user.id),
  );

  const activeNotes = activeTab === "all" ? notes : followingNotes;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}>
      <UrlSearchBar />

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          borderBottom: "1px solid #ccc",
          marginBottom: "0",
        }}
      >
        {["all", "following"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontFamily: serifFont,
              fontSize: "16px",
              color:
                activeTab === tab
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              padding: "8px 0",
              borderBottom:
                activeTab === tab
                  ? `2px solid ${theme.palette.text.primary}`
                  : "2px solid transparent",
              marginBottom: "-1px",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notes */}
      <div>
        {activeTab === "following" && !user ? (
          <p
            style={{
              fontFamily: serifFont,
              color: "#666",
              textAlign: "center",
              marginTop: "32px",
            }}
          >
            Log in to see notes from people you follow
          </p>
        ) : activeNotes.length === 0 ? (
          <p
            style={{
              fontFamily: serifFont,
              color: "#666",
              textAlign: "center",
              marginTop: "32px",
            }}
          >
            No notes yet
          </p>
        ) : (
          activeNotes.map((note) => (
            <FeedNote key={note.id} note={note} onDelete={undefined} />
          ))
        )}
      </div>
    </div>
  );
};

export default NotesList;
