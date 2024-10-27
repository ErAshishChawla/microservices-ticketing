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
