/**
 * Le composant DateDivider affiche une séparation visuelle entre les messages d'une conversation,
 * indiquant la date à laquelle les messages ont été envoyés.
 * 
 * @module components/DateDivider
 */

import React from "react";
import { getDateDivider } from "../utils/utilsFunctions";

/**
 * Composant DateDivider.
 * 
 * Affiche une séparation visuelle entre les messages d'une conversation,
 * indiquant la date à laquelle les messages ont été envoyés.
 * 
 * @param date La date à afficher.
 * @returns {JSX.Element} Le composant DateDivider.
 */
export const DateDivider = ({ date }: { date: Date }): JSX.Element => {
  return (
    <div className="text-center text-black text-sm my-2 ">{getDateDivider(date)}</div>
  );
};
