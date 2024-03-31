export default class FormValidator {
  public static readonly FR_NUMBER_STARTER = ["06", "07"];

  public static readonly oneEmpty = (...args: any[]): boolean => {
    if (args.length === 0) return true;
    return args.some((arg) => arg === "");
  };

  public static readonly isEmpty = (value :string): boolean => {
		return value === "" ? true : false;
	};
	
  public static readonly hasMininmumLength = (
    minimumLength: number,
    value: string
  ): boolean => {
    return value.length >= minimumLength ? true : false;
  };

  public static readonly hasEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email !== "" && emailRegex.test(email) ? true : false;
  };

	public static readonly containsOnlyDigit = (value: string): boolean => {
    return /^\d+$/.test(value) ? true : false;
  };

	public static readonly isFrNumber = (number: string): boolean => {
		return this.FR_NUMBER_STARTER.some((prefix) =>
			number.startsWith(prefix) &&
			number.length === 10
		);
  };

  public static readonly isValidPassword = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    )
      ? true
      : false;
  };

  public static readonly areSame = (...args: any[]): boolean => {
    if (args.length === 0) return true;
    const firstValue = args[0];
    return args.every((arg) => arg === firstValue);
  };
}