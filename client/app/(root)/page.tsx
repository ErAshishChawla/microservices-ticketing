import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getTickets } from "@/lib/tickets.utils";
import PaginatedTickets from "@/components/paginated-tickets";
import { getCurrentUser } from "@/lib/auth.utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageProps {
  searchParams: { [key: string]: string };
}

async function Page({ searchParams }: PageProps) {
  const page = searchParams.page;

  const currentUser = await getCurrentUser(headers);

  if (!page) {
    redirect("/?page=1");
  }

  const pageNum = isNaN(parseInt(page)) ? 1 : parseInt(page);

  const ticketsPageRes = await getTickets(headers, pageNum);
  const ticketsPage = ticketsPageRes.data as TicketPage;

  return (
    <div className="w-full h-full">
      <ScrollArea className="w-full h-full">
        <div className="w-full h-full flex flex-col p-8 gap-4">
          <div className="w-full flex flex-row gap-4 justify-between">
            <h1 className="text-3xl font-bold">Tickets</h1>

            {currentUser && (
              <Link href={"/tickets/new"}>
                <Button>
                  <Plus className="w-4 h-4" />
                  <span>Create Ticket</span>
                </Button>
              </Link>
            )}
          </div>
          {!ticketsPageRes.success ? (
            <div className="text-red-500 w-full justify-center">
              Error Fetching Tickets
            </div>
          ) : (
            <PaginatedTickets
              tickets={ticketsPage.tickets || []}
              page={ticketsPage.page || pageNum}
              limit={ticketsPage.limit || 10}
              totalPages={ticketsPage.totalPages || 1}
              currentUser={currentUser}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default Page;
