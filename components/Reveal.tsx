"use client";

import { useEffect, useRef, useState } from "react";

/** Fades + lifts its children in the first time they scroll into view. */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Safety net: reveal after a beat if the observer never reports — also
    // covers browsers without IntersectionObserver — so content can never be
    // left permanently hidden.
    const fallback = window.setTimeout(() => setVisible(true), 2500);
    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setVisible(true);
              io?.disconnect();
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
    }
    return () => {
      io?.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
