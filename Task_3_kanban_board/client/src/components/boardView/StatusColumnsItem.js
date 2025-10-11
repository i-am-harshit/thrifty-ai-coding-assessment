import React from "react";
import MoreOptions from "../common/moreOptions/MoreOptions";
import TaskListItem from "./TaskListItem";
import "./styles.scss";

export default function StatusColumnsItem({
  dataSource,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onListEdit,
  onListDelete,
  onCardDrop,
  onAddTaskForList,
}) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const listEditHandler = () => {
    onListEdit({ id: dataSource._id, title: dataSource.title });
  };
  const listDeleteHandler = () => {
    onListDelete({ id: dataSource._id, title: dataSource.title });
  };

  const onDropHandler = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      try {
        console.debug("drop: types:", [...e.dataTransfer.types]);
      } catch (err) {}
      // try common types in order
      let raw = null;
      try {
        raw =
          e.dataTransfer.getData("application/json") ||
          e.dataTransfer.getData("text/plain") ||
          e.dataTransfer.getData("text/html") ||
          e.dataTransfer.getData("text");
      } catch (err) {
        raw = null;
      }
      // fallback to global drag payload if dataTransfer is restricted
      if (!raw && window.__dragPayload) {
        raw = JSON.stringify(window.__dragPayload);
        console.debug(
          "drop: using window.__dragPayload fallback",
          window.__dragPayload
        );
      }
      if (!raw) return;
      let payload = raw;
      if (typeof raw === "string") {
        try {
          payload = JSON.parse(raw);
        } catch (err) {
          // raw may already be an object or a simple id; attempt to normalize
          payload = { cardId: raw };
        }
      }
      if (onCardDrop) {
        console.debug("drop: parsed payload", payload);
        onCardDrop({
          ...payload,
          toListId: dataSource._id,
          boardId: dataSource.boardId,
        });
      }
    } catch (err) {
      // noop
    }
  };

  const onDragOverHandler = (e) => {
    e.preventDefault();
    try {
      e.dataTransfer.dropEffect = "move";
    } catch (err) {}
    try {
      // show a visual cue in debug console
      console.debug("dragover: types:", [...e.dataTransfer.types]);
    } catch (err) {}
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
    try {
      console.debug("dragenter: types:", [...e.dataTransfer.types]);
    } catch (err) {}
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      console.debug("dragleave");
    } catch (err) {}
  };

  const addTaskForList = () => {
    if (onAddTaskForList) onAddTaskForList({ listId: dataSource._id });
  };

  return (
    <li
      className={`status-columns-list-item ${isDragOver ? "is-drag-over" : ""}`}
      onDrop={onDropHandler}
      onDragOver={onDragOverHandler}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <div className="status-columns-list-header">
        <p className="status-title">{dataSource.title}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={addTaskForList}
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            +
          </button>
          <MoreOptions
            datasource={[
              { title: "Edit", handler: listEditHandler },
              { title: "Delete", handler: listDeleteHandler },
            ]}
          />
        </div>
      </div>
      <ul className="task-list">
        {dataSource.cards.map((item) => (
          <TaskListItem
            key={item._id}
            dataSource={item}
            onTaskClick={onTaskClick}
            onTaskEdit={onTaskEdit}
            onTaskDelete={onTaskDelete}
          />
        ))}
      </ul>
    </li>
  );
}
