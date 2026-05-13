"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatbotWindow from "./ChatbotWindow";
import { getCustomerAccessToken } from "@/lib/shopifyCustomer";

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [hasPhone, setHasPhone] = useState<boolean | null>(null);

  useEffect(() => {
    checkCustomerStatus();
  }, []);

  const checkCustomerStatus = async () => {
    // Check if user has customer access token cookie
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('customerAccessToken='));
    
    if (tokenCookie) {
      setIsLoggedIn(true);
      
      // Get customer email from cookie
      const emailCookie = cookies.find(c => c.trim().startsWith('customerEmail='));
      const email = emailCookie ? decodeURIComponent(emailCookie.split('=')[1]) : '';
      
      // Fetch customer details from Shopify
      try {
        const response = await fetch('/api/customer/details', {
          headers: {
            'Content-Type': 'application/json',
            'x-customer-email': email
          }
        });
        const data = await response.json();
        setCustomerData(data);
        setHasPhone(!!data.phone);
      } catch (error) {
        console.error('Failed to fetch customer:', error);
      }
    } else {
      setIsLoggedIn(false);
      setHasPhone(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="mb-4">
          <ChatbotWindow 
            onClose={() => setIsOpen(false)}
            isLoggedIn={isLoggedIn}
            hasPhone={hasPhone}
            customerData={customerData}
          />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
}