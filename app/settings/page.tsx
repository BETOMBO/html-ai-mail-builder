'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { useSession } from 'next-auth/react';

interface Plan {
  name: string;
  price: string;
  features: string[];
  tokens: number;
  isPopular?: boolean;
  isCurrent?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free Plan',
    price: '$0',
    tokens: 5,
    features: [
      'Limited access',
      '5 tokens per month',
      'Basic email templates',
      'Community support'
    ]
  },
  {
    name: 'Starter Plan',
    price: '$15',
    tokens: 250,
    features: [
      'Full access',
      '250 tokens per month',
      'Premium AI model',
      'Priority email support'
    ],
    isPopular: true
  },
  {
    name: 'Pro Plan',
    price: '$40',
    tokens: 1000,
    features: [
      'Everything in Starter',
      '1,000 tokens per month',
      'Removes branding',
      'API access'
    ]
  },
  {
    name: 'Premium Plan',
    price: '$99',
    tokens: 3000,
    features: [
      'Everything in Pro',
      '3,000 tokens per month',
      'Premium support',
      'Custom features'
    ]
  }
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackDetails, setFeedbackDetails] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [userGenerations, setUserGenerations] = useState(0);
  const [currentPlan, setCurrentPlan] = useState('Free Plan');
  const [nextRenewal, setNextRenewal] = useState<Date | null>(null);

  useEffect(() => {
    // Debug environment variables
    console.log('Environment Check:', {
      hasDatabaseUrl: !!process.env.NEXT_PUBLIC_DATABASE_URL,
      hasDirectUrl: !!process.env.NEXT_PUBLIC_DIRECT_URL,
      nodeEnv: process.env.NODE_ENV
    });

    // Fetch user's subscription data
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/user/subscription');
          const data = await response.json();
          setUserGenerations(data.generations);
          setCurrentPlan(data.subscription);
          setNextRenewal(new Date(data.nextRenewal));
        } catch (error) {
          console.error('Error fetching subscription data:', error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleUpgrade = async (planName: string) => {
    try {
      const response = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planName }),
      });

      if (!response.ok) {
        throw new Error('Failed to upgrade plan');
      }

      const data = await response.json();
      setUserGenerations(data.generations);
      setCurrentPlan(data.subscription);
      setNextRenewal(new Date(data.nextRenewal));
    } catch (error) {
      console.error('Error upgrading plan:', error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle feedback submission
    console.log('Submitting feedback...');
  };

  // Update plans with current status
  const plansWithStatus = plans.map(plan => ({
    ...plan,
    isCurrent: plan.name === currentPlan
  }));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Token Information */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Available Generations</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your current generation balance and subscription details
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-indigo-600">{userGenerations}</p>
                <p className="text-sm text-gray-500">generations remaining</p>
              </div>
            </div>
            {nextRenewal && (
              <p className="mt-4 text-sm text-gray-500">
                Next renewal: {nextRenewal.toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Account Management */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Change Password
                </h3>
                <svg
                  className={`h-5 w-5 text-gray-400 transform transition-transform ${
                    showPasswordForm ? 'rotate-180' : ''
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <AnimatePresence>
                {showPasswordForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6"
                  >
                    <form onSubmit={handleChangePassword} className="space-y-6">
                      {passwordError && (
                        <div className="rounded-md bg-red-50 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">{passwordError}</h3>
                            </div>
                          </div>
                        </div>
                      )}
                      {passwordSuccess && (
                        <div className="rounded-md bg-green-50 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-green-800">{passwordSuccess}</h3>
                            </div>
                          </div>
                        </div>
                      )}
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="current-password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          minLength={6}
                        />
                      </div>
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="new-password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          minLength={6}
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                            isSubmitting
                              ? 'bg-indigo-400 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </>
                          ) : (
                            'Change Password'
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Subscription Plans */}
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-8">
              Subscription Plans
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {plansWithStatus.map((plan) => (
                <motion.div
                  key={plan.name}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-lg border ${
                    plan.isCurrent 
                      ? 'border-green-500 ring-2 ring-green-500'
                      : plan.isPopular 
                      ? 'border-indigo-500' 
                      : 'border-gray-200'
                  } bg-white p-6 shadow-sm`}
                >
                  {plan.isPopular && !plan.isCurrent && (
                    <div className="absolute -top-2 -right-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Popular
                      </span>
                    </div>
                  )}
                  {plan.isCurrent && (
                    <div className="absolute -top-2 -right-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Current Plan
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </p>
                  <p className="mt-4 text-sm text-gray-500">
                    {plan.tokens.toLocaleString()} tokens per month
                  </p>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex">
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => !plan.isCurrent && handleUpgrade(plan.name)}
                    disabled={plan.isCurrent}
                    className={`mt-8 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      plan.isCurrent
                        ? 'bg-green-500 cursor-not-allowed'
                        : plan.isPopular
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {plan.isCurrent ? 'Current Plan' : 'Upgrade'}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Feedback Form */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Submit Feedback
              </h3>
              <form onSubmit={handleSubmitFeedback} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="feedback-title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="feedback-title"
                    value={feedbackTitle}
                    onChange={(e) => setFeedbackTitle(e.target.value)}
                    placeholder="Short, descriptive title"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="feedback-details" className="block text-sm font-medium text-gray-700">
                    Details
                  </label>
                  <textarea
                    id="feedback-details"
                    rows={4}
                    value={feedbackDetails}
                    onChange={(e) => setFeedbackDetails(e.target.value)}
                    placeholder="Additional description"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 