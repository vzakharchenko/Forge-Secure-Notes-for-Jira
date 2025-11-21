// libs
import React from "react";

// components
import AppForge from "./components/AppForge";
import GlobalRoute from "./components/GlobalRoute";

const AuditGlobal = (props: { timezone: string }) => {
  return (
    <AppForge>
      <GlobalRoute timezone={props.timezone} />
    </AppForge>
  );
};

export default AuditGlobal;
