import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#2e2e2e",
    },
    text: {
      primary: "#fff",
    },
  },
  typography: {
    fontFamily: "Courier New, monospace",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#3e3e3e",
          borderColor: "#5e5e5e",
          "&:hover": {
            backgroundColor: "#5e5e5e",
          },
        },
      },
    },
  },
});

export default darkTheme;
