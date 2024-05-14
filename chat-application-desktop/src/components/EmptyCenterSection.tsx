/**
 * Le composant EmptyCenterSection affiche une section centrale lorsque le contenu est vide.
 * Il affiche un message principal et un paragraphe supplémentaire pour guider l'utilisateur.
 * 
 * @module components/EmptyCenterSection
 */

import React from "react";

/**
 * Composant EmptyCenterSection.
 * 
 * Affiche une section centrale lorsque le contenu est vide.
 * Il affiche un message principal et un paragraphe supplémentaire pour guider l'utilisateur.
 * 
 * @param message Le message principal à afficher.
 * @param smallParagraph Le paragraphe supplémentaire à afficher.
 * @returns {JSX.Element} Le composant EmptyCenterSection.
 */
export const EmptyCenterSection = ({
  message,
  smallParagraph,
}: {
  /**
   * Le message principal à afficher dans la section centrale lorsque le contenu est vide.
   */
  message: string;
  /**
   * Le paragraphe supplémentaire à afficher dans la section centrale lorsque le contenu est vide.
   * Il peut contenir des détails complémentaires, des instructions ou des conseils pour l'utilisateur.
   */
  smallParagraph: string;
}): JSX.Element => {
  return (
    <div
      className="w-full h-full flex items-center flex-wrap justify-center gap-10"
    >
      <div className="">
        <img
          className="w-42 h-12 mx-auto"
          style={{ filter: "drop-shadow(2px 4px 6px gray)" }}
          src="https://cdn2.iconfinder.com/data/icons/outline-web-application-1/20/cart-512.png"
          alt="belt"
        />
        <div>
          <h2 className="text-center text-black text-xl font-semibold leading-loose pb-2">
            {message}
          </h2>
          <p className="text-center text-black text-base font-normal leading-relaxed pb-4">
            {smallParagraph}
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};
