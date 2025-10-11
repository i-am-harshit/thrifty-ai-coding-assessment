import React from "react";
import "./styles.scss";

export default function Home({ children }) {
  return <section className="home-pane">{children}</section>;
}
