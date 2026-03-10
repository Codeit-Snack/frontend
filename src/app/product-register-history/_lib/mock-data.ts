import type { ProductRegistration } from "./types";

const baseItem: Omit<ProductRegistration, "id"> = {
  registeredAt: "2024. 07. 04",
  name: "코카콜라 제로",
  imageUrl: "https://placehold.co/64x64/e5e7eb/9ca3af?text=CD",
  category: "청량ㆍ탄산음료",
  price: 1900,
  productLink: "www.codeit.kr/products/coca-cola-zero",
};

export const mockProductRegistrations: ProductRegistration[] = Array.from(
  { length: 54 },
  (_, i) => ({
    ...baseItem,
    id: i + 1,
  })
);
