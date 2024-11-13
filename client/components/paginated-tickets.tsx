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

interface PaginatedTicketsProps {
  tickets: Ticket[];
  page: number;
  limit: number;
  totalPages: number;
  currentUser?: UserPayload | null;
}

function PaginatedTickets({
  tickets,
  page,
  totalPages,
  currentUser,
}: PaginatedTicketsProps) {
  const nextPage = page + 1;
  const prevPage = page - 1;

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex flex-col gap-2">
        {tickets?.length === 0 ? (
          <div>No tickets found</div>
        ) : (
          <Table>
            <TableCaption>A list of tickets.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets?.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    <span>{ticket.title}</span>
                  </TableCell>
                  <TableCell className="text-right">${ticket.price}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/tickets/${ticket.id}`} className="underline">
                      View
                    </Link>
                    {/* {currentUser?.id === ticket.userId && (
                      <Link
                        href={`/tickets/edit/${ticket.id}`}
                        className="underline"
                      >
                        Edit
                      </Link>
                    )} */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {tickets?.length > 0 ? (
        <div className="w-full">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={hasPrevPage ? `/?page=${prevPage}` : "#"}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`/?page=${1}`}>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={hasNextPage ? `/?page=${nextPage}` : "#"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
}

export default PaginatedTickets;
