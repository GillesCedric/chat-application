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
	error = 401,
	notFound = 404,
}