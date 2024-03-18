export enum Method {
	options = 'OPTIONS',
	head = 'HEAD',
	get = 'GET',
	post = 'POST',
	put = 'PUT',
	delete = 'DELETE',
}

export enum Code {
	okay = 200,
	created = 201,
	updated = 202,
	deleted = 204,
	unauthorized = 401, //For Token
	notFound = 404,
	serviceUnavailable = 503,
	forbidden = 403, //For Basic Authentication
	internalError = 500,
	badRequest = 422,
}

export const protocol = () => process.env.NODE_ENV == "development" ? "http" : "https"