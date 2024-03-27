import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import path from 'path'
import dotenv from 'dotenv'

try {
  dotenv.config()
} catch (error) {
  console.error(error)
  process.exit(1)
}
console.log(process)

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        <div>
          <Image
            className="ml-auto mr-auto"
            src="/images/logo.png"
            alt="Logo image"
            width="256"
            height="256"
          />
        </div>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/register">
          Go to Register Page
        </Link>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/chat">
          Go to chat Page
        </Link>
      </div>
    </React.Fragment>
  )
}
