"use client";

import Image from "next/image";
import { useState } from "react";
import SignInModal from "./components/SignInModal";
import CreateAccountModal from "./components/CreateAccountModal";
import AnimatedHeadline from "./components/AnimatedHeadline";

export default function Home() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);

  const openSignIn = () => {
    setIsCreateAccountOpen(false);
    setIsSignInOpen(true);
  };

  const openCreateAccount = () => {
    setIsSignInOpen(false);
    setIsCreateAccountOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans dark:bg-black">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/exozen_logo.png"
            alt="Exozen logo"
            width={40}
            height={40}
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
          <span className="text-lg sm:text-xl font-bold">
            <span className="text-gray-800 dark:text-gray-200">EXO</span>
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-green-400">
              ZEN
            </span>
          </span>
        </div>
        <nav className="hidden items-center justify-center gap-4 lg:gap-6 text-sm font-medium text-gray-800 dark:text-gray-200 lg:flex flex-1" aria-label="Main navigation">
          <a href="#home" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors whitespace-nowrap">HOME</a>
          <a href="#reviews" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors whitespace-nowrap border-b-2 border-yellow-500 pb-1">REVIEWS</a>
          <a href="#features" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors whitespace-nowrap">FEATURES</a>
          <a href="#apps" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors whitespace-nowrap">APPS</a>
          <a href="#benefits" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors whitespace-nowrap">BENEFITS</a>
          <a href="#pricing" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors whitespace-nowrap">PRICING</a>
          <a href="#faqs" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors whitespace-nowrap">FAQS</a>
          <a href="#contact" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors whitespace-nowrap">CONTACT US</a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={openCreateAccount}
            className="rounded-full border-2 border-yellow-500 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-800 transition-colors hover:bg-yellow-50 dark:border-yellow-400 dark:bg-black dark:text-gray-200 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 whitespace-nowrap"
            aria-label="Create new account"
          >
            <span className="hidden sm:inline">CREATE NEW ACCOUNT</span>
            <span className="sm:hidden">CREATE ACCOUNT</span>
          </button>
          <button
            onClick={openSignIn}
            className="rounded-full bg-yellow-500 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-800 transition-colors hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 whitespace-nowrap"
            aria-label="Sign in"
          >
            SIGN IN
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:px-12">
        <div className="flex flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Side - Logo */}
          <div className="flex-1 flex justify-center lg:justify-start w-full lg:w-auto">
            <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
              <Image
                src="/exozen_logo.png"
                alt="Exozen logo"
                width={400}
                height={400}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left w-full">
            <AnimatedHeadline />
            
            <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 dark:text-gray-400">
              Exozen makes it easy to track, manage, and audit your assets - from IT equipment to tools, vehicles, and furniture - all in one clean, web-based platform.
            </p>
            
            <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 dark:text-gray-400">
              Exozen is trusted by thousands of customers to stay organized, reduce loss, and simplify audits.
            </p>

            {/* Features List */}
            <ul className="space-y-2 sm:space-y-3 text-left" role="list">
              <li className="flex items-start gap-2 sm:gap-3">
                <svg className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Unlimited Customer Reports - Generate comprehensive reports for all your assets
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <svg className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  QR Code Scanning - Quick and accurate asset identification
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <svg className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Maintenance Scheduling - Plan and track asset maintenance efficiently
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <svg className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Checkin and Checkout - Track asset movement and usage
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <svg className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Cloud Based - Access your data from anywhere, anytime
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <svg className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Unlimited User Configurable Emails - Customize notifications for your team
                </span>
              </li>
            </ul>

            {/* Testimonial Link */}
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <div className="flex gap-1" aria-label="5 star rating">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <a href="#reviews" className="text-xs sm:text-sm text-blue-600 hover:underline dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded">
                Click here to see what real users are saying
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={openCreateAccount}
                className="rounded-full border-2 border-yellow-500 bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-800 transition-colors hover:bg-yellow-50 dark:border-yellow-400 dark:bg-black dark:text-gray-200 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 w-full sm:w-auto"
                aria-label="Sign up for Exozen"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="mt-12 sm:mt-20 border-t border-gray-200 py-8 sm:py-12 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 text-center lg:px-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">Exozen Users</h2>
        </div>
      </footer>

      {/* Help Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500/50 dark:bg-teal-600"
          aria-label="Need Help?"
        >
          <span className="text-lg sm:text-xl font-bold">?</span>
        </button>
      </div>

      {/* Modals */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSwitchToSignUp={openCreateAccount}
      />
      <CreateAccountModal
        isOpen={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
        onSwitchToSignIn={openSignIn}
      />
    </div>
  );
}
