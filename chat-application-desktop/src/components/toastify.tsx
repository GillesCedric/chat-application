import { toast } from 'react-toastify'
export type NotificationType = "info" | "success" | "warning" | "error" | "default"
export const notify = (
	message: string,
	type: NotificationType = "default",
	callback?: () => void,
) => toast(
	message,
	{
		type: type, 
		onClose: () => {
			if (callback) callback();
		}
}) 