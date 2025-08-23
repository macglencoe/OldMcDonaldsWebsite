"use client";

import { useEffect, useState } from "react";

export function useSearchIndex() {
  const [index, setIndex] = useState([]);
  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data) => setIndex(data.pages || []))
      .catch(() => setIndex([]));
  }, []);
  return index;
}
