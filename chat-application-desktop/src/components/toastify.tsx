import { Zoom, toast } from "react-toastify";
export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "default";
export const notify = (
  message: string,
  type: NotificationType = "default",
  callback?: () => void
) =>
  toast(message, {
    type: type,
    position: "top-right",
    autoClose: 2000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Zoom,
    onClose: () => {
      if (callback) callback();
    },
  });
