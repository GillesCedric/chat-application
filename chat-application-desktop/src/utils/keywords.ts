export enum SocketKeywords {
  join = "join",
  connection = "connection",
  disconnect = "disconnect",
  newNotification = "new-notification",
  newConversation = "new-conversation",
  newMessage = "new-message",
  emit = "emit",
}
export enum NotificationTypes {
  success = "success",
  error = "errro",
  warning = "warning",
}

export enum FriendsRequestStatus {
  pending = "PENDING",
  accepted = "ACCEPTED",
  rejected = "REJECTED",
  deleted = "DELETED",
}

export const DEFAULT_COMMENT =
  "Hey there 👋🏾. \n I want to get in touch with you, let's chat. ";

export const BEGINING_URL = "https://chat-communication/data/users"; 
export const AVATAR_DEFAULT = "/default/profile/undefined"; 
export const AVATAR_IDENTIFIER = {
  man: 0, 
  girl : 1
}