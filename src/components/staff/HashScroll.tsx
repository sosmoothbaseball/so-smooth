"use client";

import { useEffect } from "react";

export default function HashScroll() {
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const jump = () => document.getElementById(id)?.scrollIntoView({ block: "start" });
    jump();
    const timer = window.setTimeout(jump, 80);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
