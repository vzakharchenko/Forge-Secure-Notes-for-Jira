// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { ReactNode, useEffect, useState } from "react";
import { view } from "@forge/bridge";
import { Action, History, Location } from "history";
import { NavigationType, Router } from "react-router";
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
        <Router
          navigator={history}
          navigationType={historyState.action as unknown as NavigationType}
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
