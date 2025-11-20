"use client";

import Image from "next/image";
import { Info } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Info className="h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
          About Us
        </h1>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* City Image and Text Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* City Skyline Image */}
          <div className="w-full lg:w-2/3">
            <div className="relative w-full h-64 lg:h-96 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="City Skyline"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/3 space-y-4">
            <div className="space-y-4 text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              <p className="text-base leading-relaxed">
                AssetTiger is a cloud-based asset management tool. Our system is created and managed by the same great team at MyAssetTag.com, a top 500 ecommerce company and the largest online retailer for asset tags.
              </p>
              <p className="text-base leading-relaxed">
                AssetTiger allows you to use your existing asset tags or you can buy tags from myassettag.com and benefit from our design technology, easy-to-customize system, and friendly customer service team. You can count on us for secure, affordable, and user-friendly service. We're continually improving our quality products, so you can experience a better way to organize your assets.
              </p>
              <p className="text-base leading-relaxed">
                Read AssetTiger user reviews at Capterra.com:
              </p>
            </div>

            {/* Capterra Badge */}
            <div className="flex items-center gap-2">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">4.6</div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-6" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Blair Brewster */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Blair Brewster"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Blair Brewster
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  President
                </p>
              </div>
            </div>

            {/* Chris McClain */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Chris McClain"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Chris McClain
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Chief Executive Officer
                </p>
              </div>
            </div>

            {/* Niall Murphy */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                <Image
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Niall Murphy"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Niall Murphy
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Chief Growth Officer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

