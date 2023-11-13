import * as _Cookies from 'cookies-next'

/**
 * @class Cookies
 * @author Gilles Cédric
 * @description this class is used to manage the cookies in the application
 * @exports
 * @default
 * @since 23/05/2022
 */
export default class Cookies {

	/**
	 * @property duration {new _Cookies()}
	 * @description the _Cookies instance
	 * @private
	 * @static
	 * @readonly
	 * @type {number}
	 */
	private static readonly duration: number = 60 * 60 * 24

	/**
	 * @method get
	 * @description this method is used to get a specific cookies in the navigator
	 * @param {string} name the name of the cookies
	 * @public
	 * @static
	 * @readonly
	 * @returns {any} the cookies
	 */
	public static readonly get = (name: string): any => {
		return _Cookies.getCookie(name)
	}

	/**
	 * @method getAll
	 * @description this method is used to get all the cookies in the navigator
	 * @public
	 * @static
	 * @readonly
	 * @returns {any} the cookies
	 */
	public static readonly getAll = (): any => {
		return _Cookies.getCookies()
	}

	/**
	 * @method set
	 * @description this method is used to set a specific cookies in the navigator
	 * @param {string} name the name of the cookies
	 * @param {string | number} value the value of the cookies
	 * @public
	 * @static
	 * @readonly
	 * @returns {void} the cookies
	 */
	public static readonly set = (name: string, value: string | number): void => {
		return _Cookies.setCookie(name, value, {maxAge: this.duration})
	}

	/**
	 * @method remove
	 * @description this method is used to get all the cookies in the navigator
	 * @param {string} name the name of the cookies
	 * @public
	 * @static
	 * @readonly
	 * @returns {void} the cookies
	 */
	public static readonly remove = (name: string): void => {
		return _Cookies.deleteCookie(name)
	}
}