import { ToastContainer, toast } from 'react-toastify'
export type NotificationType = "info" | "success" | "warning" | "error" | "default"
export const notify = (message: string, type: NotificationType = "default") => toast(message, {
	type: type
}) // Définir la fonction notify pour afficher la notification toast