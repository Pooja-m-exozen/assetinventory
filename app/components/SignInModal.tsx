"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    projectName: string;
    projects: Array<{
      projectId: {
        _id: string;
        name: string;
        code: string;
        status: string;
      };
      projectName: string;
      projectCode: string;
      role: string;
      accessLevel: string;
      isActive: boolean;
      _id: string;
      assignedAt: string;
    }>;
    primaryProject: {
      projectId: {
        _id: string;
        name: string;
        code: string;
        status: string;
      };
      projectName: string;
      projectCode: string;
      role: string;
      accessLevel: string;
      isActive: boolean;
      _id: string;
      assignedAt: string;
    };
    status: string;
  };
}

export default function SignInModal({ isOpen, onClose, onSwitchToSignUp }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("https://digitalasset.zenapi.co.in/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed. Please check your credentials.");
      }

      // Store token
      if (data.token) {
        if (rememberMe) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("rememberMe", "true");
        } else {
          sessionStorage.setItem("authToken", data.token);
        }
      }

      // Store user info
      if (data.user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("projectName", data.user.projectName);
        localStorage.setItem("userStatus", data.user.status);

        // Store projects data
        if (data.user.projects) {
          localStorage.setItem("userProjects", JSON.stringify(data.user.projects));
        }

        // Store primary project
        if (data.user.primaryProject) {
          localStorage.setItem("primaryProject", JSON.stringify(data.user.primaryProject));
          localStorage.setItem("currentProjectId", data.user.primaryProject.projectId._id);
          localStorage.setItem("currentProjectName", data.user.primaryProject.projectName);
          localStorage.setItem("currentProjectCode", data.user.primaryProject.projectCode);
        }
      }

      setIsLoading(false);
      onClose();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-title"
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 mt-8 mb-8"
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
        <h2 id="signin-title" className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-50">
          Sign In
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="signin-email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="signin-password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full rounded border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-gray-400 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
            </label>
            <a
              href="#forgot-password"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button and Create Account Link */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={onSwitchToSignUp}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Create An Account
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-yellow-500 px-6 py-2 text-sm font-medium text-gray-800 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Login with your Google or social media account
          </p>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

