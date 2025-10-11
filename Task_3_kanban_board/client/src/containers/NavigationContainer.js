import React, { useState } from "react";
import Wrapper from "../components/common/Wrapper/Wrapper";
import { ReactComponent as Logo } from "../assets/icons/logo.svg";
// removed global add icon/button; Add Task is now per-column
import DropDown from "../components/form/dropDown/DropDown";
import Navigation from "../components/navigation/Navigation";
import { useDispatch, useSelector } from "react-redux";
import { createNewBoard, fetchActiveBoard } from "../store/board-actions";
import Button from "../components/form/button/Button";
import CreateNewBoard from "../components/appSideBar/CreateNewBoard";
import EditDialog from "../components/common/editDialog/EditDialog";
import { signOut } from "../store/auth-actions";
import { useNavigate } from "react-router-dom";
import "../components/navigation/styles.scss";
import Avatar from "../components/navigation/Avatar";
import Toast from "../components/common/Toast/Toast";
import ProfileMenu from "../components/navigation/ProfileMenu";

export default function NavigationContainer() {
  const activeBoard = useSelector((state) => state.board.activeBoard);
  const allBoards = useSelector((state) => state.board.allBoards);
  const [showCreate, setShowCreate] = useState(false);
  const dispatch = useDispatch();
  // global Add Task removed; per-column Add opens the AddTask modal

  let boardsDropdownList = allBoards?.map((item) => ({
    id: item._id,
    value: item.title,
  }));

  const onBoardClickedHandler = (board) => {
    dispatch(fetchActiveBoard(board.id));
  };
  const toggleCreateDialog = () => setShowCreate((prev) => !prev);
  // toggleAddTaskModal removed

  const createNewBoardHandler = (boardTitle) => {
    dispatch(createNewBoard({ boardTitle }));
    toggleCreateDialog();
  };

  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const onLogout = async () => {
    await dispatch(signOut(() => {}));
    // show a short toast then navigate
    setShowLogoutToast(true);
    setTimeout(() => {
      setShowLogoutToast(false);
      navigate("/home");
    }, 700);
  };

  const [showLogoutToast, setShowLogoutToast] = useState(false);

  return (
    <>
      <Navigation>
        <Logo />
        <div className="nav-content">
          <Wrapper className="nav-board">
            <DropDown
              dataSource={boardsDropdownList}
              onItemClicked={onBoardClickedHandler}
              shouldHide={true}
              initialValue={activeBoard?.title}
            />

            <CreateNewBoard handler={toggleCreateDialog} title="New board" />

            {/* Add Task action moved to each column; no global Add button */}
          </Wrapper>

          <Wrapper className="nav-profile">
            {auth.isAuthed ? (
              <ProfileMenu
                onProfile={() => navigate("/profile")}
                onSettings={() => navigate("/settings")}
                onLogout={onLogout}
              >
                <div className="nav-button">
                  <Avatar
                    name={auth.firstName || auth.username || ""}
                    className="pulse"
                  />
                  <span style={{ marginLeft: 8 }}>
                    {auth.firstName || auth.username || "Account"}
                  </span>
                </div>
              </ProfileMenu>
            ) : (
              <Button title="Sign In" onClick={() => navigate("/home")} />
            )}
          </Wrapper>
        </div>
      </Navigation>
      {showLogoutToast && (
        <Toast
          message="Signed out"
          duration={1200}
          onClose={() => setShowLogoutToast(false)}
        />
      )}
      {/* AddTaskContainer is opened from BoardView per-column flow */}
      {showCreate && (
        <EditDialog
          onClose={toggleCreateDialog}
          onSubmit={createNewBoardHandler}
          title="Enter title for board"
        />
      )}
    </>
  );
}
