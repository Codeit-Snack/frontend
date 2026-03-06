"use client";

interface MembersPaginationProps {
  page: number;
  totalPages: number;
  onChangePage: (nextPage: number) => void;
}

function makePageNumbers(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (page >= totalPages - 2) {
    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [page - 2, page - 1, page, page + 1, page + 2];
}

export function MembersPagination({
  page,
  totalPages,
  onChangePage,
}: MembersPaginationProps) {
  const pageNumbers = makePageNumbers(page, totalPages);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <nav className="mt-6 flex items-center justify-center gap-1" aria-label="회원 목록 페이지 이동">
      <button
        type="button"
        onClick={() => canGoPrev && onChangePage(page - 1)}
        disabled={!canGoPrev}
        className="h-8 w-8 rounded-md text-sm text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {"<"}
      </button>
      {pageNumbers.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChangePage(value)}
          className={`h-8 min-w-8 rounded-md px-2 text-sm transition ${
            value === page
              ? "bg-orange-500 text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {value}
        </button>
      ))}
      <button
        type="button"
        onClick={() => canGoNext && onChangePage(page + 1)}
        disabled={!canGoNext}
        className="h-8 w-8 rounded-md text-sm text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {">"}
      </button>
    </nav>
  );
}
