"use client";

import { useEffect } from "react";

export const useViewportCalculator = (): void => {
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const documentWidth = document.documentElement.clientWidth;
      const scrollBarWidth = vw - documentWidth;

      const adustmentwidth = vw - scrollBarWidth;

      document.documentElement.style.setProperty("--vw", `${adustmentwidth}px`);

      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
};
