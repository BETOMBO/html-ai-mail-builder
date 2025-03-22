'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PaperAirplaneIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function LandingPage() {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">
                EmailHTMLGen
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                Blog
              </Link>
              <Link href="/templates" className="text-gray-600 hover:text-gray-900">
                Templates
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Making beautiful emails easy for everyone
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you're building from scratch or customizing pre-made templates, EmailHTMLGen helps you create stunning, responsive emails in minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try it now
          </Link>
        </div>
      </section>

      {/* Prompt Input Area */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Generate Email Html to market my product"
              className="flex-1 border-0 focus:ring-0 text-gray-900 placeholder-gray-500"
            />
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <PhotoIcon className="h-5 w-5" />
            </button>
            <select className="border-0 focus:ring-0 text-gray-900 bg-gray-50 rounded-md">
              <option>Premium</option>
            </select>
            <button className="p-2 text-indigo-600 hover:text-indigo-700">
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Generated Preview Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
              {/* Placeholder for email preview image */}
              <div className="w-full h-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                <span className="text-gray-400">Email Preview</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Introducing EmailHTMLGen
              </h2>
              <p className="text-gray-600">
                Experience the best way to market your business with stunning email templates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 