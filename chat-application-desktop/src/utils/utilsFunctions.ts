export const getTime = (dateString?: string): string => {
  const now = dateString ? new Date(dateString) : new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${paddedMinutes}`;
};

export const convertToDate = (isoString: string): Date => {
  return new Date(isoString);
};

export const convertToYesterday = (isoString: string): Date => {
  const date = new Date(isoString);
  date.setDate(date.getDate() - 100);
  return date;
};

export const getDateDivider = (date: Date): string => {
  if (typeof date === "string" || isNaN(date.getTime())) {
    return "";
  }
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  let dateText = "";
  if (date.toDateString() === today.toDateString()) {
    dateText = "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    dateText = "Yesterday";
  } else if (date >= startOfWeek(today)) {
    dateText = date.toLocaleDateString("en-US", { weekday: "long" });
  } else {
    dateText = date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }
  return dateText;
};

const startOfWeek = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(date.setDate(diff));
};

// Helper function to format date
export const formatDate = (dateString : string) => {
  const date = new Date(dateString);
  const today = new Date();
  if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
    return "TODAY";
  } else {
    return date.toLocaleDateString(); // Adjust this to your locale and format preferences
  }
};

// Function to determine if a new date divider should be added
export const needsDateDivider = (currentMessage : any, previousMessage : any) => {
  if (!previousMessage) return true; // Always add a divider for the first message

  const currentDate = new Date(currentMessage.createdAt).setHours(0, 0, 0, 0);
  const previousDate = new Date(previousMessage.createdAt).setHours(0, 0, 0, 0);
/*   console.log(currentMessage , previousMessage)
 */  return currentDate !== previousDate;
};
