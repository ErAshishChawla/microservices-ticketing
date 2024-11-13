import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import CreateTicketForm from "@/components/create-ticket-form";

function NewTicketPage() {
  return (
    <section className="w-full h-full">
      <ScrollArea className="w-full h-full">
        <div className="w-full h-full flex flex-col p-8 gap-4">
          <div className="w-full flex justify-center">
            <CreateTicketForm />
          </div>
        </div>
      </ScrollArea>
    </section>
  );
}

export default NewTicketPage;
