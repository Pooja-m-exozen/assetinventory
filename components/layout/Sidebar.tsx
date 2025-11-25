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
  Upload,
  FolderOpen,
  Image as ImageIcon,
  FileEdit,
  Users,
  ShieldCheck,
  MapPin,
  Building,
  Grid3x3,
  Database,
  CalendarCheck,
  Grid,
  LayoutDashboard,
  FileCheck,
  Mail,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAssetsOpen, setIsAssetsOpen] = useState(true);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isListsOpen, setIsListsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isCustomReportsOpen, setIsCustomReportsOpen] = useState(false);
  const [isInventoryReportsOpen, setIsInventoryReportsOpen] = useState(false);
  const [isInventoryItemsOpen, setIsInventoryItemsOpen] = useState(false);
  const [isInventoryTransactionsOpen, setIsInventoryTransactionsOpen] = useState(false);
  const [isAssetReportsOpen, setIsAssetReportsOpen] = useState(false);
  const [isAuditReportsOpen, setIsAuditReportsOpen] = useState(false);
  const [isCheckoutReportsOpen, setIsCheckoutReportsOpen] = useState(false);
  const [isDepreciationReportsOpen, setIsDepreciationReportsOpen] = useState(false);
  const [isLeasedAssetReportsOpen, setIsLeasedAssetReportsOpen] = useState(false);
  const [isMaintenanceReportsOpen, setIsMaintenanceReportsOpen] = useState(false);
  const [isReservationReportsOpen, setIsReservationReportsOpen] = useState(false);
  const [isStatusReportsOpen, setIsStatusReportsOpen] = useState(false);
  const [isTransactionReportsOpen, setIsTransactionReportsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isDatabasesOpen, setIsDatabasesOpen] = useState(false);
  const [isCustomizeFormsOpen, setIsCustomizeFormsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
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
    { href: "/assets", label: "List of Assets", icon: List },
    { href: "/assets/add", label: "Add an Asset", icon: Plus },
  ];

  const assetsNonIndentedItems = [
    { href: "/assets/checkout", label: "Check out", icon: UserCheck },
    { href: "/assets/checkin", label: "Check in", icon: UserX },
  ];

  const assetsSubmenu = [
    { href: "/assets/lease", label: "Lease", icon: Send },
    { href: "/assets/lease-return", label: "Lease Return", icon: RotateCcw },
    { href: "/assets/dispose", label: "Dispose", icon: Recycle },
    { href: "/assets/maintenance", label: "Maintenance", icon: Cog },
    { href: "/assets/move", label: "Move", icon: Move },
    { href: "/assets/reserve", label: "Reserve", icon: Calendar },
  ];

  const inventorySubmenu = [
    { href: "/inventory/list", label: "Inventory List", icon: List },
    { href: "/inventory/add", label: "Add an Inventory Item", icon: Plus },
  ];

  const listsSubmenu = [
    { href: "/lists/assets", label: "List of Assets", icon: List },
    { href: "/lists/maintenances", label: "List of Maintenances", icon: List },
    { href: "/lists/warranties", label: "List of Warranties", icon: List },
  ];

  const customReportsSubmenu = [
    { href: "/reports/custom/new", label: "New Report" },
    { href: "/reports/custom/ppp", label: "- ppp" },
  ];

  const inventoryItemsSubmenu = [
    { href: "/reports/inventory/items/new", label: "New Report" },
    { href: "/reports/inventory/items/by-category", label: "by Category" },
    { href: "/reports/inventory/items/deleted", label: "Deleted Inventory Items" },
  ];

  const inventoryTransactionsSubmenu = [
    { href: "/reports/inventory/transactions/new", label: "New Report" },
    { href: "/reports/inventory/transactions/by-date", label: "by Date" },
    { href: "/reports/inventory/transactions/by-week", label: "by Week" },
    { href: "/reports/inventory/transactions/by-month", label: "by Month" },
    { href: "/reports/inventory/transactions/by-year", label: "by Year" },
    { href: "/reports/inventory/transactions/by-category", label: "by Category" },
    { href: "/reports/inventory/transactions/by-type", label: "by Type" },
    { href: "/reports/inventory/transactions/by-item", label: "by Item" },
  ];

  const assetReportsSubmenu = [
    { href: "/reports/asset/by-asset-tag", label: "by Asset Tag" },
    { href: "/reports/asset/by-tag-with-pictures", label: "by Tag with Pictures" },
    { href: "/reports/asset/by-category", label: "by Category" },
    { href: "/reports/asset/by-site-location", label: "by Site/Location" },
    { href: "/reports/asset/by-department", label: "by Department" },
    { href: "/reports/asset/by-warranty-info", label: "by Warranty Info." },
    { href: "/reports/asset/by-linked-assets", label: "by Linked Assets" },
  ];

  const auditReportsSubmenu = [
    { href: "/reports/audit/by-asset-tag", label: "by Asset Tag" },
    { href: "/reports/audit/by-audit-date", label: "by Audit Date" },
    { href: "/reports/audit/by-site-location", label: "by Site/Location" },
    { href: "/reports/audit/non-audited-assets", label: "Non-Audited Assets" },
    { href: "/reports/audit/location-discrepancy", label: "Location Discrepancy" },
    { href: "/reports/audit/by-funding", label: "by Funding" },
    { href: "/reports/audit/non-audited-funding", label: "Non-Audited Funding" },
  ];

  const checkoutReportsSubmenu = [
    { href: "/reports/checkout/by-person-employee", label: "by Person/Employee" },
    { href: "/reports/checkout/by-asset-tag", label: "by Asset Tag" },
    { href: "/reports/checkout/by-due-date", label: "by Due Date" },
    { href: "/reports/checkout/by-past-due", label: "by Past Due" },
    { href: "/reports/checkout/by-site-location", label: "by Site/Location" },
    { href: "/reports/checkout/in-time-frame", label: "in a Time Frame" },
  ];

  const depreciationReportsSubmenu = [
    { href: "/reports/depreciation/by-category", label: "by Category" },
    { href: "/reports/depreciation/by-department", label: "by Department" },
    { href: "/reports/depreciation/for-disposed-asset", label: "For Disposed Asset" },
    { href: "/reports/depreciation/yearly-report", label: "Yearly Report" },
    { href: "/reports/depreciation/quarterly-report", label: "Quarterly Report" },
    { href: "/reports/depreciation/monthly-report", label: "Monthly Report" },
  ];

  const leasedAssetReportsSubmenu = [
    { href: "/reports/leased-asset/by-customer", label: "by Customer" },
    { href: "/reports/leased-asset/by-asset-tag", label: "by Asset Tag" },
    { href: "/reports/leased-asset/by-due-date", label: "by Due Date" },
    { href: "/reports/leased-asset/by-past-due", label: "by Past Due" },
    { href: "/reports/leased-asset/in-time-frame", label: "in a Time Frame" },
  ];

  const maintenanceReportsSubmenu = [
    { href: "/reports/maintenance/by-asset-tag", label: "by Asset Tag" },
    { href: "/reports/maintenance/by-assigned-person", label: "by Assigned Person" },
    { href: "/reports/maintenance/history-by-asset-tag", label: "History by Asset Tag" },
    { href: "/reports/maintenance/history-by-date", label: "History by Date" },
    { href: "/reports/maintenance/past-due", label: "Past Due" },
  ];

  const reservationReportsSubmenu = [
    { href: "/reports/reservation/by-asset-tag", label: "by Asset Tag" },
  ];

  const statusReportsSubmenu = [
    { href: "/reports/status/assets-under-repair", label: "Assets Under Repair" },
    { href: "/reports/status/broken-assets", label: "Broken Assets" },
    { href: "/reports/status/disposed-assets", label: "Disposed Assets" },
    { href: "/reports/status/donated-assets", label: "Donated Assets" },
    { href: "/reports/status/leased-assets", label: "Leased Assets" },
    { href: "/reports/status/lost-missing-assets", label: "Lost/Missing Assets" },
    { href: "/reports/status/sold-assets", label: "Sold Assets" },
  ];

  const transactionReportsSubmenu = [
    { href: "/reports/transaction/add-assets", label: "Add Assets" },
    { href: "/reports/transaction/broken-assets", label: "Broken Assets" },
    { href: "/reports/transaction/checkout-checkin", label: "Checkout/Checkin" },
    { href: "/reports/transaction/dispose-assets", label: "Dispose Assets" },
    { href: "/reports/transaction/donate-assets", label: "Donate Assets" },
    { href: "/reports/transaction/edit-assets", label: "Edit Assets" },
    { href: "/reports/transaction/lease-out-lease-return", label: "Lease out/Lease return" },
    { href: "/reports/transaction/lost-missing-assets", label: "Lost/Missing Assets" },
    { href: "/reports/transaction/move-assets", label: "Move Assets" },
    { href: "/reports/transaction/repair-assets", label: "Repair Assets" },
    { href: "/reports/transaction/reserve-assets", label: "Reserve Assets" },
    { href: "/reports/transaction/sell-assets", label: "Sell Assets" },
    { href: "/reports/transaction/transaction-history", label: "Transaction History" },
    { href: "/reports/transaction/actions-by-users", label: "Actions by Users" },
    { href: "/reports/transaction/deleted-assets", label: "Deleted Assets" },
  ];

  const inventoryReportsSubmenu = [
    { href: "/reports/inventory/items", label: "Items", hasSubmenu: true },
    { href: "/reports/inventory/transactions", label: "Transactions", hasSubmenu: true },
  ];

  const reportsSubmenu = [
    { href: "/reports/automated", label: "Automated Reports", icon: ChevronRight },
    { href: "/reports/custom", label: "Custom Reports", icon: ChevronRight, hasSubmenu: true },
    { href: "/reports/inventory", label: "Inventory Reports", icon: ChevronRight, hasSubmenu: true },
    { href: "/reports/asset", label: "Asset Reports", icon: ChevronRight, hasSubmenu: true },
    { href: "/reports/audit", label: "Audit Reports", icon: ChevronRight, hasSubmenu: true },
    { href: "/reports/checkout", label: "Check-Out Reports", icon: ChevronRight, hasSubmenu: true },
    { href: "/reports/depreciation", label: "Depreciation Reports", icon: ChevronRight, hasSubmenu: true },
    { href: "/reports/leased-asset", label: "Leased Asset Reports", icon: ChevronRight, hasSubmenu: true },
    { href: "/reports/maintenance", label: "Maintenance Reports", icon: ChevronRight, hasSubmenu: true },
    { href: "/reports/reservation", label: "Reservation Reports", icon: ChevronRight, hasSubmenu: true },
    { href: "/reports/status", label: "Status Reports", icon: ChevronRight, hasSubmenu: true },
    { href: "/reports/transaction", label: "Transaction Reports", icon: ChevronRight, hasSubmenu: true },
    { href: "/reports/other", label: "Other Reports", icon: ChevronRight },
  ];

  const toolsSubmenu = [
    { href: "/tools/import", label: "Import", icon: Upload },
    { href: "/tools/export", label: "Export", icon: Download },
    { href: "/tools/documents-gallery", label: "Documents Gallery", icon: FolderOpen },
    { href: "/tools/image-gallery", label: "Image Gallery", icon: ImageIcon },
    { href: "/tools/audit", label: "Audit", icon: FileEdit },
  ];

  const advancedSubmenu = [
    { href: "/advanced/persons-employees", label: "Persons/Employees", icon: User },
    { href: "/advanced/customers", label: "Customers", icon: Users },
    { href: "/advanced/users", label: "Users", icon: Users },
    { href: "/advanced/security-groups", label: "Security Groups", icon: ShieldCheck },
  ];

  const databasesSubmenu = [
    { href: "/setup/databases/assets-table", label: "Assets Table" },
    { href: "/setup/databases/persons-employees", label: "Persons/Employees" },
    { href: "/setup/databases/customers-table", label: "Customers Table" },
    { href: "/setup/databases/maintenance-table", label: "Maintenance Table" },
    { href: "/setup/databases/warranties-table", label: "Warranties Table" },
    { href: "/setup/databases/contract-table", label: "Contract Table" },
    { href: "/setup/databases/backup", label: "Backup" },
    { href: "/setup/databases/restore", label: "Restore" },
  ];

  const customizeFormsSubmenu = [
    { href: "/setup/customize-forms/assets", label: "Assets" },
    { href: "/setup/customize-forms/inventory", label: "Inventory" },
  ];

  const helpSubmenu = [
    { href: "/help/about-us", label: "About Us" },
    { href: "/help/contact-us", label: "Contact Us" },
    { href: "/help/privacy-policy", label: "Privacy Policy" },
    { href: "/help/terms-of-service", label: "Terms of Service" },
  ];

  const setupSubmenu = [
    { href: "/setup/company-info", label: "Company Info.", icon: Briefcase },
    { href: "/setup/sites", label: "Sites", icon: MapPin },
    { href: "/setup/locations", label: "Locations", icon: MapPin },
    { href: "/setup/categories", label: "Categories", icon: List },
    { href: "/setup/departments", label: "Departments", icon: Grid3x3 },
    { href: "/setup/databases", label: "Databases", icon: Database, hasSubmenu: true },
    { href: "/setup/events", label: "Events", icon: CalendarCheck },
    { href: "/setup/table-options", label: "Table Options", icon: Grid },
    { href: "/setup/inventory", label: "Inventory", icon: Package },
    { href: "/setup/options", label: "Options", icon: List },
    { href: "/setup/manage-dashboard", label: "Manage Dashboard", icon: LayoutDashboard },
    { href: "/setup/customize-forms", label: "Customize Forms", icon: FileCheck, hasSubmenu: true },
    { href: "/setup/customize-emails", label: "Customize Emails", icon: Mail },
  ];

  const otherMenuItems = [
    { href: "/tools", label: "Tools", icon: Wrench, hasSubmenu: true },
    { href: "/advanced", label: "Advanced", icon: Briefcase, hasSubmenu: true },
    { href: "/setup", label: "Setup", icon: Settings, hasSubmenu: true },
    { href: "/help", label: "Help / Support", icon: LifeBuoy, hasSubmenu: true },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");
  const isAssetsActive = 
    assetsIndentedSubmenu.some((item) => isActive(item.href)) ||
    assetsNonIndentedItems.some((item) => isActive(item.href)) ||
    assetsSubmenu.some((item) => isActive(item.href));
  const isAlertsActive = alertsSubmenu.some((item) => isActive(item.href)) || isActive("/dashboard/alerts/setup");
  const isInventoryActive = inventorySubmenu.some((item) => isActive(item.href));
  const isListsActive = listsSubmenu.some((item) => isActive(item.href));
  const isCustomReportsActive = customReportsSubmenu.some((item) => isActive(item.href)) || isActive("/reports/custom");
  const isInventoryItemsActive = inventoryItemsSubmenu.some((item) => isActive(item.href)) || isActive("/reports/inventory/items");
  const isInventoryTransactionsActive = inventoryTransactionsSubmenu.some((item) => isActive(item.href)) || isActive("/reports/inventory/transactions");
  const isInventoryReportsActive = inventoryReportsSubmenu.some((item) => isActive(item.href)) || isInventoryItemsActive || isInventoryTransactionsActive || isActive("/reports/inventory");
  const isAssetReportsActive = assetReportsSubmenu.some((item) => isActive(item.href)) || isActive("/reports/asset");
  const isAuditReportsActive = auditReportsSubmenu.some((item) => isActive(item.href)) || isActive("/reports/audit");
  const isCheckoutReportsActive = checkoutReportsSubmenu.some((item) => isActive(item.href)) || isActive("/reports/checkout");
  const isDepreciationReportsActive = depreciationReportsSubmenu.some((item) => isActive(item.href)) || isActive("/reports/depreciation");
  const isLeasedAssetReportsActive = leasedAssetReportsSubmenu.some((item) => isActive(item.href)) || isActive("/reports/leased-asset");
  const isMaintenanceReportsActive = maintenanceReportsSubmenu.some((item) => isActive(item.href)) || isActive("/reports/maintenance");
  const isReservationReportsActive = reservationReportsSubmenu.some((item) => isActive(item.href)) || isActive("/reports/reservation");
  const isStatusReportsActive = statusReportsSubmenu.some((item) => isActive(item.href)) || isActive("/reports/status");
  const isTransactionReportsActive = transactionReportsSubmenu.some((item) => isActive(item.href)) || isActive("/reports/transaction");
  const isReportsActive = reportsSubmenu.some((item) => isActive(item.href)) || isCustomReportsActive || isInventoryReportsActive || isAssetReportsActive || isAuditReportsActive || isCheckoutReportsActive || isDepreciationReportsActive || isLeasedAssetReportsActive || isMaintenanceReportsActive || isReservationReportsActive || isStatusReportsActive || isTransactionReportsActive;
  const isToolsActive = toolsSubmenu.some((item) => isActive(item.href)) || isActive("/tools");
  const isAdvancedActive = advancedSubmenu.some((item) => isActive(item.href)) || isActive("/advanced");
  const isDatabasesActive = databasesSubmenu.some((item) => isActive(item.href)) || isActive("/setup/databases");
  const isCustomizeFormsActive = customizeFormsSubmenu.some((item) => isActive(item.href)) || isActive("/setup/customize-forms");
  const isSetupActive = setupSubmenu.some((item) => isActive(item.href)) || isDatabasesActive || isCustomizeFormsActive || isActive("/setup");
  const isHelpActive = helpSubmenu.some((item) => isActive(item.href)) || isActive("/help");
  const totalAlerts = alertsSubmenu.reduce((sum, item) => sum + parseInt(item.badge), 0);

  // Auto-expand Custom Reports if active
  useEffect(() => {
    if (isCustomReportsActive) {
      setIsCustomReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isCustomReportsActive]);

  // Auto-expand Inventory Reports if active
  useEffect(() => {
    if (isInventoryReportsActive) {
      setIsInventoryReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isInventoryReportsActive]);

  // Auto-expand Inventory Items if active
  useEffect(() => {
    if (isInventoryItemsActive) {
      setIsInventoryItemsOpen(true);
      setIsInventoryReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isInventoryItemsActive]);

  // Auto-expand Inventory Transactions if active
  useEffect(() => {
    if (isInventoryTransactionsActive) {
      setIsInventoryTransactionsOpen(true);
      setIsInventoryReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isInventoryTransactionsActive]);

  // Auto-expand Asset Reports if active
  useEffect(() => {
    if (isAssetReportsActive) {
      setIsAssetReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isAssetReportsActive]);

  // Auto-expand Audit Reports if active
  useEffect(() => {
    if (isAuditReportsActive) {
      setIsAuditReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isAuditReportsActive]);

  // Auto-expand Check-Out Reports if active
  useEffect(() => {
    if (isCheckoutReportsActive) {
      setIsCheckoutReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isCheckoutReportsActive]);

  // Auto-expand Depreciation Reports if active
  useEffect(() => {
    if (isDepreciationReportsActive) {
      setIsDepreciationReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isDepreciationReportsActive]);

  // Auto-expand Leased Asset Reports if active
  useEffect(() => {
    if (isLeasedAssetReportsActive) {
      setIsLeasedAssetReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isLeasedAssetReportsActive]);

  // Auto-expand Maintenance Reports if active
  useEffect(() => {
    if (isMaintenanceReportsActive) {
      setIsMaintenanceReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isMaintenanceReportsActive]);

  // Auto-expand Reservation Reports if active
  useEffect(() => {
    if (isReservationReportsActive) {
      setIsReservationReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isReservationReportsActive]);

  // Auto-expand Status Reports if active
  useEffect(() => {
    if (isStatusReportsActive) {
      setIsStatusReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isStatusReportsActive]);

  // Auto-expand Transaction Reports if active
  useEffect(() => {
    if (isTransactionReportsActive) {
      setIsTransactionReportsOpen(true);
      setIsReportsOpen(true);
    }
  }, [isTransactionReportsActive]);

  // Auto-expand Tools if active
  useEffect(() => {
    if (isToolsActive) {
      setIsToolsOpen(true);
    }
  }, [isToolsActive]);

  // Auto-expand Advanced if active
  useEffect(() => {
    if (isAdvancedActive) {
      setIsAdvancedOpen(true);
    }
  }, [isAdvancedActive]);

  // Auto-expand Setup if active
  useEffect(() => {
    if (isSetupActive) {
      setIsSetupOpen(true);
    }
  }, [isSetupActive]);

  // Auto-expand Databases if active
  useEffect(() => {
    if (isDatabasesActive) {
      setIsDatabasesOpen(true);
      setIsSetupOpen(true);
    }
  }, [isDatabasesActive]);

  // Auto-expand Customize Forms if active
  useEffect(() => {
    if (isCustomizeFormsActive) {
      setIsCustomizeFormsOpen(true);
      setIsSetupOpen(true);
    }
  }, [isCustomizeFormsActive]);

  // Auto-expand Help if active
  useEffect(() => {
    if (isHelpActive) {
      setIsHelpOpen(true);
    }
  }, [isHelpActive]);

  const userMenuItems = [
    { label: "My Profile", icon: UserCircle, href: "/settings/profile" },
    { label: "Change Password", icon: Key, href: "/settings/change-password" },
    { label: "Log out", icon: LogOut, href: "/logout", action: () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
      router.push("/");
    }},
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
            onClick={() => {
              setIsAlertsOpen(!isAlertsOpen);
              if (!isAlertsOpen) {
                setIsAssetsOpen(false);
                setIsInventoryOpen(false);
                setIsListsOpen(false);
                setIsReportsOpen(false);
                setIsToolsOpen(false);
                setIsAdvancedOpen(false);
                setIsSetupOpen(false);
                setIsHelpOpen(false);
              }
            }}
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
            onClick={() => {
              setIsAssetsOpen(!isAssetsOpen);
              if (!isAssetsOpen) {
                setIsAlertsOpen(false);
                setIsInventoryOpen(false);
                setIsListsOpen(false);
                setIsReportsOpen(false);
                setIsToolsOpen(false);
                setIsAdvancedOpen(false);
                setIsSetupOpen(false);
                setIsHelpOpen(false);
              }
            }}
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
            <div>
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
                        "group flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                        active
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                        "group flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                        active
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                        "group flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                        active
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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

        {/* Inventory Section */}
        <div className="mt-1">
          <button
            onClick={() => {
              setIsInventoryOpen(!isInventoryOpen);
              if (!isInventoryOpen) {
                setIsAlertsOpen(false);
                setIsAssetsOpen(false);
                setIsListsOpen(false);
                setIsReportsOpen(false);
                setIsToolsOpen(false);
                setIsAdvancedOpen(false);
                setIsSetupOpen(false);
                setIsHelpOpen(false);
              }
            }}
            className={cn(
              "group w-full flex items-center gap-3 px-3 py-2 rounded mb-1 transition-colors",
              isInventoryActive
                ? "bg-yellow-500 text-white"
                : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Package className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              isInventoryActive ? "text-white" : "text-orange-500 group-hover:text-orange-600"
            )} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>Inventory</span>
                {isInventoryOpen ? (
                  <ChevronDown className={cn(
                    "h-4 w-4 shrink-0",
                    isInventoryActive ? "text-white" : "text-gray-900"
                  )} />
                ) : (
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0",
                    isInventoryActive ? "text-white" : "text-gray-900"
                  )} />
                )}
              </>
            )}
          </button>
          {isInventoryOpen && !isCollapsed && (
            <div className="ml-4 mt-1 space-y-1">
              {inventorySubmenu.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                      active
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
          )}
        </div>

        {/* Lists Section */}
        <div className="mt-1">
          <button
            onClick={() => {
              setIsListsOpen(!isListsOpen);
              if (!isListsOpen) {
                setIsAlertsOpen(false);
                setIsAssetsOpen(false);
                setIsInventoryOpen(false);
                setIsReportsOpen(false);
                setIsToolsOpen(false);
                setIsAdvancedOpen(false);
                setIsSetupOpen(false);
                setIsHelpOpen(false);
              }
            }}
            className={cn(
              "group w-full flex items-center gap-3 px-3 py-2 rounded mb-1 transition-colors",
              isListsActive
                ? "bg-yellow-500 text-white"
                : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <FileText className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              isListsActive ? "text-white" : "text-orange-500 group-hover:text-orange-600"
            )} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>Lists</span>
                {isListsOpen ? (
                  <ChevronDown className={cn(
                    "h-4 w-4 shrink-0",
                    isListsActive ? "text-white" : "text-gray-900"
                  )} />
                ) : (
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0",
                    isListsActive ? "text-white" : "text-gray-900"
                  )} />
                )}
              </>
            )}
          </button>
          {isListsOpen && !isCollapsed && (
            <div className="ml-4 mt-1 space-y-1">
              {listsSubmenu.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                      active
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
          )}
        </div>

        {/* Reports Section */}
        <div className="mt-1">
          <button
            onClick={() => {
              setIsReportsOpen(!isReportsOpen);
              if (!isReportsOpen) {
                setIsAlertsOpen(false);
                setIsAssetsOpen(false);
                setIsInventoryOpen(false);
                setIsListsOpen(false);
                setIsToolsOpen(false);
                setIsAdvancedOpen(false);
                setIsSetupOpen(false);
                setIsHelpOpen(false);
              }
            }}
            className={cn(
              "group w-full flex items-center gap-3 px-3 py-2 rounded mb-1 transition-colors",
              isReportsActive
                ? "bg-yellow-500 text-white"
                : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <FileText className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              isReportsActive ? "text-white" : "text-orange-500 group-hover:text-orange-600"
            )} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>Reports</span>
                {isReportsOpen ? (
                  <ChevronDown className={cn(
                    "h-4 w-4 shrink-0",
                    isReportsActive ? "text-white" : "text-gray-900"
                  )} />
                ) : (
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0",
                    isReportsActive ? "text-white" : "text-gray-900"
                  )} />
                )}
              </>
            )}
          </button>
          {isReportsOpen && !isCollapsed && (
            <div className="ml-4 mt-1 space-y-0">
              {reportsSubmenu.map((item) => {
                const active = isActive(item.href);
                const hasSubmenu = (item as any).hasSubmenu;
                const isCustomReports = item.href === "/reports/custom";
                const isInventoryReports = item.href === "/reports/inventory";
                const isAssetReports = item.href === "/reports/asset";
                const isAuditReports = item.href === "/reports/audit";
                const isCheckoutReports = item.href === "/reports/checkout";
                const isDepreciationReports = item.href === "/reports/depreciation";
                const isLeasedAssetReports = item.href === "/reports/leased-asset";
                const isMaintenanceReports = item.href === "/reports/maintenance";
                const isReservationReports = item.href === "/reports/reservation";
                const isStatusReports = item.href === "/reports/status";
                const isTransactionReports = item.href === "/reports/transaction";
                
                if (hasSubmenu && isCustomReports) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsCustomReportsOpen(!isCustomReportsOpen);
                          if (!isCustomReportsOpen) {
                            setIsInventoryReportsOpen(false);
                            setIsInventoryItemsOpen(false);
                            setIsInventoryTransactionsOpen(false);
                            setIsAssetReportsOpen(false);
                            setIsAuditReportsOpen(false);
                            setIsCheckoutReportsOpen(false);
                            setIsDepreciationReportsOpen(false);
                            setIsLeasedAssetReportsOpen(false);
                            setIsMaintenanceReportsOpen(false);
                            setIsReservationReportsOpen(false);
                            setIsStatusReportsOpen(false);
                            setIsTransactionReportsOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isCustomReportsActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <span className={cn(
                          "transition-colors flex-1 text-left",
                          isCustomReportsActive ? "text-orange-600 dark:text-orange-500" : "text-orange-600 dark:text-orange-500"
                        )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        {isCustomReportsOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isCustomReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isCustomReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isCustomReportsOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {customReportsSubmenu.map((subItem) => {
                            const subActive = isActive(subItem.href);
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  subActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  subActive ? "text-orange-600 dark:text-orange-500" : subItem.label.startsWith("-") ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{subItem.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (hasSubmenu && isInventoryReports) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsInventoryReportsOpen(!isInventoryReportsOpen);
                          if (!isInventoryReportsOpen) {
                            setIsCustomReportsOpen(false);
                            setIsInventoryItemsOpen(false);
                            setIsInventoryTransactionsOpen(false);
                            setIsAssetReportsOpen(false);
                            setIsAuditReportsOpen(false);
                            setIsCheckoutReportsOpen(false);
                            setIsDepreciationReportsOpen(false);
                            setIsLeasedAssetReportsOpen(false);
                            setIsMaintenanceReportsOpen(false);
                            setIsReservationReportsOpen(false);
                            setIsStatusReportsOpen(false);
                            setIsTransactionReportsOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isInventoryReportsActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <span className={cn(
                          "transition-colors flex-1 text-left",
                          isInventoryReportsActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                        )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        {isInventoryReportsOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isInventoryReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isInventoryReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isInventoryReportsOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {inventoryReportsSubmenu.map((subItem) => {
                            const subActive = isActive(subItem.href);
                            const hasSubmenu = (subItem as any).hasSubmenu;
                            const isItems = subItem.href === "/reports/inventory/items";
                            
                            if (hasSubmenu && isItems) {
                              return (
                                <div key={subItem.href}>
                                  <button
                                    onClick={() => {
                                      setIsInventoryItemsOpen(!isInventoryItemsOpen);
                                      if (!isInventoryItemsOpen) {
                                        setIsInventoryTransactionsOpen(false);
                                      }
                                    }}
                                    className={cn(
                                      "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                                      isInventoryItemsActive
                                        ? "bg-gray-100 dark:bg-gray-800"
                                        : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                      <span className={cn(
                                        "transition-colors flex-1 text-left",
                                        isInventoryItemsActive ? "text-orange-600 dark:text-orange-500" : "text-orange-600 dark:text-orange-500"
                                      )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{subItem.label}</span>
                                    </div>
                                    {isInventoryItemsOpen ? (
                                      <ChevronDown className={cn(
                                        "h-4 w-4 shrink-0 transition-colors",
                                        isInventoryItemsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                                      )} />
                                    ) : (
                                      <ChevronRight className={cn(
                                        "h-4 w-4 shrink-0 transition-colors",
                                        isInventoryItemsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                                      )} />
                                    )}
                                  </button>
                                  {isInventoryItemsOpen && (
                                    <div className="ml-4 mt-0 space-y-0">
                                      {inventoryItemsSubmenu.map((itemSubItem) => {
                                        const itemSubActive = isActive(itemSubItem.href);
                                        return (
                                          <Link
                                            key={itemSubItem.href}
                                            href={itemSubItem.href}
                                            className={cn(
                                              "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                              itemSubActive
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            )}
                                          >
                                            <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                            <span className={cn(
                                              "transition-colors flex-1",
                                              itemSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                            )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{itemSubItem.label}</span>
                                            <ChevronRight className={cn(
                                              "h-4 w-4 shrink-0 transition-colors",
                                              itemSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                            )} />
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            const isTransactions = subItem.href === "/reports/inventory/transactions";
                            
                            if (hasSubmenu && isTransactions) {
                              return (
                                <div key={subItem.href}>
                                  <button
                                    onClick={() => {
                                      setIsInventoryTransactionsOpen(!isInventoryTransactionsOpen);
                                      if (!isInventoryTransactionsOpen) {
                                        setIsInventoryItemsOpen(false);
                                      }
                                    }}
                                    className={cn(
                                      "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                                      isInventoryTransactionsActive
                                        ? "bg-gray-100 dark:bg-gray-800"
                                        : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                      <span className={cn(
                                        "transition-colors flex-1 text-left",
                                        isInventoryTransactionsActive ? "text-orange-600 dark:text-orange-500" : "text-orange-600 dark:text-orange-500"
                                      )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{subItem.label}</span>
                                    </div>
                                    {isInventoryTransactionsOpen ? (
                                      <ChevronDown className={cn(
                                        "h-4 w-4 shrink-0 transition-colors",
                                        isInventoryTransactionsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                                      )} />
                                    ) : (
                                      <ChevronRight className={cn(
                                        "h-4 w-4 shrink-0 transition-colors",
                                        isInventoryTransactionsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                                      )} />
                                    )}
                                  </button>
                                  {isInventoryTransactionsOpen && (
                                    <div className="ml-4 mt-0 space-y-0">
                                      {inventoryTransactionsSubmenu.map((transactionSubItem) => {
                                        const transactionSubActive = isActive(transactionSubItem.href);
                                        return (
                                          <Link
                                            key={transactionSubItem.href}
                                            href={transactionSubItem.href}
                                            className={cn(
                                              "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                              transactionSubActive
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            )}
                                          >
                                            <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                            <span className={cn(
                                              "transition-colors flex-1",
                                              transactionSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                            )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{transactionSubItem.label}</span>
                                            <ChevronRight className={cn(
                                              "h-4 w-4 shrink-0 transition-colors",
                                              transactionSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                            )} />
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  subActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  subActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{subItem.label}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  subActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (hasSubmenu && isAssetReports) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsAssetReportsOpen(!isAssetReportsOpen);
                          if (!isAssetReportsOpen) {
                            setIsCustomReportsOpen(false);
                            setIsInventoryReportsOpen(false);
                            setIsInventoryItemsOpen(false);
                            setIsInventoryTransactionsOpen(false);
                            setIsAuditReportsOpen(false);
                            setIsCheckoutReportsOpen(false);
                            setIsDepreciationReportsOpen(false);
                            setIsLeasedAssetReportsOpen(false);
                            setIsMaintenanceReportsOpen(false);
                            setIsReservationReportsOpen(false);
                            setIsStatusReportsOpen(false);
                            setIsTransactionReportsOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isAssetReportsActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <span className={cn(
                          "transition-colors flex-1 text-left",
                          isAssetReportsActive ? "text-orange-600 dark:text-orange-500" : "text-orange-600 dark:text-orange-500"
                        )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        {isAssetReportsOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isAssetReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isAssetReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isAssetReportsOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {assetReportsSubmenu.map((assetSubItem) => {
                            const assetSubActive = isActive(assetSubItem.href);
                            return (
                              <Link
                                key={assetSubItem.href}
                                href={assetSubItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  assetSubActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  assetSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{assetSubItem.label}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  assetSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (hasSubmenu && isAuditReports) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsAuditReportsOpen(!isAuditReportsOpen);
                          if (!isAuditReportsOpen) {
                            setIsCustomReportsOpen(false);
                            setIsInventoryReportsOpen(false);
                            setIsInventoryItemsOpen(false);
                            setIsInventoryTransactionsOpen(false);
                            setIsAssetReportsOpen(false);
                            setIsCheckoutReportsOpen(false);
                            setIsDepreciationReportsOpen(false);
                            setIsLeasedAssetReportsOpen(false);
                            setIsMaintenanceReportsOpen(false);
                            setIsReservationReportsOpen(false);
                            setIsStatusReportsOpen(false);
                            setIsTransactionReportsOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isAuditReportsActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <span className={cn(
                          "transition-colors flex-1 text-left",
                          isAuditReportsActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                        )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        {isAuditReportsOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isAuditReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isAuditReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isAuditReportsOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {auditReportsSubmenu.map((auditSubItem) => {
                            const auditSubActive = isActive(auditSubItem.href);
                            return (
                              <Link
                                key={auditSubItem.href}
                                href={auditSubItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  auditSubActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  auditSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{auditSubItem.label}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  auditSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (hasSubmenu && isCheckoutReports) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsCheckoutReportsOpen(!isCheckoutReportsOpen);
                          if (!isCheckoutReportsOpen) {
                            setIsCustomReportsOpen(false);
                            setIsInventoryReportsOpen(false);
                            setIsInventoryItemsOpen(false);
                            setIsInventoryTransactionsOpen(false);
                            setIsAssetReportsOpen(false);
                            setIsAuditReportsOpen(false);
                            setIsDepreciationReportsOpen(false);
                            setIsLeasedAssetReportsOpen(false);
                            setIsMaintenanceReportsOpen(false);
                            setIsReservationReportsOpen(false);
                            setIsStatusReportsOpen(false);
                            setIsTransactionReportsOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isCheckoutReportsActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <span className={cn(
                          "transition-colors flex-1 text-left",
                          isCheckoutReportsActive ? "text-orange-600 dark:text-orange-500" : "text-orange-600 dark:text-orange-500"
                        )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        {isCheckoutReportsOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isCheckoutReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isCheckoutReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isCheckoutReportsOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {checkoutReportsSubmenu.map((checkoutSubItem) => {
                            const checkoutSubActive = isActive(checkoutSubItem.href);
                            return (
                              <Link
                                key={checkoutSubItem.href}
                                href={checkoutSubItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  checkoutSubActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  checkoutSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{checkoutSubItem.label}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  checkoutSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (hasSubmenu && isDepreciationReports) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsDepreciationReportsOpen(!isDepreciationReportsOpen);
                          if (!isDepreciationReportsOpen) {
                            setIsCustomReportsOpen(false);
                            setIsInventoryReportsOpen(false);
                            setIsInventoryItemsOpen(false);
                            setIsInventoryTransactionsOpen(false);
                            setIsAssetReportsOpen(false);
                            setIsAuditReportsOpen(false);
                            setIsCheckoutReportsOpen(false);
                            setIsLeasedAssetReportsOpen(false);
                            setIsMaintenanceReportsOpen(false);
                            setIsReservationReportsOpen(false);
                            setIsStatusReportsOpen(false);
                            setIsTransactionReportsOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isDepreciationReportsActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <span className={cn(
                          "transition-colors flex-1 text-left",
                          isDepreciationReportsActive ? "text-orange-600 dark:text-orange-500" : "text-orange-600 dark:text-orange-500"
                        )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        {isDepreciationReportsOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isDepreciationReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isDepreciationReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isDepreciationReportsOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {depreciationReportsSubmenu.map((depreciationSubItem) => {
                            const depreciationSubActive = isActive(depreciationSubItem.href);
                            return (
                              <Link
                                key={depreciationSubItem.href}
                                href={depreciationSubItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  depreciationSubActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  depreciationSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{depreciationSubItem.label}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  depreciationSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (hasSubmenu && isLeasedAssetReports) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsLeasedAssetReportsOpen(!isLeasedAssetReportsOpen);
                          if (!isLeasedAssetReportsOpen) {
                            setIsCustomReportsOpen(false);
                            setIsInventoryReportsOpen(false);
                            setIsInventoryItemsOpen(false);
                            setIsInventoryTransactionsOpen(false);
                            setIsAssetReportsOpen(false);
                            setIsAuditReportsOpen(false);
                            setIsCheckoutReportsOpen(false);
                            setIsDepreciationReportsOpen(false);
                            setIsMaintenanceReportsOpen(false);
                            setIsReservationReportsOpen(false);
                            setIsStatusReportsOpen(false);
                            setIsTransactionReportsOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isLeasedAssetReportsActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <span className={cn(
                          "transition-colors flex-1 text-left",
                          isLeasedAssetReportsActive ? "text-orange-600 dark:text-orange-500" : "text-orange-600 dark:text-orange-500"
                        )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        {isLeasedAssetReportsOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isLeasedAssetReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isLeasedAssetReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isLeasedAssetReportsOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {leasedAssetReportsSubmenu.map((leasedAssetSubItem) => {
                            const leasedAssetSubActive = isActive(leasedAssetSubItem.href);
                            return (
                              <Link
                                key={leasedAssetSubItem.href}
                                href={leasedAssetSubItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  leasedAssetSubActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  leasedAssetSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{leasedAssetSubItem.label}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  leasedAssetSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (hasSubmenu && isMaintenanceReports) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsMaintenanceReportsOpen(!isMaintenanceReportsOpen);
                          if (!isMaintenanceReportsOpen) {
                            setIsCustomReportsOpen(false);
                            setIsInventoryReportsOpen(false);
                            setIsInventoryItemsOpen(false);
                            setIsInventoryTransactionsOpen(false);
                            setIsAssetReportsOpen(false);
                            setIsAuditReportsOpen(false);
                            setIsCheckoutReportsOpen(false);
                            setIsDepreciationReportsOpen(false);
                            setIsLeasedAssetReportsOpen(false);
                            setIsReservationReportsOpen(false);
                            setIsStatusReportsOpen(false);
                            setIsTransactionReportsOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isMaintenanceReportsActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <span className={cn(
                          "transition-colors flex-1 text-left",
                          isMaintenanceReportsActive ? "text-orange-600 dark:text-orange-500" : "text-orange-600 dark:text-orange-500"
                        )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        {isMaintenanceReportsOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isMaintenanceReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isMaintenanceReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isMaintenanceReportsOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {maintenanceReportsSubmenu.map((maintenanceSubItem) => {
                            const maintenanceSubActive = isActive(maintenanceSubItem.href);
                            return (
                              <Link
                                key={maintenanceSubItem.href}
                                href={maintenanceSubItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  maintenanceSubActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  maintenanceSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{maintenanceSubItem.label}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  maintenanceSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (hasSubmenu && isReservationReports) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsReservationReportsOpen(!isReservationReportsOpen);
                          if (!isReservationReportsOpen) {
                            setIsCustomReportsOpen(false);
                            setIsInventoryReportsOpen(false);
                            setIsInventoryItemsOpen(false);
                            setIsInventoryTransactionsOpen(false);
                            setIsAssetReportsOpen(false);
                            setIsAuditReportsOpen(false);
                            setIsCheckoutReportsOpen(false);
                            setIsDepreciationReportsOpen(false);
                            setIsLeasedAssetReportsOpen(false);
                            setIsMaintenanceReportsOpen(false);
                            setIsStatusReportsOpen(false);
                            setIsTransactionReportsOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isReservationReportsActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <span className={cn(
                          "transition-colors flex-1 text-left",
                          isReservationReportsActive ? "text-orange-600 dark:text-orange-500" : "text-orange-600 dark:text-orange-500"
                        )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        {isReservationReportsOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isReservationReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isReservationReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isReservationReportsOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {reservationReportsSubmenu.map((reservationSubItem) => {
                            const reservationSubActive = isActive(reservationSubItem.href);
                            return (
                              <Link
                                key={reservationSubItem.href}
                                href={reservationSubItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  reservationSubActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  reservationSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{reservationSubItem.label}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  reservationSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (hasSubmenu && isStatusReports) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsStatusReportsOpen(!isStatusReportsOpen);
                          if (!isStatusReportsOpen) {
                            setIsCustomReportsOpen(false);
                            setIsInventoryReportsOpen(false);
                            setIsInventoryItemsOpen(false);
                            setIsInventoryTransactionsOpen(false);
                            setIsAssetReportsOpen(false);
                            setIsAuditReportsOpen(false);
                            setIsCheckoutReportsOpen(false);
                            setIsDepreciationReportsOpen(false);
                            setIsLeasedAssetReportsOpen(false);
                            setIsMaintenanceReportsOpen(false);
                            setIsReservationReportsOpen(false);
                            setIsTransactionReportsOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isStatusReportsActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <span className={cn(
                          "transition-colors flex-1 text-left",
                          isStatusReportsActive ? "text-orange-600 dark:text-orange-500" : "text-orange-600 dark:text-orange-500"
                        )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        {isStatusReportsOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isStatusReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isStatusReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isStatusReportsOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {statusReportsSubmenu.map((statusSubItem) => {
                            const statusSubActive = isActive(statusSubItem.href);
                            return (
                              <Link
                                key={statusSubItem.href}
                                href={statusSubItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  statusSubActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  statusSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{statusSubItem.label}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  statusSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (hasSubmenu && isTransactionReports) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsTransactionReportsOpen(!isTransactionReportsOpen);
                          if (!isTransactionReportsOpen) {
                            setIsCustomReportsOpen(false);
                            setIsInventoryReportsOpen(false);
                            setIsInventoryItemsOpen(false);
                            setIsInventoryTransactionsOpen(false);
                            setIsAssetReportsOpen(false);
                            setIsAuditReportsOpen(false);
                            setIsCheckoutReportsOpen(false);
                            setIsDepreciationReportsOpen(false);
                            setIsLeasedAssetReportsOpen(false);
                            setIsMaintenanceReportsOpen(false);
                            setIsReservationReportsOpen(false);
                            setIsStatusReportsOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isTransactionReportsActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <span className={cn(
                          "transition-colors flex-1 text-left",
                          isTransactionReportsActive ? "text-orange-600 dark:text-orange-500" : "text-orange-600 dark:text-orange-500"
                        )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        {isTransactionReportsOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isTransactionReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isTransactionReportsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isTransactionReportsOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {transactionReportsSubmenu.map((transactionSubItem) => {
                            const transactionSubActive = isActive(transactionSubItem.href);
                            return (
                              <Link
                                key={transactionSubItem.href}
                                href={transactionSubItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  transactionSubActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  transactionSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{transactionSubItem.label}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  transactionSubActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                      active
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <span className={cn(
                      "transition-colors flex-1",
                      active ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                    )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                    <ChevronRight className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                    )} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Tools Section */}
        <div className="mt-1">
          <button
            onClick={() => {
              setIsToolsOpen(!isToolsOpen);
              if (!isToolsOpen) {
                setIsAlertsOpen(false);
                setIsAssetsOpen(false);
                setIsInventoryOpen(false);
                setIsListsOpen(false);
                setIsReportsOpen(false);
                setIsAdvancedOpen(false);
                setIsSetupOpen(false);
                setIsHelpOpen(false);
              }
            }}
            className={cn(
              "group w-full flex items-center gap-3 px-3 py-2 rounded mb-1 transition-colors",
              isToolsActive
                ? "bg-yellow-500 text-white"
                : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Wrench className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              isToolsActive ? "text-white" : "text-orange-500 group-hover:text-orange-600"
            )} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>Tools</span>
                {isToolsOpen ? (
                  <ChevronDown className={cn(
                    "h-4 w-4 shrink-0",
                    isToolsActive ? "text-white" : "text-gray-900"
                  )} />
                ) : (
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0",
                    isToolsActive ? "text-white" : "text-gray-900"
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
                      "group flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                      active
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
          )}
        </div>

        {/* Advanced Section */}
        <div className="mt-1">
          <button
            onClick={() => {
              setIsAdvancedOpen(!isAdvancedOpen);
              if (!isAdvancedOpen) {
                setIsAlertsOpen(false);
                setIsAssetsOpen(false);
                setIsInventoryOpen(false);
                setIsListsOpen(false);
                setIsReportsOpen(false);
                setIsToolsOpen(false);
                setIsSetupOpen(false);
                setIsHelpOpen(false);
              }
            }}
            className={cn(
              "group w-full flex items-center gap-3 px-3 py-2 rounded mb-1 transition-colors",
              isAdvancedActive
                ? "bg-yellow-500 text-white"
                : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Briefcase className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              isAdvancedActive ? "text-white" : "text-orange-500 group-hover:text-orange-600"
            )} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>Advanced</span>
                {isAdvancedOpen ? (
                  <ChevronDown className={cn(
                    "h-4 w-4 shrink-0",
                    isAdvancedActive ? "text-white" : "text-gray-900"
                  )} />
                ) : (
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0",
                    isAdvancedActive ? "text-white" : "text-gray-900"
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
                      "group flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                      active
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
          )}
        </div>

        {/* Setup Section */}
        <div className="mt-1">
          <button
            onClick={() => {
              setIsSetupOpen(!isSetupOpen);
              if (!isSetupOpen) {
                setIsAlertsOpen(false);
                setIsAssetsOpen(false);
                setIsInventoryOpen(false);
                setIsListsOpen(false);
                setIsReportsOpen(false);
                setIsToolsOpen(false);
                setIsAdvancedOpen(false);
                setIsHelpOpen(false);
              }
            }}
            className={cn(
              "group w-full flex items-center gap-3 px-3 py-2 rounded mb-1 transition-colors",
              isSetupActive
                ? "bg-yellow-500 text-white"
                : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Settings className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              isSetupActive ? "text-white" : "text-orange-500 group-hover:text-orange-600"
            )} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>Setup</span>
                {isSetupOpen ? (
                  <ChevronDown className={cn(
                    "h-4 w-4 shrink-0",
                    isSetupActive ? "text-white" : "text-gray-900"
                  )} />
                ) : (
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0",
                    isSetupActive ? "text-white" : "text-gray-900"
                  )} />
                )}
              </>
            )}
          </button>
          {isSetupOpen && !isCollapsed && (
            <div className="ml-4 mt-1 space-y-0">
              {setupSubmenu.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const hasSubmenu = (item as any).hasSubmenu;
                const isDatabases = item.href === "/setup/databases";
                const isCustomizeForms = item.href === "/setup/customize-forms";

                if (hasSubmenu && isDatabases) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsDatabasesOpen(!isDatabasesOpen);
                          if (!isDatabasesOpen) {
                            setIsCustomizeFormsOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isDatabasesActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isDatabasesActive ? "text-orange-600 dark:text-orange-500" : "text-orange-500 group-hover:text-orange-600"
                          )} />
                          <span className={cn(
                            "transition-colors flex-1 text-left",
                            isDatabasesActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                          )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        </div>
                        {isDatabasesOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isDatabasesActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isDatabasesActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isDatabasesOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {databasesSubmenu.map((subItem) => {
                            const subActive = isActive(subItem.href);
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  subActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  subActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{subItem.label}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  subActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (hasSubmenu && isCustomizeForms) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setIsCustomizeFormsOpen(!isCustomizeFormsOpen);
                          if (!isCustomizeFormsOpen) {
                            setIsDatabasesOpen(false);
                          }
                        }}
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors",
                          isCustomizeFormsActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isCustomizeFormsActive ? "text-orange-600 dark:text-orange-500" : "text-orange-500 group-hover:text-orange-600"
                          )} />
                          <span className={cn(
                            "transition-colors flex-1 text-left",
                            isCustomizeFormsActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                          )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                        </div>
                        {isCustomizeFormsOpen ? (
                          <ChevronDown className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isCustomizeFormsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        ) : (
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isCustomizeFormsActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                          )} />
                        )}
                      </button>
                      {isCustomizeFormsOpen && (
                        <div className="ml-4 mt-0 space-y-0">
                          {customizeFormsSubmenu.map((subItem) => {
                            const subActive = isActive(subItem.href);
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors",
                                  subActive
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                                <span className={cn(
                                  "transition-colors flex-1",
                                  subActive ? "text-orange-600 dark:text-orange-500" : "text-gray-900 dark:text-gray-400"
                                )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{subItem.label}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  subActive ? "text-orange-600 dark:text-orange-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                      active
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
          )}
        </div>

        {/* Help Section */}
        <div className="mt-1">
          <button
            onClick={() => {
              setIsHelpOpen(!isHelpOpen);
              if (!isHelpOpen) {
                setIsAlertsOpen(false);
                setIsAssetsOpen(false);
                setIsInventoryOpen(false);
                setIsListsOpen(false);
                setIsReportsOpen(false);
                setIsToolsOpen(false);
                setIsAdvancedOpen(false);
                setIsSetupOpen(false);
              }
            }}
            className={cn(
              "group w-full flex items-center gap-3 px-3 py-2 rounded mb-1 transition-colors",
              isHelpActive
                ? "bg-yellow-500 text-white"
                : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <LifeBuoy className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              isHelpActive ? "text-white" : "text-orange-500 group-hover:text-orange-600"
            )} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-sm text-left" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}>Help / Support</span>
                {isHelpOpen ? (
                  <ChevronDown className={cn(
                    "h-4 w-4 shrink-0",
                    isHelpActive ? "text-white" : "text-gray-900"
                  )} />
                ) : (
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0",
                    isHelpActive ? "text-white" : "text-gray-900"
                  )} />
                )}
              </>
            )}
          </button>
          {isHelpOpen && !isCollapsed && (
            <div className="ml-4 mt-1 space-y-1">
              {helpSubmenu.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                      active
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <span className={cn(
                      "transition-colors",
                      active ? "text-white" : "text-gray-900 dark:text-gray-400 group-hover:text-orange-500"
                    )} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Other Menu Items */}
        {otherMenuItems.filter(item => !item.hasSubmenu).map((item) => {
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

