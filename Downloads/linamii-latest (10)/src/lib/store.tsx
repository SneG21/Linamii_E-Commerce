import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type StoreValue = {
  /** Wishlist of Shopify product handles, saved on this device. */
  wishlist: string[];
  toggleWishlist: (handle: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("linamii.wishlist");
      if (raw) setWishlist(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("linamii.wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = useCallback((handle: string) => {
    setWishlist((prev) => (prev.includes(handle) ? prev.filter((s) => s !== handle) : [...prev, handle]));
  }, []);

  const value = useMemo<StoreValue>(() => ({ wishlist, toggleWishlist }), [wishlist, toggleWishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
