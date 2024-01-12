import React from "react";
import ReactDOM from "react-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import App from "./App"; // Replace with your main component
import "./index.css";
import { BrowserRouter, HashRouter, MemoryRouter } from "react-router-dom";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#007bf",
    },
    secondary: {
      main: "#000",
    },
  },
});

const root = document.createElement("div")
root.className = "container"
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <ThemeProvider theme={theme}>
    <MemoryRouter>
      <App/>
    </MemoryRouter>
  </ThemeProvider>
);