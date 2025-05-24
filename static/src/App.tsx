import React, {useEffect, useState} from "react";
import Button from "@atlaskit/button";
import {view} from "@forge/bridge";
import {FullContext} from "@forge/bridge/out/types";
import Loading from "./components/Loading";
import Issue from "./Issue";
import CenterDiv from "./components/CenterDiv";
import NewSecureNote from "./NewSecureNote";

const App = () => {
    const [context, setContext] = useState<FullContext>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true)
            const contextFetch = async () => {
                setContext(await view.getContext());
            };
            contextFetch()
                .then(() => {
                    setLoading(false)
                }).catch((e:any) => {
                    console.error(e)
                setLoading(false)
            })

    }, []);
    if (loading) {
        return (
            <div style={{ height: "100%" }}>
                <Loading />
            </div>
        );
    }
    if (context?.extension?.modal) {
         if (context?.extension?.modal.modalType === 'newSecureNote') {
             return (
                 <div>
                     <NewSecureNote accountId={context?.accountId ?? ''}/>
                 </div>
             );
         }
    }
    switch (context!.moduleKey) {
        case "forge-secure-notes-for-jira": {
            return (
                <div>
                    <Issue accountId={context?.accountId ?? ''}/>
                </div>
            );
        }
        default: {
            return (
                <CenterDiv>
                    <Button
                        height={200}
                        appearance={"primary"}
                        onClick={() => {
                            window.location.reload();
                        }}
                    >
                        RELOAD APPLICATION ${context?.moduleKey}
                    </Button>
                </CenterDiv>
            );
        }
    }
};

export default App;
