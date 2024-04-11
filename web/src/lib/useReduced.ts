"use client";

import { useState, useEffect } from "react";

export function useIsReduced() {
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    var previosIsReduced = false;
    function handleResize() {
      if (window.innerWidth < 1024 && !previosIsReduced) {
        previosIsReduced = true;
        setIsReduced(true);
      } else if (window.innerWidth >= 1024 && previosIsReduced) {
        previosIsReduced = false;
        setIsReduced(false);
      }
    }
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isReduced;
}
