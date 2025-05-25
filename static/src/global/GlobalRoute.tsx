import React from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import EmptyState from "@atlaskit/empty-state";
import Button from "@atlaskit/button";

import NotFoundClosedImage from "../img/404.png";

import {GLOBAL_ROUTES} from "./Routes";
import SecureNotesInfoPage from "./SecureNotesInfoPage";
import LinkPage from "./LinkPage";

export const GlobalRoute = (props:Readonly<{accountId:string}>) => {
    const navigate = useNavigate();
    return (
                    <Routes>
                        <Route
                            path={GLOBAL_ROUTES.all.route}
                            element={
                                <SecureNotesInfoPage/>
                            }
                        />
                        <Route
                            path={GLOBAL_ROUTES.record.route}
                            element={
                                <LinkPage accountId={props.accountId}/>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <EmptyState
                                    header="Invalid URL Entered"
                                    description="The URL you have entered is not valid. Please check it for any typos or mistakes and try again."
                                    headingLevel={2}
                                    primaryAction={
                                        <Button appearance="primary" onClick={() => navigate(GLOBAL_ROUTES.all.route)}>
                                            Go to Main Page
                                        </Button>
                                    }
                                    imageUrl={NotFoundClosedImage}
                                />
                            }
                        />
                    </Routes>
    );
};

export default GlobalRoute;
