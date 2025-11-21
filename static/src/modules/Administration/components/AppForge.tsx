import { ReactNode, useEffect, useState } from "react";
import { view } from "@forge/bridge";
import { Action, History, Location } from "history";
import { Router } from "react-router";
import Loading from "@src/components/Loading";

const AppForge = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<History>();

  useEffect(() => {
    view
      .createHistory()
      .then((newHistory: History) => {
        setHistory(newHistory);
      })
      .catch((e) => console.error(e.message, e));
  }, []);

  const [historyState, setHistoryState] = useState<{
    action: Action;
    location: Location;
  }>();

  useEffect(() => {
    if (!historyState && history) {
      setHistoryState({
        action: history.action,
        location: history.location,
      });
    }
  }, [history, historyState]);

  useEffect(() => {
    if (history) {
      history.listen((location, action) => {
        setHistoryState({
          action,
          location,
        });
      });
    }
  }, [history]);

  return (
    <div>
      {history && historyState ? (
        // @ts-expect-error unknown issue
        <Router
          navigator={history}
          navigationType={historyState.action}
          location={historyState.location}
        >
          {children}
        </Router>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default AppForge;
