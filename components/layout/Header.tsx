"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  List,
  Plus,
  User,
  ChevronDown,
  FileText,
  Sun,
  Moon,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const isAssetsActive = pathname?.startsWith("/assets");
  const isInventoryActive = pathname?.startsWith("/inventory");
  const isListsActive = pathname?.startsWith("/lists");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = () => {
    // Add your logout logic here
    // For example: clear tokens, redirect to login, etc.
    console.log("Logging out...");
    // router.push("/login");
    setIsProfileDropdownOpen(false);
  };
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 h-16 flex items-center">
      <div className="flex items-center justify-between w-full">
        {/* Navigation */}
        <div className="flex items-center gap-6">
          {/* Top Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/assets"
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 text-sm font-bold text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors",
                isAssetsActive && "border-b-2 border-yellow-500"
              )}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}
            >
              <List className="h-4 w-4 text-gray-900 dark:text-gray-300" />
              <span className="font-bold">Assets</span>
            </Link>
            <Link
              href="/assets/add"
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 text-sm font-bold text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              )}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}
            >
              <Plus className="h-4 w-4 text-gray-900 dark:text-gray-300" />
              <span className="font-bold">Asset</span>
            </Link>
            <Link
              href="/inventory/list"
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 text-sm font-bold text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors",
                isInventoryActive && "border-b-2 border-yellow-500"
              )}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}
            >
              <List className="h-4 w-4 text-gray-900 dark:text-gray-300" />
              <span className="font-bold">Inventory</span>
            </Link>
            <Link
              href="/inventory/add"
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 text-sm font-bold text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              )}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}
            >
              <Plus className="h-4 w-4 text-gray-900 dark:text-gray-300" />
              <span className="font-bold">Inventory</span>
            </Link>
            <Link
              href="/lists/assets"
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 text-sm font-bold text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors",
                isListsActive && "border-b-2 border-yellow-500"
              )}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}
            >
              <FileText className="h-4 w-4 text-gray-900 dark:text-gray-300" />
              <span className="font-bold">Lists</span>
            </Link>
          </nav>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={cn(
              "flex items-center justify-center w-9 h-9 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            )}
            aria-label="Toggle theme"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className={cn(
                "flex items-center gap-1 p-1.5 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              )}
            >
              <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-900 dark:text-gray-400" />
              </div>
              <ChevronDown className={cn(
                "h-3 w-3 text-gray-900 dark:text-gray-400 transition-transform",
                isProfileDropdownOpen && "rotate-180"
              )} />
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  <UserCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span>Settings</span>
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
          <button className={cn(
            "flex items-center gap-1 p-1.5 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          )}>
            <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center">
              <ChevronDown className="h-3 w-3 text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

