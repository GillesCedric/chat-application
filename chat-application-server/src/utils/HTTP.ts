import https from 'https'
import fs from 'fs'
import path from 'path'
import { Services } from './Keywords'
import { Crypto } from '../modules/crypto/Crypto'

export enum Method {
	options = 'OPTIONS',
	head = 'HEAD',
	get = 'GET',
	post = 'POST',
	put = 'PUT',
	patch = 'PATCH',
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

export const httpsAgent = (service: Services) => new https.Agent({
	requestCert: true,
	rejectUnauthorized: true,
	key: fs.readFileSync(path.join(process.cwd(), 'certs', service, `${service}-key.pem`)),
	cert: fs.readFileSync(path.join(process.cwd(), 'certs', service, `${service}-cert.pem`)),
	ca: fs.readFileSync(path.join(process.cwd(), 'certs', 'ca', 'ca-cert.pem')),
})

export const headers: () => HeadersInit = () =>  {
	return {
		accept: "application/json",
		"content-type": "application/json; charset=utf-8",
		["authorization"]: "Basic " + Crypto.encode(`${process.env.BASIC_APP_USERNAME}:${process.env.BASIC_APP_PASSWORD}`),
		credentials: 'include'
	}
}