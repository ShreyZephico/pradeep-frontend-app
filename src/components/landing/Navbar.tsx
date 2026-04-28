"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./css/Navbar.module.css";

// Import contact data
import contactData from "@/data/contactData.json";

const menuItems = [
  { label: "Home", href: "#home" },
  { label: "Collections", href: "#collections" },
  { label: "Products", href: "#featured-products" },
  { label: "Craft", href: "#craftsmanship" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ""}`}
    >
      <div className={styles.container}>
        <a href="#home" className={styles.brand} aria-label="Go to homepage">
          <div className={styles.logoWrap}>
            {!logoError ? (
              <Image
                src="/logo.png"
                alt={`${contactData.brand.name} logo`}
                width={44}
                height={44}
                className={styles.logo}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className={styles.fallbackIcon}>💎</div>
            )}
          </div>
          <div>
            <p className={styles.brandName}>{contactData.brand.name}</p>
            <p className={styles.brandTag}>{contactData.brand.tagline}</p>
          </div>
        </a>

        <nav className={styles.desktopMenu} aria-label="Primary">
          {menuItems.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href="#featured-products" className={styles.secondaryAction}>
            Discover Pieces
          </a>
          <a href="#contact" className={styles.primaryAction}>
            Book Appointment
          </a>
          <button
            type="button"
            className={`${styles.mobileToggle} ${
              isMenuOpen ? styles.mobileToggleActive : ""
            }`}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        className={`${styles.mobileMenu} ${
          isMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <a
          href="#contact"
          className={styles.mobileAction}
          onClick={() => setIsMenuOpen(false)}
        >
          Book Appointment
        </a>
      </div>
    </header>
  );
}