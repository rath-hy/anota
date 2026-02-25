// src/theme.js
import { createTheme } from "@mui/material/styles";

const serifFont = "'EB Garamond', Georgia, 'Times New Roman', Times, serif";

const baseTheme = {
  typography: {
    fontFamily: serifFont,
    h1: { fontSize: "24px", fontWeight: 500, lineHeight: 1.4 },
    h2: { fontSize: "20px", fontWeight: 500, lineHeight: 1.4 },
    h3: { fontSize: "18px", fontWeight: 500, lineHeight: 1.4 },
    h4: { fontSize: "16px", fontWeight: 500, lineHeight: 1.4 },
    h5: { fontSize: "16px", fontWeight: 500, lineHeight: 1.4 },
    h6: { fontSize: "16px", fontWeight: 500, lineHeight: 1.4 },
    body1: {
      fontFamily: serifFont,
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body2: { fontFamily: serifFont, fontSize: "15px", lineHeight: 1.6 },
    caption: { fontFamily: serifFont },
    button: { fontFamily: serifFont, textTransform: "none", fontWeight: 400 },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #cccccc",
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontFamily: serifFont,
          textTransform: "none",
          fontWeight: 400,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          "&:hover": { backgroundColor: "#333" },
        },
        outlinedPrimary: {
          border: "1px solid #1a1a1a",
          color: "#1a1a1a",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontFamily: serifFont,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            fontFamily: serifFont,
            borderRadius: 0,
          },
          "& .MuiInputLabel-root": {
            fontFamily: serifFont,
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          fontFamily: serifFont,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          border: "1px solid #cccccc",
          boxShadow: "none",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: serifFont,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: serifFont,
          textTransform: "none",
          fontWeight: 400,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontFamily: serifFont,
          textTransform: "none",
          borderRadius: 0,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontFamily: serifFont,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: serifFont,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: serifFont,
        },
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        textDecoration: "none",
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    background: {
      default: "#FAFAF8",
      paper: "#ffffff",
    },
    primary: {
      main: "#1a1a1a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#666666",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#666666",
    },
    divider: "#cccccc",
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    background: {
      default: "#141414",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#e0e0e0",
      contrastText: "#1a1a1a",
    },
    secondary: {
      main: "#999999",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#999999",
    },
    divider: "#333333",
  },
});
