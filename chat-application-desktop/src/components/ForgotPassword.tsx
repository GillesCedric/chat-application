/**
 * Le composant ForgotPassword représente la page permettant aux utilisateurs de réinitialiser leur mot de passe.
 * Il comprend un formulaire où les utilisateurs peuvent saisir leur adresse e-mail pour recevoir un lien de réinitialisation.
 * Le composant effectue également une validation de base sur l'e-mail saisi avant de soumettre le formulaire.
 * 
 * @module components/ForgotPassword
 */

import React, { useRef, useState } from "react";
import FormValidator from "../modules/validator/form/FormValidator";
import { Link } from "react-router-dom";
import { NotifyAsync } from "./NotifyAsync";
import { ToastContainer } from "react-toastify";

/**
 * Composant ForgotPassword.
 * 
 * Affiche un formulaire de réinitialisation de mot de passe et vérifie la validité de l'e-mail avant de soumettre le formulaire.
 * 
 * @returns {JSX.Element} Le composant ForgotPassword.
 */
const ForgotPassword = (): JSX.Element => {
  const [email, setEmail] = useState<string>(""); // État pour stocker l'email de l'utilisateur
  const [errorMessage, setErrorMessage] = useState<string>(""); // État pour stocker le message d'erreur de validation de l'email
  const emailRef = useRef<HTMLInputElement>(null); // Référence pour l'input email
  const emailErrorRef = useRef<HTMLDivElement>(null); // Référence pour le message d'erreur

  /**
   * Vérifie la validité de l'email saisi.
   * 
   * @returns {boolean} True si l'email est valide, sinon false.
   */
  const checkEmail = (): boolean => {
    setErrorMessage("");
    const emailValue = email.trim();
    if (FormValidator.hasEmailFormat(emailValue)) {
      if (emailErrorRef.current) {
        emailErrorRef.current.className = "hidden";
      }
      return true;
    } else {
      if (FormValidator.isEmpty(emailValue)) {
        setErrorMessage("This field cannot be empty!");
      } else {
        setErrorMessage("Email should match this format: name@domain.org");
      }
      if (emailErrorRef.current) {
        emailErrorRef.current.className = "block";
      }
      return false;
    }
  };

  /**
   * Gère la soumission du formulaire.
   * 
   * @param {React.FormEvent<HTMLFormElement>} event - L'événement de soumission du formulaire.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkEmail()) {
      // Proceed with form submission
			console.log("Email is valid:", email);
    }
  };

  return (
    <body className="bg-grey-lighter">
      <ToastContainer />
      <main
        id="content"
        role="main"
        className="w-full max-w-lg bg-gray-100 mx-auto p-6 flex flex-col justify-center h-screen"
      >
        <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Forgot password?
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Remember your password?
                <a
                  className="text-blue-600 decoration-2 hover:underline font-medium"
                  href="#"
                >
                  Login here
                </a>
              </p>
            </div>

            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        required
                        value={email}
                        placeholder="xyz@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        ref={emailRef}
                      />
                      <div ref={emailErrorRef} className="hidden">
                        <p className="text-sm text-red-600 dark:text-red-500">
                          {errorMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  >
                    Reset password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <p className="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-gray-700">
          <Link
            to="/register"
            className="pr-3.5 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-blue-600 dark:text-gray-500 dark:hover:text-gray-200"
          >
            Register instead ?
          </Link>
          <Link
            className="pl-3 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-blue-600 dark:text-gray-500 dark:hover:text-gray-200"
            to="/signIn" //TODO mettre la bonne route
          >
            Contact us!
          </Link>
        </p>
      </main>
    </body>
  );
};

export default ForgotPassword;
