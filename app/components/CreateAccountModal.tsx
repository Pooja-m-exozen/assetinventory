"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    projectName: string;
  };
  token?: string;
}

export default function CreateAccountModal({ isOpen, onClose, onSwitchToSignIn }: CreateAccountModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreeToTerms) {
      setError("Please agree to the Terms & Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://digitalasset.zenapi.co.in/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
          role: "admin",
          projectName: "Exozen",
        }),
      });

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      if (data.success) {
        // Store token if present
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        // Store user info
        if (data.user) {
          localStorage.setItem("userEmail", data.user.email);
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userRole", data.user.role);
          localStorage.setItem("projectName", data.user.projectName);
        }

        setSuccess(data.message || "Registration successful!");
        
        // Close modal and redirect after a short delay
        setTimeout(() => {
          onClose();
          router.push("/dashboard");
        }, 1500);
      } else {
        throw new Error(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-account-title"
    >
      <div
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 mt-8 mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="Close modal"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 id="create-account-title" className="mb-2 text-center text-xl font-semibold text-gray-900 dark:text-gray-50">
          Create an Exozen Account
        </h2>

        {/* Existing Account Link */}
        <div className="mb-5 text-center">
          <a
            href="#existing-account"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Need to be added as a user to an existing account?
          </a>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 rounded border border-green-300 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="mb-1 block text-sm text-gray-800 dark:text-gray-200">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="mb-1 block text-sm text-gray-800 dark:text-gray-200">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-gray-800 dark:text-gray-200">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-gray-800 dark:text-gray-200">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm text-gray-800 dark:text-gray-200">
              Re-type Your Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start pt-1">
            <input
              id="agreeToTerms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mr-2 mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
              required
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-800 dark:text-gray-200">
              I Agree to the{" "}
              <a href="#terms" className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400">
                Terms
              </a>{" "}
              &{" "}
              <a href="#privacy" className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400">
                Privacy Policy
              </a>
              .
            </label>
          </div>

          {/* reCAPTCHA Placeholder */}
          <div className="rounded border border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="recaptcha"
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="recaptcha" className="text-sm text-gray-800 dark:text-gray-200">
                I'm not a robot
              </label>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>reCAPTCHA</span>
              <span className="text-blue-600 dark:text-blue-400">Privacy</span>
              <span>-</span>
              <span className="text-blue-600 dark:text-blue-400">Terms</span>
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              reCAPTCHA is changing its terms of service. Take action.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-yellow-500 px-5 py-2 text-sm font-medium text-gray-800 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

