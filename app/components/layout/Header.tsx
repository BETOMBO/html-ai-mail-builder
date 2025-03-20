'use client';

import React from 'react';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import TokenBalance from '../TokenBalance';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">EmailCanvasAI</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <TokenBalance />
            
            <Link
              href="/settings#plans"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <StarIcon className="h-5 w-5 mr-2" />
              <span>Free Plan - Upgrade</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 