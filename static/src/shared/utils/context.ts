// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

// helpers
import { FullContext, view } from "@forge/bridge";

export const getForgeContext = () => view.getContext();

export const getAppUrl = (context: FullContext) => {
  const appUrlParts = context.localId.split("/");
  return `${appUrlParts[1]}/${appUrlParts[2]}/view/`;
};
