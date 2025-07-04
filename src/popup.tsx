import React from "react";
import { createRoot } from "react-dom/client";
const Popup = () => {
  return (
    <>
      <p>Edit the config on https://nyaa.si/</p>
    </>
  )
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
