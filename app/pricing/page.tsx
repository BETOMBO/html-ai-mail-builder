'use client';

import React from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/outline';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started with email templates',
    features: [
      '5 templates per month',
      'Basic email customization',
      'Standard support',
      'Community access',
    ],
    cta: 'Get Started',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For professionals who need more power and flexibility',
    features: [
      'Unlimited templates',
      'Advanced customization',
      'Priority support',
      'AI-powered suggestions',
      'Custom branding',
      'Analytics dashboard',
    ],
    cta: 'Start Free Trial',
    href: '/signup?plan=pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with custom needs',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'Team collaboration',
      'Advanced analytics',
      'API access',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl shadow-sm p-8 ${
                tier.featured
                  ? 'bg-white ring-2 ring-indigo-600'
                  : 'bg-white'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-indigo-600 text-white">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">{tier.name}</h2>
                <p className="mt-4 text-gray-600">{tier.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                </p>
                <Link
                  href={tier.href}
                  className={`mt-8 block w-full rounded-md px-6 py-3 text-center font-medium ${
                    tier.featured
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
              <ul className="mt-8 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-indigo-600" />
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need a custom plan?
          </h2>
          <p className="text-gray-600 mb-8">
            Contact our sales team for a custom quote tailored to your needs.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
} 