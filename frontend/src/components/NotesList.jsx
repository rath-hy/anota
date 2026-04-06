import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import noteService from "../services/notes";
import userService from "../services/users";
import teamService from "../services/teams";
import UrlSearchBar from "./UrlSearchBar";
import FeedNote from "./FeedNote";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";

const serifFont = "'EB Garamond', Georgia, 'Times New Roman', Times, serif";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [following, setFollowing] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState("all");
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamNotes, setTeamNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Read tab + teamId from URL query params on mount (used after joining a team)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const teamId = params.get("teamId");
    if (tab === "teams") {
      setActiveTab("teams");
      if (teamId) setSelectedTeamId(Number(teamId));
    }
  }, []);

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

  const fetchTeams = async () => {
    if (!user) return;
    try {
      const myTeams = await teamService.getMyTeams();
      setTeams(myTeams);
      if (myTeams.length > 0 && !selectedTeamId) {
        setSelectedTeamId(myTeams[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchNotes(); }, []);
  useEffect(() => { if (user) fetchFollowing(); }, [user?.id]);
  useEffect(() => { if (user && activeTab === "teams") fetchTeams(); }, [user?.id, activeTab]);

  // Fetch members + notes when selected team changes
  useEffect(() => {
    if (!selectedTeamId) return;
    const load = async () => {
      try {
        const [members, tNotes] = await Promise.all([
          teamService.getTeamMembers(selectedTeamId),
          teamService.getTeamNotes(selectedTeamId),
        ]);
        setTeamMembers(members);
        setTeamNotes(tNotes);
        setSelectedMemberId("all");
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [selectedTeamId]);

  // Re-fetch when member filter changes
  useEffect(() => {
    if (!selectedTeamId) return;
    const load = async () => {
      try {
        const userId = selectedMemberId === "all" ? null : selectedMemberId;
        const tNotes = await teamService.getTeamNotes(selectedTeamId, userId);
        setTeamNotes(tNotes);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [selectedMemberId]);

  const followingNotes = notes.filter((note) =>
    following.some((u) => u.id === note.user.id)
  );

  const tabs = user ? ["all", "following", "teams"] : ["all"];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate("/", { replace: true });
    if (tab === "teams" && teams.length === 0) fetchTeams();
  };

  const tabStyle = (tab) => ({
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
  });

  const selectStyle = {
    fontFamily: serifFont,
    fontSize: "16px",
    padding: "4px 28px 4px 8px",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: 0,
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='${encodeURIComponent(theme.palette.text.secondary)}'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
  };

  const emptyMsg = (msg) => (
    <p
      style={{
        fontFamily: serifFont,
        color: "#666",
        textAlign: "center",
        marginTop: "32px",
      }}
    >
      {msg}
    </p>
  );

  const renderTeamsTab = () => {
    if (!user) return emptyMsg("Log in to see your teams");
    if (teams.length === 0)
      return emptyMsg(
        "You're not on any teams yet. Create or join one from the Create menu."
      );

    return (
      <>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            padding: "12px 0",
            flexWrap: "wrap",
          }}
        >
          <select
            value={selectedTeamId || ""}
            onChange={(e) => setSelectedTeamId(Number(e.target.value))}
            style={selectStyle}
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {teamMembers.length > 0 && (
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All members</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (@{m.username})
                </option>
              ))}
            </select>
          )}

          {selectedTeamId && (
            <Link
              to={`/teams/${selectedTeamId}/manage`}
              style={{
                fontFamily: serifFont,
                fontSize: "15px",
                color: theme.palette.text.secondary,
                textDecoration: "none",
                border: `1px solid ${theme.palette.divider}`,
                padding: "4px 10px",
                marginLeft: "auto",
              }}
            >
              Manage team
            </Link>
          )}
        </div>

        {teamNotes.length === 0
          ? emptyMsg("No notes posted to this team yet")
          : teamNotes.map((note) => (
              <FeedNote key={note.id} note={note} onDelete={undefined} />
            ))}
      </>
    );
  };

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
        {tabs.map((tab) => (
          <button key={tab} onClick={() => handleTabClick(tab)} style={tabStyle(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === "teams" ? (
          renderTeamsTab()
        ) : activeTab === "following" && !user ? (
          emptyMsg("Log in to see notes from people you follow")
        ) : (activeTab === "all" ? notes : followingNotes).length === 0 ? (
          emptyMsg("No notes yet")
        ) : (
          (activeTab === "all" ? notes : followingNotes).map((note) => (
            <FeedNote key={note.id} note={note} onDelete={undefined} />
          ))
        )}
      </div>
    </div>
  );
};

export default NotesList;
