import { CountdownTimeDelta } from "react-countdown/dist/utils";
import React from "react";

export const Renderer = (delta: CountdownTimeDelta) => {
  const { seconds, hours, minutes, completed, days } = delta;
  if (completed) {
    return <span>Expired!</span>;
  } else {
    let time = "";
    if (days) {
      time += `${days} day${days > 1 ? "s" : ""} `;
    }
    if (hours) {
      time += `${String(hours).padStart(2, "0")}:`;
    }
    if (minutes) {
      time += `${String(minutes).padStart(2, "0")}:`;
    }
    time += String(seconds).padStart(2, "0");
    return <span>{time}</span>;
  }
};
export const RendererText = (delta: CountdownTimeDelta, callback?: () => void) => {
  const { seconds, hours, minutes, completed, days } = delta;
  if (completed) {
    if (callback) {
      callback();
    }
    return <span>Expired!</span>;
  } else {
    let time = "";
    if (days) {
      time += `${days} day${days > 1 ? "s" : ""} `;
    }
    if (hours) {
      time += `${String(hours)} hour${hours > 1 ? "s" : ""} `;
    }
    if (minutes) {
      time += `${String(minutes)} minute${minutes > 1 ? "s" : ""} `;
    }
    time += `${String(seconds)} second${seconds > 1 ? "s" : ""} `;
    return <span>{time}</span>;
  }
};
