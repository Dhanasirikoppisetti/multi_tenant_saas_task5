import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./RootApp.jsx";
import "./styles/global.styles.css";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
