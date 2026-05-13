"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Phone, LogIn, Menu, X } from 'lucide-react';
import { getImageUrl } from "@/utils/cloudinary";

// Import contact data
import contactData from "@/data/contactData.json";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Bespoke", href: "/bespoke" },
  { label: "Rates", href: "/rates" },
  { label: "Astrology", href: "/astrology" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userInitial, setUserInitial] = useState("");

  // Check login status on mount
  useEffect(() => {
    fetch("/api/auth/check")
      .then((response) => response.json())
      .then((data) => {
        if (!data.isAuthenticated) {
          setIsLoggedIn(false);
          return;
        }

        const email = data.email ?? localStorage.getItem("customerEmail");
        setIsLoggedIn(true);
        const name = email ? email.split("@")[0] : "User";
        setUserName(name);
        // Get first letter and capitalize it
        setUserInitial(name.charAt(0).toUpperCase());
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" }).catch(() => null);
    localStorage.removeItem("customerAccessToken");
    localStorage.removeItem("customerEmail");
    localStorage.removeItem("loginMethod");
    setIsLoggedIn(false);
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  // Get user initial for avatar (fallback to "U" if no name)
  const getInitial = () => {
    if (userInitial) return userInitial;
    if (userName) return userName.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200' 
          : 'bg-white border-b border-gray-200'
      }`}
    >
      {/* Top Promotion Bar */}
      <div className="bg-amber-50 text-center py-2 text-sm">
        <span className="text-amber-800">✨ 20% off diamond price on your chosen design</span>
      </div>
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section - Removed styles reference */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Go to homepage">
            <div className="flex items-center">
              {!logoError ? (
                <Image
                  src={getImageUrl("v1777380043/logo_xlwrhp.png")}
                  alt={`${contactData.brand.name} logo`}
                  width={44}
                  height={44}
                  className="rounded-full"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-11 h-11 bg-amber-100 rounded-full flex items-center justify-center text-2xl">
                  💎
                </div>
              )}
            </div>
            <div className="hidden sm:block">
              <p className="font-serif text-xl font-bold tracking-wide text-gray-900">
                {contactData.brand.name}
              </p>
              <p className="text-xs text-gray-500">{contactData.brand.tagline}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="text-gray-700 hover:text-amber-600 transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Phone - Desktop */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
              <Phone size={16} className="text-amber-600" />
              <span>1800-419-0066</span>
            </div>
            
            {/* Video Call Link */}
            <Link 
              href="/video-call" 
              className="hidden lg:block text-sm text-gray-600 hover:text-amber-600 transition-colors"
            >
              Video Call Cert
            </Link>
            
            {/* Search Icon */}
            <button className="text-gray-600 hover:text-amber-600 transition-colors">
              <Search size={20} />
            </button>
            
            {/* Auth Section - Only Profile Initial when logged in */}
            {isLoggedIn ? (
              <div className="relative group">
                {/* Profile Avatar with Initial - No name text, only initial */}
                <button className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-amber-600 rounded-full text-white font-semibold text-sm md:text-base hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2">
                  {getInitial()}
                </button>
                
                {/* Dropdown Menu on Hover */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500">My Account</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                      My Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                      My Orders
                    </Link>
                    <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                      Wishlist
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleLogin}
                  className="hidden md:flex items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
                <button 
                  onClick={handleSignup}
                  className="hidden md:block bg-amber-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Sign Up
                </button>
                
                {/* Mobile Auth Icons */}
                <button 
                  onClick={handleLogin}
                  className="md:hidden text-gray-600 hover:text-amber-600"
                >
                  <LogIn size={20} />
                </button>
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-gray-600 hover:text-amber-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Recently Viewed Bar */}
      <div className="bg-gray-50 border-t border-gray-200 py-2 text-sm text-center">
        <span className="text-gray-500">Recently Viewed:</span>
        <span className="ml-2 text-amber-700 font-medium">ANNIVERSARY SCHEME ✨</span>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 shadow-lg">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 px-3 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="h-px bg-gray-200 my-2"></div>
              
              <Link 
                href="/video-call" 
                className="py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 px-3 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Video Call Cert
              </Link>
              
              {!isLoggedIn ? (
                <>
                  <button 
                    onClick={() => {
                      handleLogin();
                      setIsMenuOpen(false);
                    }}
                    className="py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 px-3 rounded-lg transition-colors text-left"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      handleSignup();
                      setIsMenuOpen(false);
                    }}
                    className="py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors px-3"
                  >
                    Create Account
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitial()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500">My Account</p>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href="/profile" 
                    className="py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 px-3 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    href="/orders" 
                    className="py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 px-3 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link 
                    href="/wishlist" 
                    className="py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 px-3 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="py-2.5 text-red-600 hover:bg-red-50 px-3 rounded-lg transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}