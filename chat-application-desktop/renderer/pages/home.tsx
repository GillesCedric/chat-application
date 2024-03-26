import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

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
            width="256px"
            height="256px"
          />
        </div>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/register">
          <a className="btn-blue">Go to Register Page</a>
        </Link>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/chat">
          <a className="btn-blue">Go to chat Page</a>
        </Link>
      </div>
    </React.Fragment>
  )
}
