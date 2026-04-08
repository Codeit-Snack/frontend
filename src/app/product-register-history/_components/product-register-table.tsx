"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { ProductRegistration } from "../_lib/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from "@/components/ui/table";

interface ProductRegisterTableProps {
  items: ProductRegistration[];
  loading?: boolean;
}

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

export function ProductRegisterTable({
  items,
  loading = false,
}: ProductRegisterTableProps) {
  return (
    <div className="mt-6">
      <Table className="border-separate border-spacing-0">
        <TableHeader className="overflow-hidden rounded-t-[2rem] rounded-b-[2rem] border border-[#E0E0E0] bg-[#FFFFFF]">
          <tr className="text-left text-sm text-gray-500">
            <TableHead className="w-[140px] rounded-l-[2rem] border-t border-l border-b border-[#E0E0E0]">
              등록일
            </TableHead>
            <TableHead className="w-[200px] min-w-0 border-t border-b border-[#E0E0E0]">
              상품명
            </TableHead>
            <TableHead className="w-[160px] border-t border-b border-[#E0E0E0]">
              카테고리
            </TableHead>
            <TableHead className="w-[120px] border-t border-b border-[#E0E0E0]">
              가격
            </TableHead>
            <TableHead className="w-[180px] rounded-r-[2rem] border-t border-r border-b border-[#E0E0E0]">
              제품 링크
            </TableHead>
          </tr>
        </TableHeader>
        <TableBody className="bg-[#FBF8F4]">
          {loading ? (
            <TableEmpty colSpan={5}>상품 정보를 불러오는 중입니다.</TableEmpty>
          ) : items.length === 0 ? (
            <TableEmpty colSpan={5}>조회된 상품이 없습니다.</TableEmpty>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className="border-t border-[#E0E0E0]">
                <TableCell className="text-gray-700">{item.registeredAt}</TableCell>
                <TableCell>
                  <Link
                    href={`/products/${item.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <span className="text-gray-700 truncate group-hover:text-gray-900 group-hover:underline">
                      {item.name}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="text-gray-600">{item.category}</TableCell>
                <TableCell className="text-gray-700">
                  {formatPrice(item.price)}
                </TableCell>
                <TableCell>
                  <Link
                    href={`https://${item.productLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 truncate max-w-[160px]"
                  >
                    <span className="truncate">{item.productLink}</span>
                    <ExternalLink className="size-4 shrink-0" aria-hidden />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
