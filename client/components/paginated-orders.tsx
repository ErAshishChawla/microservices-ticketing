import React from "react";
import Link from "next/link";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PaginatedOrdersProps {
  orders: Order[];
  page: number;
  limit: number;
  totalPages: number;
  currentUser?: UserPayload | null;
}

function PaginatedOrders({
  orders,
  page,
  totalPages,
  currentUser,
}: PaginatedOrdersProps) {
  const nextPage = page + 1;
  const prevPage = page - 1;

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex flex-col gap-2">
        {orders?.length === 0 ? (
          <div>No tickets found</div>
        ) : (
          <Table>
            <TableCaption>A list of orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order Id</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <span>{order.id}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.ticket.price}
                  </TableCell>
                  <TableCell className="text-right">
                    <span>{order.status}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {orders?.length > 0 ? (
        <div className="w-full">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={hasPrevPage ? `/orders/?page=${prevPage}` : "#"}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`/orders/?page=${1}`}>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={hasNextPage ? `/orders/?page=${nextPage}` : "#"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
}

export default PaginatedOrders;
