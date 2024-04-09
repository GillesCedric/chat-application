import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <React.Fragment>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        <div>
          {/* <image
            className="ml-auto mr-auto"
            src="/images/logo.png"
            alt="Logo image"
            width="256"
            height="256"
          /> */}
        </div>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center text-red-600">
        <Link to="/register">
          Go to Register Page
        </Link>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link to="/chatPage">
          Go to chat Page
        </Link>
      </div>
    </React.Fragment>
  )
}
