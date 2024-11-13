interface LayoutProps {
  children: React.ReactNode;
}

declare interface ApiResponseError {
  message: string;
  field?: string;
}

declare interface ApiResponseAttrs {
  statusCode: number;
  data?: any;
  errors?: ApiResponseError[];
}

declare interface ApiResponseJson {
  statusCode: number;
  errors?: ApiResponseError[];
  data?: any;
  success: boolean;
}

declare interface UserPayload {
  id: string;
  email: string;
}

declare interface ErrorPageProps {
  searchParams: {
    statusCode?: string;
    message?: string;
  };
}

declare interface KeyValueObject {
  [key: string]: any;
}

interface Ticket {
  id: string;
  title: string;
  price: string;
  userId: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}
declare interface TicketPage {
  tickets: Ticket[];
  page: number;
  limit: number;
  totalPages: number;
}

interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  expiresAt: string;
  ticket: Ticket;
  createdAt: string;
  updatedAt: string;
  version: number;
}

declare interface OrdersPage {
  orders: Order[];
  page: number;
  limit: number;
  totalPages: number;
}
