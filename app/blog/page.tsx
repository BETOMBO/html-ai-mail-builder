'use client';

import React from 'react';
import Link from 'next/link';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

export default function BlogMaintenance() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-8">
          <WrenchScrewdriverIcon className="h-16 w-16 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Under Maintenance
        </h1>
        <p className="text-gray-600 mb-8">
          Our blog section is currently undergoing maintenance. We're working hard to bring you fresh content soon!
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 