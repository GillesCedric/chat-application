import { Zoom, toast } from "react-toastify";
export const NotifyAsync = (
  pendingMessage: string,
  successMessage: string,
  errorMessage: string,
  asyncFuction: () => Promise<any>
) => {
  toast.promise(
    asyncFuction(),
    {
      pending: pendingMessage,
      success: successMessage,
      error: errorMessage,
    },
    {
      position: "top-right",
      autoClose: 2000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      transition: Zoom,
    }
  );
};
