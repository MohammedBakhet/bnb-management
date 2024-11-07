'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaHome } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { PiBrowsersLight } from 'react-icons/pi';
import { MdOutlineBookmark } from 'react-icons/md';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left Section: Logo and Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link href="/">
            <h1 className="text-2xl font-bold text-purple-600">Anfield Properties.</h1>
          </Link>
          <nav className="space-x-6 flex">
            <Link href="/" className="text-gray-700 hover:text-purple-600 flex items-center space-x-2">
              <FaHome className="text-3xl text-gray-800" />
              <span>Home</span>
            </Link>
            <Link href="/filter" className="text-gray-700 hover:text-purple-600 flex items-center space-x-2">
              <PiBrowsersLight className="text-3xl text-gray-800" />
              <span>Browse by</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-purple-600 flex items-center space-x-2">
                  <CgProfile className="text-3xl text-gray-800" />
                  <span>Profile</span>
                </Link>
                <Link href="/booking" className="text-gray-700 hover:text-purple-600 flex items-center space-x-2">
                  <MdOutlineBookmark className="text-3xl text-gray-800" />
                  <span>Booking</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Section: User Profile */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              <span className="text-gray-700">
                Welcome: {user.name}{' '}
                {isAdmin && <span className="text-red-600 font-bold">(Admin)</span>}
              </span>
              <Link href="/profile">
                <img
                 
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-black bg-black object-cover"
                />
              </Link>
              <button onClick={logout} className="text-gray-700 hover:text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-purple-600">
                Login
              </Link>
              <Link href="/register" className="text-gray-700 hover:text-purple-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
