import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import 'overlayscrollbars/styles/overlayscrollbars.css';
import "./styles/index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App/>
  </StrictMode>
);
