/**
 * Le composant DateDivider affiche une séparation visuelle entre les messages d'une conversation,
 * indiquant la date à laquelle les messages ont été envoyés.
 * 
 * @module components/DateDivider
 */


import React from "react";
import { getDateDivider } from "../utils/utilsFunctions";

export const DateDivider = ({ date }: { date: Date }) => {
  return (
    <div className="text-center text-black text-sm my-2 ">{getDateDivider(date)}</div>
  );
};

