import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";

import { getOrders } from "@/lib/orders.utils";
import { getCurrentUser } from "@/lib/auth.utils";
import PaginatedOrders from "@/components/paginated-orders";

interface OrdersPageProps {
  searchParams: { [key: string]: string };
}

async function OrdersPage({ searchParams }: OrdersPageProps) {
  const page = searchParams.page;

  const currentUser = await getCurrentUser(headers);

  if (!page) {
    redirect("/orders/?page=1");
  }

  const pageNum = isNaN(parseInt(page)) ? 1 : parseInt(page);

  const ordersPageRes = await getOrders(headers, pageNum);
  const ordersPage = ordersPageRes.data as OrdersPage;

  return (
    <section className="w-full h-full">
      <ScrollArea className="w-full h-full">
        <div className="w-full h-full flex flex-col p-8">
          {!ordersPageRes.success ? (
            <div className="text-red-500 w-full justify-center">
              Error Fetching Orders
            </div>
          ) : (
            <PaginatedOrders
              orders={ordersPage.orders || []}
              page={ordersPage.page || pageNum}
              limit={ordersPage.limit || 10}
              totalPages={ordersPage.totalPages || 1}
              currentUser={currentUser}
            />
          )}
        </div>
      </ScrollArea>
    </section>
  );
}

export default OrdersPage;
