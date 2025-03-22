'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HomeIcon, DocumentDuplicateIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/outline';
import { useSession, signOut } from 'next-auth/react';

const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'My Templates', href: '/templates', icon: DocumentDuplicateIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();


  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-white">EmailHTMLGen</div>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                }`}
                aria-hidden="true"
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.span>
            </Link>
          );
        })}
      </nav>
      
      {/* User Profile Section */}
      <div className="border-t border-gray-700 p-4">
        {status === 'loading' ? (
          <div className="flex items-center justify-center py-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
          </div>
        ) : status === 'authenticated' && session?.user ? (
          <div className="flex flex-col items-start space-y-3">
            <div className="flex items-center space-x-3">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-gray-300" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {session.user.name || 'User'}
                </span>
                <span className="text-xs text-gray-400">
                  {session.user.email}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
} 