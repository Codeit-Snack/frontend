import { mockProductRegistrations } from "./mock-data";
import type {
  GetProductRegistrationsParams,
  GetProductRegistrationsResult,
} from "./types";

export async function getProductRegistrations(
  params: GetProductRegistrationsParams = {}
): Promise<GetProductRegistrationsResult> {
  const {
    keyword = "",
    page = 1,
    pageSize = 6,
    sort = "최신순",
  } = params;
  const normalizedKeyword = keyword.trim().toLowerCase();

  let filtered = normalizedKeyword
    ? mockProductRegistrations.filter(
        (item) =>
          item.name.toLowerCase().includes(normalizedKeyword) ||
          item.category.toLowerCase().includes(normalizedKeyword)
      )
    : [...mockProductRegistrations];

  if (sort === "낮은가격순") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === "높은가격순") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  await new Promise((resolve) => setTimeout(resolve, 150));

  return {
    items: filtered.slice(start, end),
    totalCount,
    totalPages,
    page: currentPage,
  };
}
