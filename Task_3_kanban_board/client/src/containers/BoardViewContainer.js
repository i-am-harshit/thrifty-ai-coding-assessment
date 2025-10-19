import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddNewColumn from "../components/boardView/AddNewColumn";
import BoardView from "../components/boardView/BoardView";
import StatusColumns from "../components/boardView/StatusColumns";
import AddTaskContainer from "./AddTaskContainer";
import Wrapper from "../components/common/Wrapper/Wrapper";
import ViewTaskContainer from "./ViewTaskContainer";
import { getUserThemePref } from "../helpers/helpers";
import EditDialog from "../components/common/editDialog/EditDialog";
import EditTaskContainer from "./EditTaskContainer";
import {
  createNewList,
  deleteCard,
  deleteList,
  updateList,
  updateCardData,
} from "../store/board-actions";
import { boardActions } from "../store/board-slice";

export default function BoardViewContainer() {
  const activeBoard = useSelector((state) => state.board.activeBoard);
  const dispatch = useDispatch();
  const [showTask, setShowTask] = useState(false);
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const isDark = getUserThemePref();
  const [showEdit, setShowEdit] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [currentEditTask, setCurrentEditTask] = useState(null);
  const statusList = activeBoard?.lists.map((list) => list.title);

  const taskItemClickHandler = (task) => {
    setCurrentTask(task);
    setShowTask((prev) => !prev);
  };
  const toggleShowEdit = () => setShowEdit((prev) => !prev);
  const toggleShowEditTask = () => setShowEditTaskDialog((prev) => !prev);
  const toggleShowTask = () => setShowTask((prev) => !prev);
  const toggleShowCreateList = () => setShowCreateList((prev) => !prev);

  const taskItemEditHandler = (task) => {
    setCurrentEditTask(task);
    toggleShowEditTask();
  };
  const taskItemDeleteHandler = (task) => {
    dispatch(deleteCard({ cardId: task._id, boardId: task.boardId }));
  };
  const listItemEditHandler = (title) => {
    dispatch(
      updateList({ title, listId: editingList.id, boardId: activeBoard._id })
    );
    toggleShowEdit();
  };
  const createNewColumnHandler = (title) => {
    dispatch(createNewList({ title, boardId: activeBoard._id }));
    toggleShowCreateList();
  };
  const listItemDeleteHandler = (list) => {
    dispatch(deleteList({ listId: list.id, boardId: activeBoard._id }));
  };

  // handle drop from a card into a list
  const onCardDrop = (payload) => {
    // payload: { cardId, fromListId, toListId, boardId }
    try {
      console.debug("onCardDrop: received payload", payload);
    } catch (err) {}
    if (!payload || !payload.cardId) return;

    // ensure cardToMove is available outside try block
    let cardToMove = null;

    // optimistic UI update: move card locally first
    try {
      const fromId = payload.fromListId;
      const toId = payload.toListId;
      const cardId = payload.cardId;
      const currentBoard = JSON.parse(JSON.stringify(activeBoard));
      if (currentBoard && currentBoard.lists) {
        // remove from source list
        currentBoard.lists = currentBoard.lists.map((list) => {
          if (list._id === fromId) {
            const filtered = list.cards.filter((c) => {
              if (c._id === cardId) {
                cardToMove = c;
                return false;
              }
              return true;
            });
            return { ...list, cards: filtered };
          }
          return list;
        });
        // add to target list (append at end)
        currentBoard.lists = currentBoard.lists.map((list) => {
          if (list._id === toId && cardToMove) {
            return {
              ...list,
              cards: [...list.cards, { ...cardToMove, listId: toId }],
            };
          }
          return list;
        });

        // dispatch local change
        dispatch(boardActions.changeActiveBoard(currentBoard));
      }
    } catch (err) {
      console.debug("optimistic move failed", err);
    }

    // if we didn't find the card during the optimistic transform, try to find it in the current activeBoard
    if (!cardToMove && activeBoard && activeBoard.lists) {
      for (const list of activeBoard.lists) {
        const found = list.cards.find((c) => c._id === payload.cardId);
        if (found) {
          cardToMove = found;
          break;
        }
      }
    }

    // optimistic: call updateCardData to set listId (send actual card fields so server validation passes)
    dispatch(
      updateCardData({
        _id: payload.cardId,
        listId: payload.toListId,
        boardId: activeBoard._id,
        title: cardToMove ? cardToMove.title : "",
        description: cardToMove ? cardToMove.description : "",
        checkList: cardToMove ? cardToMove.checkList : [],
      })
    );
  };

  const onAddTaskForList = ({ listId }) => {
    // open the AddTask modal and set initial list
    setShowEditTaskDialog(false); // ensure not editing
    setShowTask(false);
    setShowAddTaskForList({ open: true, listId });
  };

  const [showAddTaskForList, setShowAddTaskForList] = useState({
    open: false,
    listId: null,
  });

  const onListEdit = (task) => {
    setEditingList(task);
    toggleShowEdit();
  };

  return (
    <>
      <Wrapper bgColor={isDark ? "#282836" : "#F3F8FF"} minHeight="100%">
        <BoardView>
          <StatusColumns
            dataSource={activeBoard}
            onTaskClick={taskItemClickHandler}
            onTaskEdit={taskItemEditHandler}
            onTaskDelete={taskItemDeleteHandler}
            onListEdit={onListEdit}
            onListDelete={listItemDeleteHandler}
            onCardDrop={onCardDrop}
            onAddTaskForList={onAddTaskForList}
          />
          <AddNewColumn onAddColumn={toggleShowCreateList} />
        </BoardView>
      </Wrapper>

      {showTask && (
        <ViewTaskContainer
          task={currentTask}
          onClose={toggleShowTask}
          statusList={statusList}
        />
      )}

      {showEdit && (
        <EditDialog
          onClose={toggleShowEdit}
          onSubmit={listItemEditHandler}
          title="Edit list name"
        />
      )}

      {showCreateList && (
        <EditDialog
          onClose={toggleShowCreateList}
          onSubmit={createNewColumnHandler}
          title="Create new list"
        />
      )}
      {showEditTaskDialog && (
        <EditTaskContainer
          task={currentEditTask}
          onClose={toggleShowEditTask}
        />
      )}
      {showAddTaskForList.open && (
        <AddTaskContainer
          onClose={() => setShowAddTaskForList({ open: false, listId: null })}
          initialListId={showAddTaskForList.listId}
        />
      )}
    </>
  );
}
