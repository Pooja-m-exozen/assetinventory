"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  List,
  Plus,
  User,
  ChevronDown,
  FileText,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const isAssetsActive = pathname?.startsWith("/assets");
  const isInventoryActive = pathname?.startsWith("/inventory");
  const isListsActive = pathname?.startsWith("/lists");
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
          <button className={cn(
            "flex items-center gap-1 p-1.5 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          )}>
            <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-900 dark:text-gray-400" />
            </div>
            <ChevronDown className="h-3 w-3 text-gray-900 dark:text-gray-400" />
          </button>
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

