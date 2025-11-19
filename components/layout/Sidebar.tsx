"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Flag,
  Settings,
  ChevronDown,
  ChevronRight,
  List,
  Plus,
  UserCheck,
  UserX,
  Send,
  RotateCcw,
  Recycle,
  Cog,
  Wrench,
  Move,
  Calendar,
  Package,
  FileText,
  BarChart3,
  User,
  Briefcase,
  LifeBuoy,
  Download,
  ChevronsLeft,
  Key,
  LogOut,
  UserCircle,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAssetsOpen, setIsAssetsOpen] = useState(true);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home, noChevron: true },
  ];

  const alertsSubmenu = [
    { label: "Assets Past Due", badge: "0", badgeColor: "bg-blue-500", href: "/dashboard/alerts/assets-past-due" },
    { label: "Leases Expiring", badge: "0", badgeColor: "bg-yellow-500", href: "/dashboard/alerts/leases-expiring" },
    { label: "Maintenance Due", badge: "1", badgeColor: "bg-purple-500", href: "/dashboard/alerts/maintenance-due" },
    { label: "Maintenance Overdue", badge: "0", badgeColor: "bg-purple-500", href: "/dashboard/alerts/maintenance-overdue" },
    { label: "Warranties Expiring", badge: "1", badgeColor: "bg-red-500", href: "/dashboard/alerts/warranties-expiring" },
  ];

  const assetsIndentedSubmenu = [
    { href: "/dashboard/assets", label: "List of Assets", icon: List },
    { href: "/dashboard/assets/add", label: "Add an Asset", icon: Plus },
  ];

  const assetsNonIndentedItems = [
    { href: "/dashboard/assets/checkout", label: "Check out", icon: UserCheck },
    { href: "/dashboard/assets/checkin", label: "Check in", icon: UserX },
  ];

  const assetsSubmenu = [
    { href: "/dashboard/assets/lease", label: "Lease", icon: Send },
    { href: "/dashboard/assets/lease-return", label: "Lease Return", icon: RotateCcw },
    { href: "/dashboard/assets/dispose", label: "Dispose", icon: Recycle },
    { href: "/dashboard/assets/maintenance", label: "Maintenance", icon: Cog },
    { href: "/dashboard/assets/move", label: "Move", icon: Move },
    { href: "/dashboard/assets/reserve", label: "Reserve", icon: Calendar },
  ];

  const otherMenuItems = [
    { href: "/dashboard/inventory", label: "Inventory", icon: Package },
    { href: "/dashboard/lists", label: "Lists", icon: FileText },
    { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
    { href: "/dashboard/tools", label: "Tools", icon: Wrench },
    { href: "/dashboard/advanced", label: "Advanced", icon: Briefcase },
    { href: "/dashboard/setup", label: "Setup", icon: Settings },
    { href: "/dashboard/help", label: "Help / Support", icon: LifeBuoy },
    { href: "/dashboard/download", label: "Download Assettiger App", icon: Download },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");
  const isAssetsActive = 
    assetsIndentedSubmenu.some((item) => isActive(item.href)) ||
    assetsNonIndentedItems.some((item) => isActive(item.href)) ||
    assetsSubmenu.some((item) => isActive(item.href));
  const isAlertsActive = alertsSubmenu.some((item) => isActive(item.href)) || isActive("/dashboard/alerts/setup");
  const isInventoryActive = isActive("/dashboard/inventory");
  const totalAlerts = alertsSubmenu.reduce((sum, item) => sum + parseInt(item.badge), 0);

  const userMenuItems = [
    { label: "My Profile", icon: UserCircle, href: "/dashboard/profile" },
    { label: "Change Password", icon: Key, href: "/dashboard/change-password" },
    { label: "Log out", icon: LogOut, href: "/logout", action: () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
      router.push("/");
    }},
    { label: "Account Details", icon: FileText, href: "/dashboard/account-details" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all h-full",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Top Section - Exozen Logo and Collapse Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Image
              src="/exozen_logo1.png"
              alt="Exozen Logo"
              width={100}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            aria-label="Toggle sidebar"
          >
            <ChevronsLeft className="h-4 w-4 text-gray-900 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="border-b border-gray-200 dark:border-gray-800" ref={userMenuRef}>
          <div 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={cn(
              "relative flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all",
              isUserMenuOpen 
                ? "bg-yellow-500" 
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            style={isUserMenuOpen ? {
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)',
              marginRight: '-8px',
              paddingRight: 'calc(0.75rem + 8px)'
            } : {}}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-gray-900 dark:text-gray-400" />
              </div>
              <span className="text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>Shivanya DN</span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              isUserMenuOpen 
                ? "text-gray-900 rotate-180" 
                : "text-gray-900 dark:text-gray-400"
            )} />
          </div>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              {userMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index}>
                    {item.action ? (
                      <button
                        onClick={() => {
                          item.action?.();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}
                      >
                        <Icon className="h-5 w-5 text-orange-500 shrink-0" />
                        <span className="text-gray-900 dark:text-gray-200">{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}
                      >
                        <Icon className="h-5 w-5 text-orange-500 shrink-0" />
                        <span className="text-gray-900 dark:text-gray-200">{item.label}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const hasBadge = 'badge' in item && item.badge;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded mb-1 transition-colors",
                active
                  ? "bg-yellow-500 text-white"
                  : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                active ? "text-white" : "text-orange-500 group-hover:text-orange-600"
              )} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>{item.label}</span>
                  {hasBadge && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '13px' }}>
                      {(item as any).badge}
                    </span>
                  )}
                  {!hasBadge && !item.noChevron && <ChevronRight className={cn(
                    "h-4 w-4",
                    active ? "text-white" : "text-gray-900"
                  )} />}
                </>
              )}
            </Link>
          );
        })}

        {/* Alerts Section */}
        <div className="mt-1">
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className={cn(
              "group w-full flex items-center gap-3 px-3 py-2 rounded mb-1 transition-colors",
              isAlertsActive
                ? "bg-yellow-500 text-white"
                : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Flag className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              isAlertsActive ? "text-white" : "text-orange-500 group-hover:text-orange-600"
            )} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>Alerts</span>
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '13px' }}>
                  {totalAlerts}
                </span>
                {isAlertsOpen ? (
                  <ChevronDown className={cn(
                    "h-4 w-4",
                    isAlertsActive ? "text-white" : "text-gray-900"
                  )} />
                ) : (
                  <ChevronRight className={cn(
                    "h-4 w-4",
                    isAlertsActive ? "text-white" : "text-gray-900"
                  )} />
                )}
              </>
            )}
          </button>
          {isAlertsOpen && !isCollapsed && (
            <div className="ml-4 mt-1 space-y-1">
              {alertsSubmenu.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors",
                      active
                        ? "bg-yellow-500 text-white"
                        : "text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></div>
                    <span className="flex-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                    <span className={cn(
                      "text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold",
                      item.badgeColor
                    )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '13px' }}>
                      {item.badge}
                    </span>
                  </Link>
                );
              })}
              
              {/* Separator */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              
              {/* Setup Alerts */}
              <Link
                href="/dashboard/alerts/setup"
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors",
                  isActive("/dashboard/alerts/setup")
                    ? "bg-yellow-500 text-white"
                    : "text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Wrench className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive("/dashboard/alerts/setup") ? "text-white" : "text-orange-500 group-hover:text-orange-600"
                )} />
                <span style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>Setup Alerts</span>
              </Link>
            </div>
          )}
        </div>

        {/* Assets Section */}
        <div className="mt-1">
          <button
            onClick={() => setIsAssetsOpen(!isAssetsOpen)}
            className={cn(
              "group w-full flex items-center gap-3 px-3 py-2 rounded transition-colors",
              isAssetsActive
                ? "bg-yellow-500 text-white"
                : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Settings className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              isAssetsActive ? "text-white" : "text-orange-500 group-hover:text-orange-600"
            )} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>Assets</span>
                {isAssetsOpen ? (
                  <ChevronDown className={cn(
                    "h-4 w-4 shrink-0",
                    isAssetsActive ? "text-white" : "text-gray-900"
                  )} />
                ) : (
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0",
                    isAssetsActive ? "text-white" : "text-gray-900"
                  )} />
                )}
              </>
            )}
          </button>
          {isAssetsOpen && !isCollapsed && (
            <div className="space-y-0">
              {/* Indented submenu items */}
              <div className="ml-4">
                {assetsIndentedSubmenu.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors",
                        active
                          ? "bg-yellow-500 text-white"
                          : "text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active ? "text-white" : "text-orange-500 group-hover:text-orange-600"
                      )} />
                      <span className={cn(
                        "transition-colors",
                        active ? "text-white" : "text-gray-900 dark:text-gray-400 group-hover:text-orange-500"
                      )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Non-indented items (Check out, Check in) */}
              <div>
                {assetsNonIndentedItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors",
                        active
                          ? "bg-yellow-500 text-white"
                          : "text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active ? "text-white" : "text-orange-500 group-hover:text-orange-600"
                      )} />
                      <span className={cn(
                        "transition-colors",
                        active ? "text-white" : "text-gray-900 dark:text-gray-400 group-hover:text-orange-500"
                      )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Indented submenu items (Lease, etc.) */}
              <div className="ml-4">
                {assetsSubmenu.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors",
                        active
                          ? "bg-yellow-500 text-white"
                          : "text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active ? "text-white" : "text-orange-500 group-hover:text-orange-600"
                      )} />
                      <span className={cn(
                        "transition-colors",
                        active ? "text-white" : "text-gray-900 dark:text-gray-400 group-hover:text-orange-500"
                      )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Other Menu Items */}
        {otherMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded mb-1 transition-colors",
                active
                  ? "bg-yellow-500 text-white"
                  : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                active ? "text-white" : "text-orange-500 group-hover:text-orange-600"
              )} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>{item.label}</span>
                  <ChevronRight className={cn(
                    "h-4 w-4",
                    active ? "text-white" : "text-gray-900"
                  )} />
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

