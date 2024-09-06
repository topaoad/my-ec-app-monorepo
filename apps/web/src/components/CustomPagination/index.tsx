"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FC, useCallback } from "react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  href: string;
}

/**
 * 共通のページネーションコンポーネント
 * @param currentPage クエリパラメータから取得した現在のページ
 * @param totalPages 全ページ数
 * @param href リンク
 * @returns　なし
 */
const CustomPagination: FC<CustomPaginationProps> = (props) => {
  const { currentPage, totalPages, href } = props;

  // ページネーションの数を動的に取得
  const getPageNumbers = useCallback(() => {
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    let pageNumbers: (number | "ellipsis")[] = [];

    if (showEllipsisStart) {
      pageNumbers = [...pageNumbers, 1, "ellipsis"];
    }

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers = [...pageNumbers, i];
    }

    if (showEllipsisEnd) {
      pageNumbers = [...pageNumbers, "ellipsis", totalPages];
    }

    return pageNumbers;
  }, [currentPage, totalPages]);

  return (
    <div className="flex justify-center items-center my-8">
      <Pagination>
        <PaginationContent>
          {/* １ページ目のときは表示しない */}
          {currentPage !== 1 && (
            <PaginationItem>
              <PaginationPrevious href={`${href}?page=${currentPage - 1}`} />
            </PaginationItem>
          )}
          {getPageNumbers().map((pageNumber, index) => (
            <PaginationItem key={index}>
              {pageNumber === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={`${href}?page=${pageNumber}`}
                  isActive={currentPage === pageNumber}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          {/* currentPageがtotalPageと同じとき（最終ページ）は表示しない*/}
          {currentPage !== totalPages && (
            <PaginationItem>
              <PaginationNext
                href={`${href}?page=${currentPage + 1}`}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
