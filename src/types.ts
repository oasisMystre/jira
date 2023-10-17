export type Type = "added" | "modified" | "removed";
export type Method =
  | "GET"
  | "PUT"
  | "POST"
  | "PATCH"
  | "DELETE"
  | "SUBSCRIPTION";

export interface Response<T> {
  [key: string]: any;

  data: T;
  type?: Type;
  status: number;
  action: string;
  requestId: string;
  method: Method & "SUBSCRIPTION";
}

export interface Request {
  [key: string]: any;

  event: string;
  method?: Method;
  action?: string;
  requestId?: string;
  data?: Record<string, any>;
  query?: Record<string, any>;
}

export type Listener<T> = (response: Response<T>) => void;

export type NonNull<T> = { [Property in keyof T]-?: T[Property] };

export type Callback<T> = {
  onError?: Listener<T>;
  onSuccess: Listener<T>;
};
