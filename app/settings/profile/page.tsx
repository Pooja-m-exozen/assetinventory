"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  UserCircle,
  Globe,
  Calendar,
  Clock,
  Mail,
  Phone,
  Upload,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useState, useRef } from "react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    firstname: "Shivanya",
    lastname: "DN",
    title: "",
    phone: "",
    email: "shivanya.dn@exozen.in",
    confirmEmail: "shivanya.dn@exozen.in",
    timezone: "(GMT -5:00) Eastern Time (US & Canad)",
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12-hour short -",
    sendOTPToEmail: "No",
    sendOTPToPhone: "No",
    makeDefaultSelection: "Yes",
    enableAccessibility: "No",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please upload an image file (JPG, GIF, PNG)");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleDeleteCompany = () => {
    if (confirm("Are you sure you want to delete your company account? This operation is irrevocable.")) {
      console.log("Deleting company...");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <UserCircle className="h-6 w-6 text-orange-500" />
          <h1
            className="text-2xl font-bold text-gray-900 dark:text-gray-50"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}
          >
            My Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCircle className="h-5 w-5 text-orange-500" />
              <h2
                className="text-lg font-semibold text-gray-900 dark:text-gray-50"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
              >
                User Info.
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Firstname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lastname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Localization Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-orange-500" />
              <h2
                className="text-lg font-semibold text-gray-900 dark:text-gray-50"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
              >
                Localization
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Adjust the settings to fit your profile, style, and your assets. You can override the company's timezone, date, and time format to view them in your own local format. All asset-related events like 'checkout', 'check in', etc., will be shown in your selected timezone, date, and time format.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Timezone
                </label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <option value="(GMT -5:00) Eastern Time (US & Canad)">(GMT -5:00) Eastern Time (US & Canad)</option>
                    <option value="(GMT +5:30) India Standard Time">(GMT +5:30) India Standard Time</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date Display format
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <select
                    name="dateFormat"
                    value={formData.dateFormat}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                    <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                    <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                  </select>
                  <span className="text-sm text-gray-500 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Example: 08/31/2014
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time format
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <select
                    name="timeFormat"
                    value={formData.timeFormat}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <option value="12-hour short -">12-hour short -</option>
                    <option value="24-hour">24-hour</option>
                  </select>
                  <span className="text-sm text-gray-500 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Example: 09:58 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Photo Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="h-5 w-5 text-gray-500" />
              <h2
                className="text-lg font-semibold text-gray-900 dark:text-gray-50"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
              >
                User Photo
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Upload a photo to set yourself apart from the crowd.
            </p>

            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/jpg,image/gif,image/png"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-yellow-500 transition-colors"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400 text-center px-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Click to upload image
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Only (JPG, GIF, PNG) are allowed
              </p>
            </div>
          </div>

          {/* Two Factor Authentication Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-red-500" />
              <h2
                className="text-lg font-semibold text-gray-900 dark:text-gray-50"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
              >
                Two Factor Authentication
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              This operation will increase your account security by adding one more level of security.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Send OTP to Email:
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendOTPToEmail"
                      value="Yes"
                      checked={formData.sendOTPToEmail === "Yes"}
                      onChange={(e) => handleRadioChange("sendOTPToEmail", e.target.value)}
                      className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendOTPToEmail"
                      value="No"
                      checked={formData.sendOTPToEmail === "No"}
                      onChange={(e) => handleRadioChange("sendOTPToEmail", e.target.value)}
                      className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>No</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Send OTP to Phone:
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendOTPToPhone"
                      value="Yes"
                      checked={formData.sendOTPToPhone === "Yes"}
                      onChange={(e) => handleRadioChange("sendOTPToPhone", e.target.value)}
                      className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendOTPToPhone"
                      value="No"
                      checked={formData.sendOTPToPhone === "No"}
                      onChange={(e) => handleRadioChange("sendOTPToPhone", e.target.value)}
                      className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Default Selection Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-red-500" />
              <h2
                className="text-lg font-semibold text-gray-900 dark:text-gray-50"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
              >
                Default Selection
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Make the prior selection in drop-down lists, like Site, Location, Dept etc. the default for the next selection when adding/editing assets or inventory items.
            </p>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Make Default Selection:
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="makeDefaultSelection"
                    value="Yes"
                    checked={formData.makeDefaultSelection === "Yes"}
                    onChange={(e) => handleRadioChange("makeDefaultSelection", e.target.value)}
                    className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="makeDefaultSelection"
                    value="No"
                    checked={formData.makeDefaultSelection === "No"}
                    onChange={(e) => handleRadioChange("makeDefaultSelection", e.target.value)}
                    className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Accessibility Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-red-500" />
              <h2
                className="text-lg font-semibold text-gray-900 dark:text-gray-50"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
              >
                Accessibility
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Accessibility features is designed to help people with disabilities use technology more easily.
            </p>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Accessibility:
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="enableAccessibility"
                    value="Yes"
                    checked={formData.enableAccessibility === "Yes"}
                    onChange={(e) => handleRadioChange("enableAccessibility", e.target.value)}
                    className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="enableAccessibility"
                    value="No"
                    checked={formData.enableAccessibility === "No"}
                    onChange={(e) => handleRadioChange("enableAccessibility", e.target.value)}
                    className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Delete Company Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2
              className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-4"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
            >
              Delete Company and Close Account
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              This operation will delete your company account, <strong>ALL user accounts</strong> and <strong>ALL asset data</strong> from AssetTiger. This operation is <strong>irrevocable</strong>.
            </p>

            <Button
              type="button"
              onClick={handleDeleteCompany}
              className="bg-red-500 hover:bg-red-600 text-white"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Delete Company, User Accounts and ALL Data
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

