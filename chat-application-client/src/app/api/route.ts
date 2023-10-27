import { NextResponse, type NextRequest } from 'next/server'

//Mettre en place le Reverse Proxy
export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  // query is "hello" for /api/search?query=hello
  return NextResponse.json({ message: "success" })
}