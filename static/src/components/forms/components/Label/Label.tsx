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
