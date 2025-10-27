import StatusColumnsItem from "./StatusColumnsItem";
import "./styles.scss";

export default function StatusColumns({
  dataSource,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onListEdit,
  onListDelete,
  onCardDrop,
  onAddTaskForList,
}) {
  let content = null;

  if (dataSource) {
    content = dataSource?.lists.map((item, index) => {
      return (
        <StatusColumnsItem
          key={item._id}
          dataSource={item}
          onTaskClick={onTaskClick}
          onTaskEdit={onTaskEdit}
          onTaskDelete={onTaskDelete}
          onListEdit={onListEdit}
          onListDelete={onListDelete}
          onCardDrop={onCardDrop}
          onAddTaskForList={onAddTaskForList}
        />
      );
    });
  }
  return <ul className="status-columns-list">{content}</ul>;
}
