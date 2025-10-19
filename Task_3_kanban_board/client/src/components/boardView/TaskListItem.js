import Card from "../common/Card/Card";
import CardSubTitle from "../common/Card/CardSubTitle";
import CardTitle from "../common/Card/CardTitle";
import MoreOptions from "../common/moreOptions/MoreOptions";
import "./styles.scss";

export default function TaskListItem({
  dataSource,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
}) {
  const numOfSubTasks = dataSource.checkList.length;
  let numOfCompletedSubTask = 0;

  dataSource.checkList.forEach((subtask) => {
    if (subtask.isCompleted) numOfCompletedSubTask++;
  });

  const onClickHandler = () => {
    onTaskClick(dataSource);
  };

  const onDragStart = (e) => {
    const payloadObj = {
      cardId: dataSource._id,
      fromListId: dataSource.listId,
      boardId: dataSource.boardId,
    };
    const payload = JSON.stringify(payloadObj);
    // debug: help inspect what gets written during dragstart
    try {
      console.debug("dragstart: types before set:", [...e.dataTransfer.types]);
    } catch (err) {}
    // set multiple data types for broader compatibility
    try {
      e.dataTransfer.setData("application/json", payload);
    } catch (err) {}
    try {
      e.dataTransfer.setData("text/plain", payload);
    } catch (err) {}
    try {
      e.dataTransfer.setData("text/html", payload);
    } catch (err) {}
    try {
      e.dataTransfer.setData("text", payload);
    } catch (err) {}
    // mark allowed effect
    try {
      e.dataTransfer.effectAllowed = "move";
    } catch (err) {}
    try {
      console.debug("dragstart: types after set:", [...e.dataTransfer.types]);
      console.debug("dragstart: payload", payloadObj);
    } catch (err) {}
    try {
      // global fallback for environments that don't expose dataTransfer across contexts
      // store minimal payload
      window.__dragPayload = payloadObj;
    } catch (err) {}
  };

  const onDragEnd = (e) => {
    try {
      console.debug("dragend: types:", [...e.dataTransfer.types]);
    } catch (err) {}
    try {
      // clear global fallback
      if (
        window.__dragPayload &&
        window.__dragPayload.cardId === dataSource._id
      ) {
        window.__dragPayload = null;
      }
    } catch (err) {}
  };

  const taskEditHandler = (e) => {
    e.stopPropagation();
    onTaskEdit(dataSource);
  };

  const taskDeleteHandler = (e) => {
    e.stopPropagation();
    onTaskDelete(dataSource);
  };

  return (
    <Card
      width="320px"
      onClick={onClickHandler}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="task-list-item-title">
        <CardTitle>{dataSource.title}</CardTitle>
        <MoreOptions
          datasource={[
            { title: "Edit", handler: taskEditHandler },
            { title: "Delete", handler: taskDeleteHandler },
          ]}
        />
      </div>
      <CardSubTitle>{`${numOfCompletedSubTask} of ${numOfSubTasks} subtasks`}</CardSubTitle>
    </Card>
  );
}
