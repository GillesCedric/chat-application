import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Implement your signup logic here
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center justify-center h-screen bg-blue-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-6 text-blue-600">Sign Up</h2>

          <form >
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-600 text-sm font-medium">
                Name
              </label>
              <input type="text" id="name" name="name" className="w-full p-2 border rounded" />
            </div>

            <div className="mb-4">
              <label htmlFor="surname" className="block text-gray-600 text-sm font-medium">
                Surname
              </label>
              <input type="text" id="surname" name="surname" className="w-full p-2 border rounded" />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 text-sm font-medium">
                Email
              </label>
              <input type="email" id="email" name="email" className="w-full p-2 border rounded" />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-600 text-sm font-medium">
                Phone Number
              </label>
              <input type="tel" id="phone" name="phone" className="w-full p-2 border rounded" />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
            >
              Sign Up
            </button>
          </form>

          {/* Login link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">Already have an account?</p>
            <Link className="text-blue-500 hover:underline" to="/login">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
