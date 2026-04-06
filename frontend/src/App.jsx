import { useState, useRef, useEffect } from "react";
import NewNoteForm from "./components/NewNoteForm";
import LoginPage from "./pages/LoginPage";
import LoginPageTwo from "./pages/LoginPageTwo";
import NotesList from "./components/NotesList";
import LoginForm from "./components/LoginForm";
import NotesByUrlPage from "./pages/NotesByUrl";
import { AppBar, Toolbar, Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import ProfileMenu from "./components/ProfileMenu";
import NewNotePage from "./pages/NewNotePage";
import CreateTeamPage from "./pages/CreateTeamPage";
import JoinTeamPage from "./pages/JoinTeamPage";
import ManageTeamPage from "./pages/ManageTeamPage";
import { useDispatch, useSelector } from "react-redux";
import { setUserAction } from "./reducers/userReducer";
import noteService from "./services/notes";
import store from "./store";
import { useEffect as useEff } from "react";
import ProfilePage from "./pages/ProfilePage";
import YouTubeTest from "./components/YouTubeTest";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "./theme";
import SignIn from "./sign-in/SignIn";

const serifFont = "'EB Garamond', Georgia, 'Times New Roman', Times, serif";

// Dropdown Create menu component (needs to be inside Router for useNavigate)
const CreateMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const theme_mode = useSelector((state) => state.theme);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options = [
    { label: "Create a new note", path: "/new-note" },
    { label: "Create a new team", path: "/create-team" },
    { label: "Join a team", path: "/join-team" },
  ];

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          textDecoration: "none",
          color: "inherit",
          border: "1px solid currentColor",
          padding: "4px 12px",
          fontSize: "18px",
          fontFamily: serifFont,
          height: "34px",
          display: "flex",
          alignItems: "center",
          background: "none",
          cursor: "pointer",
          boxSizing: "border-box",
          gap: "6px",
        }}
      >
        ➕ Create <span style={{ fontSize: "12px", marginTop: "1px" }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            minWidth: "200px",
            border: "1px solid",
            borderColor: "inherit",
            backgroundColor: theme_mode === "dark" ? "#1e1e1e" : "#fff",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.path}
              onClick={() => { navigate(opt.path); setOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 16px",
                fontFamily: serifFont,
                fontSize: "16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "inherit",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(128,128,128,0.1)"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const themeMode = useSelector((state) => state.theme);
  const theme = themeMode === "light" ? lightTheme : darkTheme;

  useEff(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUserAction(user));
      noteService.setToken(user.token);
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar
          position="sticky"
          color="default"
          elevation={0}
          sx={{
            backgroundColor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              justifyContent: "space-between",
              maxWidth: "800px",
              width: "100%",
              mx: "auto",
              px: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: "30px",
                  fontFamily: serifFont,
                  fontWeight: 800,
                }}
              >
                Anota
              </Link>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {currentUser && <CreateMenu />}
              <ProfileMenu />
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ pt: 3, pb: 6 }}>
          <Routes>
            <Route path="/" element={<NotesList />} />
            <Route path="/users/:id" element={<ProfilePage />} />
            <Route path="/account" element={<SignIn />} />
            <Route path="/notes" element={<NotesByUrlPage />} />
            <Route path="/login" element={<LoginPageTwo />} />
            <Route path="/new-note" element={<NewNotePage />} />
            <Route path="/create-team" element={<CreateTeamPage />} />
            <Route path="/join-team" element={<JoinTeamPage />} />
            <Route path="/teams/:id/manage" element={<ManageTeamPage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
