export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "SUBSCRIPTION";

export type PaginatedResponse<T> = {
  count: number;
  results: T[];
  next: string | null;
  previous: string | null;
};

export type Response<T> = {
  data: T;
  event: string;
  status: number;
  method: Method;
  action: string;
  requestId: string | number;
};
