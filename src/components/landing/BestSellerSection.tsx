"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { products } from "@/data/products";
import styles from "./css/BestSellerSection.module.css";

const featuredProducts = products.slice(0, 4);

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function BestSellerSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

    const currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id="featured-products" className={styles.section}>
      {/* Background */}
      <div className={styles.bgElements}>
        <div className={styles.goldDust} />
        <div className={styles.diamondSparkles} />
        <div className={styles.luxuryPattern} />
        <div className={styles.marbleTexture} />
        <div className={styles.goldLinePattern} />
        <div className={styles.floatingDiamonds} />
      </div>

      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ""}`}>
          <div className={styles.headerContent}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowLine}></span>
              Featured Products
              <span className={styles.eyebrowLine}></span>
            </p>

            <h2 className={styles.title}>
              Best-Selling Favourites
              <span className={styles.goldText}> From The Studio</span>
            </h2>

            <p className={styles.description}>
              Discover our most loved pieces, crafted with precision and passion.
              Each design tells a story of timeless elegance.
            </p>

            <div className={styles.headerAccent} />
          </div>
        </div>

        <div className={`${styles.grid} ${isVisible ? styles.visible : ""}`}>
          {featuredProducts.map((product, index) => {
            const delay = (index * 0.1).toFixed(1); // ✅ stable value

            return (
              <article
                key={product.id}
                className={styles.card}
                style={{ animationDelay: `${delay}s` }}
              >
                <div className={styles.imageWrap}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={styles.image}
                  />

                  <div className={styles.imageOverlay} />

                  {product.badge && (
                    <span className={styles.badge}>{product.badge}</span>
                  )}

                  <div className={styles.quickView}>
                    <button
                      suppressHydrationWarning
                      className={styles.quickViewBtn}
                    >
                      Quick View
                    </button>
                  </div>
                </div>

                <div className={styles.body}>
                  <p className={styles.productType}>
                    <span className={styles.typeDot}></span>
                    Fine Jewellery
                  </p>

                  <h3 className={styles.productName}>{product.name}</h3>

                  <p className={styles.copy}>{product.description}</p>

                  <div className={styles.priceRow}>
                    <strong className={styles.currentPrice}>
                      {formatPrice(product.price)}
                    </strong>

                    {product.compareAtPrice && (
                      <span className={styles.originalPrice}>
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  <a href="#contact" className={styles.action}>
                    Enquire Now
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}