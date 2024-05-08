import React from "react";
import { getDateDivider } from "../utils/utilsFunctions";

export const DateDivider = ({ date } : {date : Date}) => {
  return (
    <div className="text-center text-black text-sm my-2 ">{getDateDivider(date)}</div>
  );
};

