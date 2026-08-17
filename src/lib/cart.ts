export type StoredCartLine = {
  key: string;
  productId: number | null;
  nameAr: string;
  nameFr: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
};

const CART_KEY = "clochette-cart";

export function readCart(): StoredCartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(lines: StoredCartLine[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  } catch {
    // ignore storage errors
  }
}
