import { AVATAR_IDENTIFIERS, BEGINING_URL_AVATAR } from "../utils/keywords";
export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase(); // Ensures initials are in uppercase
};

export const Avatar = ({
  avatar,
  fullname,
}: {
  avatar: string;
  fullname: string;
  }) => {
/*  console.log(BEGINING_URL_AVATAR +" espace" + avatar.split("/").pop());
 */
/*   console.log(avatar);
 */  return (
     <>
       {avatar.split("/").pop() === AVATAR_IDENTIFIERS.none ? (
         <div className=" relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-grey-lighter rounded-full dark:bg-gray-600">
           <span className="font-bold text-sm text-blue-700 dark:text-gray-300">
             {getInitials(fullname)}
           </span>
         </div>
       ) : (
         <img
           className="h-12 w-12 rounded-full object-cover"
           src={BEGINING_URL_AVATAR + avatar.split("/").pop()}
           alt={fullname}
         />
       )}
     </>
   );
};
