import React, { useEffect } from "react";
import styled from "@emotion/styled/macro";

const ToastWrap = styled.div`
  position: fixed;
  right: 16px;
  top: 64px;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 0.6em 0.9em;
  border-radius: 6px;
  font-weight: 600;
  z-index: 9999;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  transform-origin: right top;
  animation: toast-in 220ms ease;

  @keyframes toast-in {
    from {
      transform: translateY(-6px) scale(0.98);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

export default function Toast({ message = "", duration = 2400, onClose }) {
  useEffect(() => {
    const t = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  if (!message) return null;
  return <ToastWrap>{message}</ToastWrap>;
}
