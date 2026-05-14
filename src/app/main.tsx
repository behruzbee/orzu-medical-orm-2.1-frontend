import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "./providers";

import "@mantine/notifications/styles.css";
import "./styles/_app.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
);
