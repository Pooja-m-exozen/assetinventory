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
  Info,
  Phone,
  Heart,
  Smile,
  Play,
  Star,
  Clock,
  MapPin,
  Navigation,
  Grid3x3,
  Database,
  Grid,
  ListOrdered,
  LayoutDashboard,
  Mail,
  Users,
  Shield,
  Upload,
  ImageIcon,
  FileCheck,
  PenTool,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAssetsOpen, setIsAssetsOpen] = useState(true);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isDatabasesOpen, setIsDatabasesOpen] = useState(false);
  const [isCustomizeFormsOpen, setIsCustomizeFormsOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home, noChevron: true },
  ];

  const alertsSubmenu = [
    { label: "Assets Past Due", badge: "0", badgeColor: "bg-gray-500", href: "/dashboard/alerts/assets-past-due" },
    { label: "Leases Expiring", badge: "0", badgeColor: "bg-[#FF8C00]", href: "/dashboard/alerts/leases-expiring" },
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

  const helpSubmenu = [
    { href: "/dashboard/help/about-us", label: "About Us", icon: Info },
    { href: "/dashboard/help/contact-us", label: "Contact Us", icon: Phone },
    { href: "/dashboard/help/terms-of-service", label: "Terms of Service", icon: Heart },
    { href: "/dashboard/help/privacy-policy", label: "Privacy Policy", icon: Smile },
  ];

  const advancedSubmenu = [
    { href: "/dashboard/advanced/persons-employees", label: "Persons/Employees", icon: Users },
    { href: "/dashboard/advanced/customers", label: "Customers", icon: Users },
    { href: "/dashboard/advanced/users", label: "Users", icon: User },
    { href: "/dashboard/advanced/security-groups", label: "Security Groups", icon: Shield },
  ];

  const toolsSubmenu = [
    { href: "/dashboard/tools/import", label: "Import", icon: Upload },
    { href: "/dashboard/tools/export", label: "Export", icon: Download },
    { href: "/dashboard/tools/documents-gallery", label: "Documents Gallery", icon: FileText },
    { href: "/dashboard/tools/image-gallery", label: "Image Gallery", icon: ImageIcon },
    { href: "/dashboard/tools/audit", label: "Audit", icon: PenTool },
  ];

  const databasesSubmenu = [
    { href: "/dashboard/setup/databases/assets-table", label: "Assets Table" },
    { href: "/dashboard/setup/databases/persons-employees", label: "Persons/Employees" },
    { href: "/dashboard/setup/databases/customers-table", label: "Customers Table" },
    { href: "/dashboard/setup/databases/maintenance-table", label: "Maintenance Table" },
    { href: "/dashboard/setup/databases/warranties-table", label: "Warranties Table" },
    { href: "/dashboard/setup/databases/contract-table", label: "Contract Table" },
  ];

  const customizeFormsSubmenu = [
    { href: "/dashboard/setup/customize-forms/asset-form", label: "Asset Form" },
    { href: "/dashboard/setup/customize-forms/person-employee", label: "Person/Employee" },
    { href: "/dashboard/setup/customize-forms/customer-form", label: "Customer Form" },
    { href: "/dashboard/setup/customize-forms/maintenances-form", label: "Maintenances Form" },
    { href: "/dashboard/setup/customize-forms/warranty-form", label: "Warranty Form" },
    { href: "/dashboard/setup/customize-forms/contract-form", label: "Contract Form" },
  ];

  const setupSubmenu = [
    { href: "/dashboard/setup/company-info", label: "Company Info.", icon: Briefcase },
    { href: "/dashboard/setup/sites", label: "Sites", icon: MapPin },
    { href: "/dashboard/setup/locations", label: "Locations", icon: Navigation },
    { href: "/dashboard/setup/categories", label: "Categories", icon: List },
    { href: "/dashboard/setup/departments", label: "Departments", icon: Grid3x3 },
    { href: "/dashboard/setup/events", label: "Events", icon: Calendar },
    { href: "/dashboard/setup/table-options", label: "Table Options", icon: Grid },
    { href: "/dashboard/setup/inventory", label: "Inventory", icon: Package },
    { href: "/dashboard/setup/options", label: "Options", icon: ListOrdered },
    { href: "/dashboard/setup/manage-dashboard", label: "Manage Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/setup/customize-forms", label: "Customize Forms", icon: FileText },
    { href: "/dashboard/setup/customize-emails", label: "Customize Emails", icon: Mail },
  ];

  const otherMenuItems = [
    { href: "/dashboard/inventory", label: "Inventory", icon: Package },
    { href: "/dashboard/lists", label: "Lists", icon: FileText },
    { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  ];

  const downloadMenuItem = [
    { href: "/dashboard/download", label: "Download AssetExozen App", icon: Download, externalUrl: "https://play.google.com/store/apps/details?id=com.assettiger.app" },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      // Dashboard should only be active when pathname is exactly "/dashboard"
      return pathname === href;
    }
    return pathname === href || pathname?.startsWith(href + "/");
  };
  const isAssetsActive = 
    assetsIndentedSubmenu.some((item) => isActive(item.href)) ||
    assetsNonIndentedItems.some((item) => isActive(item.href)) ||
    assetsSubmenu.some((item) => isActive(item.href));
  const isAlertsActive = alertsSubmenu.some((item) => isActive(item.href)) || isActive("/dashboard/alerts/setup");
  // Only mark Help as active if pathname actually starts with /dashboard/help
  const isHelpActive = pathname?.startsWith("/dashboard/help") && helpSubmenu.some((item) => isActive(item.href));
  const isAdvancedActive = advancedSubmenu.some((item) => isActive(item.href));
  const isToolsActive = toolsSubmenu.some((item) => isActive(item.href));
  const isDatabasesActive = databasesSubmenu.some((item) => isActive(item.href));
  const isCustomizeFormsActive = customizeFormsSubmenu.some((item) => isActive(item.href));
  // Setup is only active if on a setup page AND not on a help page
  const isSetupActive = !isHelpActive && (setupSubmenu.some((item) => isActive(item.href)) || isDatabasesActive || isCustomizeFormsActive);
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

  // Auto-open Help/Support submenu when a help page is active (but don't auto-close)
  useEffect(() => {
    if (isHelpActive) {
      setIsHelpOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Auto-open Advanced submenu when an advanced page is active (but don't auto-close)
  useEffect(() => {
    if (isAdvancedActive) {
      setIsAdvancedOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Auto-open Tools submenu when a tools page is active (but don't auto-close)
  useEffect(() => {
    if (isToolsActive) {
      setIsToolsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all h-full",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Top Section - Exozen and Collapse Button */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-base font-bold text-gray-900 text-center flex-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Exozen
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Toggle sidebar"
          >
            <ChevronsLeft className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="border-b border-gray-200" ref={userMenuRef}>
          <div 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all hover:bg-gray-50"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-sm text-gray-900 font-medium" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>Shivanya DN</span>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
          </div>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="bg-white border-t border-gray-100">
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
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}
                      >
                        <Icon className="h-5 w-5 text-[#A52A2A] shrink-0" />
                        <span className="text-gray-900">{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors no-underline"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px', textDecoration: 'none' }}
                      >
                        <Icon className="h-5 w-5 text-[#A52A2A] shrink-0" />
                        <span className="text-gray-900">{item.label}</span>
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
      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 transition-colors no-underline",
                active
                  ? "bg-[#FF8C00] text-white"
                  : "text-gray-900 hover:bg-gray-50"
              )}
              style={{ textDecoration: 'none', color: active ? 'white' : '#000000' }}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0",
                active ? "text-white" : "text-[#A52A2A]"
              )} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: active ? 'white' : '#000000' }}>{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </>
              )}
            </Link>
          );
        })}

        {/* Alerts Section */}
        <Link
          href="/dashboard/alerts"
          className={cn(
            "relative flex items-center gap-3 px-3 py-2.5 transition-colors no-underline",
            isAlertsActive
              ? "bg-[#FF8C00] text-white"
              : "bg-white hover:bg-gray-50"
          )}
          style={{ textDecoration: 'none', color: isAlertsActive ? 'white' : '#000000' }}
        >
          <Flag className={cn(
            "h-5 w-5 shrink-0",
            isAlertsActive ? "text-white" : "text-[#A52A2A]"
          )} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: isAlertsActive ? 'white' : '#000000' }}>Alerts</span>
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '12px' }}>
                1
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </>
          )}
        </Link>
          {isAlertsOpen && !isCollapsed && (
            <div className="ml-4 mt-1 space-y-1">
              {alertsSubmenu.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors no-underline",
                      active
                        ? "bg-[#FF8C00] text-white"
                        : "text-gray-900 hover:bg-gray-100"
                    )}
                    style={{ textDecoration: 'none', color: active ? 'white' : '#000000' }}
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
              <div className="border-t border-gray-200 my-1"></div>
              
              {/* Setup Alerts */}
              <Link
                href="/dashboard/alerts/setup"
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors no-underline",
                  isActive("/dashboard/alerts/setup")
                    ? "bg-[#FF8C00] text-white"
                    : "text-gray-900 hover:bg-gray-50"
                )}
                style={{ textDecoration: 'none', color: isActive("/dashboard/alerts/setup") ? 'white' : '#000000' }}
              >
                <Wrench className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive("/dashboard/alerts/setup") ? "text-white" : "text-[#A52A2A]"
                )} />
                <span style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: isActive("/dashboard/alerts/setup") ? 'white' : '#000000' }}>Setup Alerts</span>
              </Link>
            </div>
          )}

        {/* Assets Section */}
        <Link
          href="/dashboard/assets"
          className={cn(
            "relative flex items-center gap-3 px-3 py-2.5 transition-colors no-underline",
            isAssetsActive
              ? "bg-[#FF8C00] text-white"
              : "bg-white hover:bg-gray-50"
          )}
          style={{ textDecoration: 'none', color: isAssetsActive ? 'white' : '#000000' }}
        >
          <Settings className={cn(
            "h-5 w-5 shrink-0",
            isAssetsActive ? "text-white" : "text-[#A52A2A]"
          )} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: isAssetsActive ? 'white' : '#000000' }}>Assets</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </>
          )}
        </Link>

      

        {/* Other Menu Items */}
        {otherMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isExternal = 'externalUrl' in item && (item as any).externalUrl;
          
          if (isExternal) {
            return (
              <a
                key={item.href}
                href={(item as any).externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center gap-3 px-3 py-2.5 transition-colors text-gray-900 hover:bg-gray-50 no-underline"
                style={{ textDecoration: 'none', color: active ? 'white' : '#000000' }}
              >
                <Icon className="h-5 w-5 shrink-0 text-[#A52A2A]" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: active ? 'white' : '#000000' }}>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </>
                )}
              </a>
            );
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 transition-colors no-underline",
                active
                  ? "bg-[#FF8C00] text-white"
                  : "text-gray-900 hover:bg-gray-50"
              )}
              style={{ textDecoration: 'none', color: active ? 'white' : '#000000' }}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0",
                active ? "text-white" : "text-[#A52A2A]"
              )} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: active ? 'white' : '#000000' }}>{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </>
              )}
            </Link>
          );
        })}

        {/* Tools Section */}
        <button
          type="button"
          onClick={() => setIsToolsOpen(!isToolsOpen)}
          className={cn(
            "relative w-full flex items-center gap-3 px-3 py-2.5 transition-colors no-underline text-left cursor-pointer",
            isToolsActive
              ? "bg-[#FF8C00] hover:bg-[#FF8C00]"
              : "bg-white hover:bg-gray-50"
          )}
          style={{ 
            textDecoration: 'none', 
            color: isToolsActive ? '#FFFFFF' : '#000000', 
            border: 'none', 
            background: isToolsActive ? '#FF8C00' : '#FFFFFF',
            fontWeight: 'normal'
          }}
        >
          <Wrench className={cn(
            "h-5 w-5 shrink-0",
            isToolsActive ? "text-white" : "text-[#FF8C00]"
          )} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: isToolsActive ? '#FFFFFF' : '#FF8C00', fontWeight: 'normal' }}>Tools</span>
              {isToolsOpen ? (
                <ChevronDown className={cn(
                  "h-4 w-4 shrink-0",
                  isToolsActive ? "text-white" : "text-gray-400"
                )} />
              ) : (
                <ChevronRight className={cn(
                  "h-4 w-4 shrink-0",
                  isToolsActive ? "text-white" : "text-gray-400"
                )} />
              )}
            </>
          )}
        </button>
        {isToolsOpen && !isCollapsed && (
          <div className="ml-4 mt-1 space-y-1">
            {toolsSubmenu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors no-underline relative",
                    active
                      ? "bg-gray-100 text-[#FF8C00]"
                      : "bg-white hover:bg-gray-50"
                  )}
                  style={{
                    textDecoration: 'none',
                    color: active ? '#FF8C00' : '#000000'
                  }}
                >
                  <Icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    "text-[#FF8C00]"
                  )} />
                  <span className="flex-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: active ? '#FF8C00' : '#000000' }}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Advanced Section */}
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className={cn(
            "relative w-full flex items-center gap-3 px-3 py-2.5 transition-colors no-underline text-left cursor-pointer",
            isAdvancedActive
              ? "bg-[#FF8C00] hover:bg-[#FF8C00]"
              : "bg-gray-100 hover:bg-gray-100"
          )}
          style={{ 
            textDecoration: 'none', 
            color: isAdvancedActive ? '#FFFFFF' : '#FF8C00', 
            border: 'none', 
            background: isAdvancedActive ? '#FF8C00' : '#F3F4F6',
            fontWeight: 'normal'
          }}
        >
          <Briefcase className={cn(
            "h-5 w-5 shrink-0",
            isAdvancedActive ? "text-white" : "text-[#FF8C00]"
          )} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: isAdvancedActive ? '#FFFFFF' : '#FF8C00', fontWeight: 'normal' }}>Advanced</span>
              {isAdvancedOpen ? (
                <ChevronDown className={cn(
                  "h-4 w-4 shrink-0",
                  isAdvancedActive ? "text-white" : "text-gray-400"
                )} />
              ) : (
                <ChevronRight className={cn(
                  "h-4 w-4 shrink-0",
                  isAdvancedActive ? "text-white" : "text-gray-400"
                )} />
              )}
            </>
          )}
        </button>
        {isAdvancedOpen && !isCollapsed && (
          <div className="ml-4 mt-1 space-y-1">
            {advancedSubmenu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors no-underline relative",
                    active
                      ? "bg-[#FF8C00] text-white"
                      : "bg-white hover:bg-gray-50"
                  )}
                  style={{
                    textDecoration: 'none',
                    borderLeft: active ? '4px solid #0066FF' : 'none'
                  }}
                >
                  <Icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active ? "text-white" : "text-[#FF8C00]"
                  )} />
                  <span className="flex-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: active ? 'white' : '#000000' }}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

          {/* Setup Section */}
          <button
            onClick={() => setIsSetupOpen(!isSetupOpen)}
            className={cn(
              "relative w-full flex items-center gap-3 px-3 py-2.5 transition-colors",
              isSetupActive
                ? "bg-[#FF8C00] text-white"
                : "bg-white hover:bg-gray-50"
            )}
            style={{ 
              textDecoration: 'none', 
              color: isSetupActive ? 'white' : '#000000', 
              border: 'none',
              fontWeight: 'normal'
            }}
          >
            <Settings className={cn(
              "h-5 w-5 shrink-0",
              isSetupActive ? "text-white" : "text-[#A52A2A]"
            )} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: isSetupActive ? 'white' : '#000000', fontWeight: 'normal' }}>Setup</span>
                {isSetupOpen ? (
                  <ChevronDown className={cn(
                    "h-4 w-4 shrink-0",
                    isSetupActive ? "text-white" : "text-gray-400"
                  )} />
                ) : (
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0",
                    isSetupActive ? "text-white" : "text-gray-400"
                  )} />
                )}
              </>
            )}
          </button>
          {isSetupOpen && !isCollapsed && (
            <div className="ml-4 mt-1 space-y-1">
              {setupSubmenu.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const isDepartments = item.label === "Departments";
                const isCustomizeForms = item.label === "Customize Forms";
                
                return (
                  <div key={item.href}>
                    {!isCustomizeForms && (
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors relative",
                          active
                            ? "bg-[#FF8C00] text-white"
                            : "bg-white hover:bg-gray-50"
                        )}
                        style={{
                          borderLeft: active ? '4px solid #0066FF' : 'none'
                        }}
                      >
                          <Icon className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            active ? "text-white" : "text-[#A52A2A]"
                          )} />
                        <span className="flex-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: active ? 'white' : '#000000' }}>{item.label}</span>
                      </Link>
                    )}
                    
                    {/* Insert Databases Section right after Departments */}
                    {isDepartments && (
                      <div className="mt-1">
                        <button
                          onClick={() => setIsDatabasesOpen(!isDatabasesOpen)}
                            className={cn(
                              "group w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors",
                              isDatabasesActive
                                ? "bg-[#FF8C00] text-white"
                                : "bg-white hover:bg-gray-50"
                            )}
                          >
                            <Database className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              isDatabasesActive ? "text-white" : "text-[#A52A2A]"
                            )} />
                          <span className="flex-1 text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>Databases</span>
                          {isDatabasesOpen ? (
                            <ChevronDown className={cn(
                              "h-4 w-4",
                              isDatabasesActive ? "text-white" : "text-gray-900"
                            )} />
                          ) : (
                            <ChevronRight className={cn(
                              "h-4 w-4",
                              isDatabasesActive ? "text-white" : "text-gray-900"
                            )} />
                          )}
                        </button>
                        {isDatabasesOpen && (
                          <div className="ml-4 mt-1 space-y-1">
                            {databasesSubmenu.map((item) => {
                              const active = isActive(item.href);
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className={cn(
                                    "group flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors no-underline relative",
                                    active
                                      ? "bg-[#FF8C00] text-white"
                                      : "bg-white hover:bg-gray-50"
                                  )}
                                  style={{ 
                                    textDecoration: 'none', 
                                    color: active ? 'white' : '#000000',
                                    borderLeft: active ? '4px solid #0066FF' : 'none'
                                  }}
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></div>
                                  <span className="flex-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: active ? 'white' : '#000000' }}>{item.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Insert Customize Forms Section with submenu */}
                    {item.label === "Customize Forms" && (
                      <div className="mt-1">
                        <button
                          onClick={() => setIsCustomizeFormsOpen(!isCustomizeFormsOpen)}
                          className={cn(
                            "group w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors",
                            isCustomizeFormsActive
                              ? "bg-[#FF8C00] text-white"
                              : "bg-white hover:bg-gray-50"
                          )}
                        >
                          <Icon className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isCustomizeFormsActive ? "text-white" : "text-[#A52A2A]"
                          )} />
                          <span className="flex-1 text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>Customize Forms</span>
                          {isCustomizeFormsOpen ? (
                            <ChevronDown className={cn(
                              "h-4 w-4",
                              isCustomizeFormsActive ? "text-white" : "text-gray-900"
                            )} />
                          ) : (
                            <ChevronRight className={cn(
                              "h-4 w-4",
                              isCustomizeFormsActive ? "text-white" : "text-gray-900"
                            )} />
                          )}
                        </button>
                        {isCustomizeFormsOpen && (
                          <div className="ml-4 mt-1 space-y-1">
                            {customizeFormsSubmenu.map((subItem) => {
                              const active = isActive(subItem.href);
                              return (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={cn(
                                    "group flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors no-underline relative",
                                    active
                                      ? "bg-[#FF8C00] text-white"
                                      : "bg-white hover:bg-gray-50"
                                  )}
                                  style={{ 
                                    textDecoration: 'none', 
                                    color: active ? 'white' : '#000000',
                                    borderLeft: active ? '4px solid #0066FF' : 'none'
                                  }}
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></div>
                                  <span className="flex-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: active ? 'white' : '#000000' }}>{subItem.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        {/* Help / Support Section */}
        <button
          type="button"
          onClick={() => setIsHelpOpen(!isHelpOpen)}
          className={cn(
            "relative w-full flex items-center gap-3 px-3 py-2.5 transition-colors no-underline text-left cursor-pointer",
            isHelpActive
              ? "bg-[#FF8C00] hover:bg-[#FF8C00]"
              : "bg-white hover:bg-gray-50"
          )}
          style={{ 
            textDecoration: 'none', 
            color: isHelpActive ? '#FFFFFF' : '#000000', 
            border: 'none', 
            background: isHelpActive ? '#FF8C00' : '#FFFFFF',
            fontWeight: 'normal'
          }}
        >
          <LifeBuoy className={cn(
            "h-5 w-5 shrink-0",
            isHelpActive ? "text-white" : "text-[#A52A2A]"
          )} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: isHelpActive ? '#FFFFFF' : '#000000', fontWeight: 'normal' }}>Help / Support</span>
              {isHelpOpen ? (
                <ChevronDown className={cn(
                  "h-4 w-4 shrink-0",
                  isHelpActive ? "text-white" : "text-gray-400"
                )} />
              ) : (
                <ChevronRight className={cn(
                  "h-4 w-4 shrink-0",
                  isHelpActive ? "text-white" : "text-gray-400"
                )} />
              )}
            </>
          )}
        </button>
        {isHelpOpen && !isCollapsed && (
          <div className="ml-4 mt-1 space-y-1">
            {helpSubmenu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors no-underline relative",
                    active
                      ? "bg-[#FF8C00] text-white"
                      : "bg-white hover:bg-gray-50"
                  )}
                  style={{
                    textDecoration: 'none',
                    borderLeft: active ? '4px solid #0066FF' : 'none'
                  }}
                >
                  <Icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active ? "text-white" : "text-[#A52A2A]"
                  )} />
                  <span className="flex-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: active ? 'white' : '#000000' }}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Download Menu Item */}
        {downloadMenuItem.map((item) => {
          const Icon = item.icon;
          const isExternal = 'externalUrl' in item && (item as any).externalUrl;
          
          if (isExternal) {
            return (
              <a
                key={item.href}
                href={(item as any).externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 rounded mb-1 transition-colors no-underline",
                  "text-gray-900 hover:bg-gray-100"
                )}
                style={{ textDecoration: 'none', color: '#000000' }}
              >
                <Icon className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  "text-[#A52A2A] group-hover:text-[#A52A2A]"
                )} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px', color: '#000000' }}>{item.label}</span>
                    <ChevronRight className={cn(
                      "h-4 w-4",
                      "text-gray-900"
                    )} />
                  </>
                )}
              </a>
            );
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded mb-1 transition-colors",
                  "text-gray-900 hover:bg-gray-100"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                "text-[#A52A2A] group-hover:text-[#A52A2A]"
              )} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>{item.label}</span>
                  <ChevronRight className={cn(
                    "h-4 w-4",
                    "text-gray-900"
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

