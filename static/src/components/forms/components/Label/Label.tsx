// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

// libs
import React from "react";

// models
import { LabelProps } from "./models";

// components
import { RequiredAsterisk } from "@atlaskit/form";

const Label = ({ id, isRequired, label, onClick }: LabelProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <label
      htmlFor={id}
      className="mb-1 text-xs font-semibold text-at-text-subtle"
      onKeyDown={onClick ? handleKeyDown : undefined}
      onClick={onClick}
    >
      {label}
      {isRequired && <RequiredAsterisk />}
    </label>
  );
};

export default Label;
