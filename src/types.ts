export interface Product {
  id: number | string;
  name: string;
  category: string;
  image: string;
  originalPrice: string | number;
  price: string | number;
  link?: string;
  specs?: string[];
  description?: string;
  stock?: number;
  sellerId?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const CATEGORIES = [
  "Gaming Phones",
  "Gaming Earphones",
  "Gaming Earbuds",
  "Gaming Headphones",
  "Fan Section",
  "Finger Sleeve"
];
