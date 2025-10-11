import React from "react";
import "./styles.scss";

export default function BoardView({ children }) {
  return <section className="board-view-pane">{children}</section>;
}
