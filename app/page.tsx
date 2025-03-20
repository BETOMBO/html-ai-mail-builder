'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PlusIcon, DocumentIcon } from '@heroicons/react/24/outline';
import Layout from './components/layout/Layout';
import { useSession } from 'next-auth/react';

interface Template {
  id: string;
  name: string;
  html: string;
  css: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        setTemplates(data.slice(0, 2)); // Only take the first 2 templates
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    if (session) {
      fetchTemplates();
    }
  }, [session]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Beautiful Email Templates with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Design professional email templates in minutes, powered by artificial intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative group"
          >
            <Link
              href="/editor"
              className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors duration-150"
            >
              <PlusIcon className="h-12 w-12 text-gray-400 group-hover:text-indigo-500" />
              <span className="mt-2 text-sm font-medium text-gray-900">Start from Scratch</span>
            </Link>
          </motion.div>

          {templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <Link href={`/editor?id=${template.id}`}>
                <div className="relative h-64 bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <DocumentIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">
                      Last modified: {new Date(template.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/templates"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Explore Now
          </Link>
        </div>

        <footer className="mt-16 border-t border-gray-200 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Follow Us</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="https://twitter.com" className="text-base text-gray-500 hover:text-gray-900">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">More Apps</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Quiz Canvas AI
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
} 