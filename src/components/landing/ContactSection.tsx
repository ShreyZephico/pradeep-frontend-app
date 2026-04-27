"use client";

import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./css/ContactSection.module.css";
import contactData from "@/data/contactData.json";

interface ContactInfo {
  label: string;
  value: string;
  icon: string;
  link?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  // ---------------- VALIDATION ----------------
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    else if (formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Invalid phone number";

    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.length < 10)
      newErrors.message = "Min 10 characters required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const onRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  // ---------------- FIXED SUBMIT (REAL NETLIFY WORKING) ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!recaptchaToken) {
      setSubmitStatus({
        type: "error",
        message: "Please verify reCAPTCHA",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. reCAPTCHA verify
      const verifyRes = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: recaptchaToken }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success) throw new Error("reCAPTCHA failed");

      // 2. REAL NETLIFY SUBMISSION (IMPORTANT FIX)
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "form-name": "consultation",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      if (!response.ok) throw new Error("Netlify submission failed");

      // SUCCESS
      setSubmitStatus({
        type: "success",
        message: "Thank you! We will contact you soon.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } catch (err) {
      console.error(err);

      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Try again.",
      });
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    }
  };

  const contactInfo: ContactInfo[] = [
    {
      label: "Phone",
      value: contactData.contact.phone,
      icon: "📞",
      link: `tel:${contactData.contact.phone}`,
    },
    {
      label: "Email",
      value: contactData.contact.email,
      icon: "✉️",
      link: `mailto:${contactData.contact.email}`,
    },
    {
      label: "WhatsApp",
      value: "Chat",
      icon: "💬",
      link: contactData.social.whatsapp,
    },
    { label: "Studio", value: contactData.contact.studio, icon: "📍" },
    { label: "Hours", value: contactData.contact.hours, icon: "🕐" },
  ];

  return (
    <section ref={sectionRef} id="contact" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <h3>Contact Us</h3>

          {submitStatus.type && (
            <p>{submitStatus.message}</p>
          )}

          <form onSubmit={handleSubmit} className={styles.contactForm}>
            {/* REQUIRED for Netlify detection */}
            <input type="hidden" name="form-name" value="consultation" />

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
            />

            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
            />

            {/* reCAPTCHA */}
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              onChange={onRecaptchaChange}
            />

            <button disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}