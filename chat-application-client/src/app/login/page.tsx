import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center justify-center h-screen bg-blue-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-6 text-blue-600">Login</h2>
          
          <form>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600 text-sm font-medium">Username</label>
              <input type="text" id="username" name="username" className="w-full p-2 border rounded"/>
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600 text-sm font-medium">Password</label>
              <input type="password" id="password" name="password" className="w-full p-2 border rounded"/>
            </div>
            
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue" >Log in</button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">Don't have an account?</p>
            <Link className="text-blue-500 hover:underline" href="/signup">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    
    </main>
  )
}
