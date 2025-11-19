"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/about" className={cn("hover:text-gray-900 dark:hover:text-gray-200 transition-colors")}>
            About Us
          </Link>
          <Link href="/terms" className={cn("hover:text-gray-900 dark:hover:text-gray-200 transition-colors")}>
            Terms of Service
          </Link>
          <Link href="/privacy" className={cn("hover:text-gray-900 dark:hover:text-gray-200 transition-colors")}>
            Privacy Policy
          </Link>
          <Link href="/contact" className={cn("hover:text-gray-900 dark:hover:text-gray-200 transition-colors")}>
            Contact
          </Link>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          2025 © Asset by Exozen
        </div>
      </div>
    </footer>
  );
}

