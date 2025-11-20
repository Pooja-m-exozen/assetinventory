"use client";

import { Phone, MapPin, Mail, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactUsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Phone className="h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
          Contact Us
        </h1>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Technical Support Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Settings className="h-6 w-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Technical Support
                </h2>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  We love hearing from our customers. If you have any questions about AssetTiger, please call or email us. Please include your AssetTiger account number-it lets us resolve your request faster and more accurately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Address Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Address
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    203 Jay St, Suite 800,<br />
                    Brooklyn, NY 11201, USA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Phone className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Contact Support
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      <a href="tel:+18882907750" className="hover:text-orange-500 transition-colors">
                        +1 888-290-7750
                      </a>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      <a href="tel:+17187971900" className="hover:text-orange-500 transition-colors">
                        +1 718-797-1900
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Mail className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Email
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    <a href="mailto:info@assettiger.com" className="hover:text-orange-500 transition-colors break-all">
                      info@assettiger.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=203+Jay+St,+Suite+800,+Brooklyn,+NY+11201&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="AssetTiger Office Location"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

