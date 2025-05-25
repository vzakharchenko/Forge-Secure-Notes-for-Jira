import React from "react";

import AppForge from "./AppForge";
import GlobalRoute from "./GlobalRoute";

const GlobalPage = (props:Readonly<{accountId:string}>) => {
    return (
        <AppForge>
            <GlobalRoute accountId={props.accountId} />
        </AppForge>
    );
};

export default GlobalPage;
