"use client";

import { useEffect } from "react";

/**
 * Global scroll-reveal observer.
 * Adds .vis class to elements with .r-up, .r-left, .r-right, .r-scale, .r-fade
 * when they enter the viewport.
 */
export function ScrollReveal() {
  useEffect(() => {
    const selectors = ".r-up, .r-left, .r-right, .r-scale, .r-fade";

    function observeAll() {
      const elements = document.querySelectorAll(selectors);
      elements.forEach((el) => {
        if (!el.classList.contains("vis")) {
          observer.observe(el);
        }
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    // Initial observation
    observeAll();

    // Re-observe on route changes (MutationObserver catches new DOM nodes)
    const mutationObs = new MutationObserver(() => {
      observeAll();
    });
    mutationObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObs.disconnect();
    };
  }, []);

  return null;
}
