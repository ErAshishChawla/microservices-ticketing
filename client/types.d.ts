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

declare interface UserPayload {
  id: string;
  email: string;
}
