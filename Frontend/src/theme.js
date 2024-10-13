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
    fontFamily: 'MyCustomFont, Arial, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  
    h1: {
      fontFamily: 'MyCustomFont',
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontFamily: 'MyCustomFont',
      fontWeight: 500,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    body1: {
      fontFamily: 'MyCustomFont',
      fontWeight: 300,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    button: {
      fontFamily: 'MyCustomFont',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
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
