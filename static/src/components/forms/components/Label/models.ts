// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

// libs
import { ReactNode } from "react";

export interface LabelProps {
  id?: string;
  isRequired?: boolean;
  label: string | ReactNode;
  onClick?: () => void;
}
