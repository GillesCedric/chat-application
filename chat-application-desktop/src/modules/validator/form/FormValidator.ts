/**
 * Ce code définit une classe FormValidator avec des méthodes statiques pour valider différents types de données de formulaire. Les méthodes incluent la vérification de chaînes vides, de longueurs minimales, de formats d'email, de nombres français, de mots de passe forts, et de l'égalité des valeurs. Chaque méthode retourne un booléen indiquant si la validation a réussi ou non.
 * @module modules/Validator/Validator
 */
export default class FormValidator {
  /**
   * Préfixes des numéros de téléphone français.
   */
  public static readonly FR_NUMBER_STARTER = ["06", "07"];

  /**
   * Vérifie si au moins un des arguments est une chaîne vide.
   * @param args Les valeurs à vérifier.
   * @returns true si au moins un argument est vide, sinon false.
   */
  public static readonly oneEmpty = (...args: any[]): boolean => {
    if (args.length === 0) return true;
    return args.some((arg) => arg === "");
  };

  /**
   * Vérifie si une chaîne est vide.
   * @param value La valeur à vérifier.
   * @returns true si la chaîne est vide, sinon false.
   */
  public static readonly isEmpty = (value: string): boolean => {
    return value === "" ? true : false;
  };

  /**
   * Vérifie si une chaîne a une longueur minimale.
   * @param minimumLength La longueur minimale requise.
   * @param value La valeur à vérifier.
   * @returns true si la chaîne a une longueur suffisante, sinon false.
   */
  public static readonly hasMininmumLength = (
    minimumLength: number,
    value: string
  ): boolean => {
    return value.length >= minimumLength ? true : false;
  };

  /**
   * Vérifie si une chaîne a un format d'email valide.
   * @param email L'email à vérifier.
   * @returns true si l'email a un format valide, sinon false.
   */
  public static readonly hasEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email !== "" && emailRegex.test(email) ? true : false;
  };

  /**
   * Vérifie si une chaîne contient uniquement des chiffres.
   * @param value La valeur à vérifier.
   * @returns true si la chaîne contient uniquement des chiffres, sinon false.
   */
  public static readonly containsOnlyDigit = (value: string): boolean => {
    return /^\d+$/.test(value) ? true : false;
  };

  /**
   * Vérifie si un numéro de téléphone est français.
   * @param number Le numéro de téléphone à vérifier.
   * @returns true si le numéro de téléphone est français, sinon false.
   */
  public static readonly isFrNumber = (number: string): boolean => {
    return (
      this.FR_NUMBER_STARTER.some(
        (prefix) => number.startsWith(prefix) && number.length === 10
      )
    );
  };

  /**
   * Vérifie si un mot de passe est fort.
   * @param password Le mot de passe à vérifier.
   * @returns true si le mot de passe est fort, sinon false.
   */
  public static readonly isValidPassword = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    )
      ? true
      : false;
  };

  /**
   * Vérifie si toutes les valeurs sont égales.
   * @param args Les valeurs à comparer.
   * @returns true si toutes les valeurs sont égales, sinon false.
   */
  public static readonly areSame = (...args: any[]): boolean => {
    if (args.length === 0) return true;
    const firstValue = args[0];
    return args.every((arg) => arg === firstValue);
  };
}
