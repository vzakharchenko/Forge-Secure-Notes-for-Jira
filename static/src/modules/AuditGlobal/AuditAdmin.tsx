// libs
import React from "react";

// components
import AppForge from "./components/AppForge";
import AdminRoute from "./components/AdminRoute";

const AuditGlobal = (props: { timezone: string }) => {
  return (
    <AppForge>
      <AdminRoute timezone={props.timezone} />
    </AppForge>
  );
};

export default AuditGlobal;
