import React from "react";
import useClickOutside from "../../hooks/useClickOutside";
import "./profile-menu.scss";

export default function ProfileMenu({
  onProfile,
  onSettings,
  onLogout,
  children,
}) {
  const [open, setOpen] = React.useState(false);
  const domNode = useClickOutside(() => setOpen(false));

  return (
    <div className="profile-menu-wrap" ref={domNode}>
      <div onClick={() => setOpen((s) => !s)}>{children}</div>
      {open && (
        <div className="profile-menu-pane">
          <div
            className="profile-menu-item"
            onClick={() => {
              setOpen(false);
              if (onProfile) onProfile();
            }}
          >
            Profile
          </div>
          <div
            className="profile-menu-item"
            onClick={() => {
              setOpen(false);
              if (onSettings) onSettings();
            }}
          >
            Settings
          </div>
          <div
            className="profile-menu-item"
            onClick={() => {
              setOpen(false);
              if (onLogout) onLogout();
            }}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
}
