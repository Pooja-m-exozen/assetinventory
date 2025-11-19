"use client";

import { useState, useEffect } from "react";

const features = [
  "Unlimited Customer Reports",
  "QR Code Scanning",
  "Maintenance Scheduling",
  "Checkin and Checkout",
  "Cloud Based",
  "Unlimited User Configurable Emails",
];

export default function AnimatedHeadline() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFeature = features[currentIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && currentText.length < currentFeature.length) {
      // Typing out the feature
      timeout = setTimeout(() => {
        setCurrentText(currentFeature.substring(0, currentText.length + 1));
      }, 100);
    } else if (!isDeleting && currentText.length === currentFeature.length) {
      // Finished typing, wait then start deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && currentText.length > 0) {
      // Deleting the text
      timeout = setTimeout(() => {
        setCurrentText(currentFeature.substring(0, currentText.length - 1));
      }, 50);
    } else if (isDeleting && currentText.length === 0) {
      // Finished deleting, move to next feature
      setIsDeleting(false);
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next >= features.length ? 0 : next;
      });
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex]);

  return (
    <div className="min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] flex items-center">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
        <span className="inline-block min-w-[200px] sm:min-w-[300px] text-gray-900 dark:text-gray-50">
          {currentText || "\u00A0"}
          <span className="animate-pulse ml-1">|</span>
        </span>
      </h1>
    </div>
  );
}

