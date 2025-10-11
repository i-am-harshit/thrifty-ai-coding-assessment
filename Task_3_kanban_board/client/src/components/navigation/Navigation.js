import React from "react";
import "./styles.scss";

export default function Navigation({ children }) {
  return <nav className="navigation-pane">{children}</nav>;
}
