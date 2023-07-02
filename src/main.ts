import { v4 as uuid } from "uuid";

import { io, Socket } from "socket.io-client";

export type Method =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "SUBSCRIPTION";

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

export type SubscriptionResponse<T> = {
  type: "added" | "modified" | "removed";
} & Response<T>;

export type Callable<T extends any = any> = (response: T) => void;

export type RequestOptions = {
  data?: object;
  query?: object;
  method: Method;
  action: string;
};

export type RequestOption = Omit<RequestOptions, "method">;

export type Listener<T> = Record<Method, Record<string, T>>;

export type ListenOptions<T> = {
  selector: (data: any) => any;
  selectors: (response: Response<T>, selector: (data: any) => any) => any[];
} & RequestOption;

let client: Socket;

export const createClient = (...options: Parameters<typeof io>): Socket =>
  (client = io(...options));

const listeners: Listener<Record<string, Callable[]> | Callable[]> = {
  GET: {},
  POST: {},
  PUT: {},
  PATCH: {},
  DELETE: {},
  SUBSCRIPTION: {},
};

export const emit = <T>(
  event: string,
  options: RequestOptions,
  listener: Callable<T>[] | Callable<T>,
  requestId: string = uuid()
) => {
  switch (options.method) {
    case "SUBSCRIPTION":
      if (!listeners[options.method][options.action])
        listeners[options.method][options.action] = [];

      (listeners[options.method][options.action] as Callable[]).push(
        listener as Callable<T>
      );
      break;
    default:
      if (!listeners[options.method][options.action])
        listeners[options.method][options.action] = {};

      (listeners[options.method][options.action] as Record<string, Callable[]>)[
        requestId
      ] = listener as Callable[];
  }
  if (!client.hasListeners(event))
    client.on(event, (response: Response<T>) => {
      switch (response.method) {
        case "SUBSCRIPTION":
          const subscriptions = listeners[response.method][response.action] as
            | Callable[]
            | null;

          if (subscriptions)
            subscriptions.map((subscription) => subscription(response));
          break;
        default:
          const listener: Callable<Response<T>>[] | null = (
            listeners[response.method][response.action] as Record<
              string,
              Callable[]
            >
          )[response.requestId];
          if (listener) {
            const [success, error] = listener;
            if (Math.floor(response.status / 100) === 2) success(response);
            else error(response);
          }
      }
    });

  client.emit(event, {
    requestId,
    method: options.method,
    data: options.data || {},
    query: options.query || {},
    action: options.action,
  });

  return {
    cancel() {
      switch (options.method) {
        case "SUBSCRIPTION":
          if (listeners[options.method][options.action])
            delete listeners[options.method][options.action];
          break;
        default:
          if (
            (
              listeners[options.method][options.action] as Record<
                string,
                Callable[]
              >
            )[requestId]
          )
            delete (
              listeners[options.method][options.action] as Record<
                string,
                Callable[]
              >
            )[requestId];
      }
    },
  };
};

export const request = <T>(event: string, options: RequestOptions) =>
  new Promise<Response<T>>((resolve, reject) => {
    const { cancel } = emit(event, options, [
      (response: Response<T>) => {
        resolve(response);
        cancel();
      },
      reject,
    ]);
  });

export const subscribe = <T>(
  event: string,
  options: RequestOption,
  listener: Callable<T>
) => {
  emit(event, { ...options, method: "SUBSCRIPTION" }, listener);
};

export const listen = <T>(
  requestP: ReturnType<typeof request<T>>,
  event: string,
  options: ListenOptions<T>,
  listener: Callable<Response<T>>
) => {
  return requestP.then((response) => {
    const subscribing_pks = options.selectors(response, options.selector);

    return subscribe(event, options, (response: Response<T>) => {
      if (options.selector(response.data) in subscribing_pks)
        listener(response);
    });
  });
};

export class Jira {
  post<T>(event: string, options: RequestOption) {
    return request<T>(event, { ...options, method: "POST" });
  }

  get<T>(event: string, options: RequestOption) {
    return request<T>(event, {
      ...options,
      method: "GET",
    });
  }

  put<T>(event: string, options: RequestOption) {
    return request<T>(event, {
      ...options,
      method: "PUT",
    });
  }

  patch<T>(event: string, options: RequestOption) {
    return request<T>(event, {
      ...options,
      method: "PATCH",
    });
  }

  delete<T>(event: string, options: RequestOption) {
    return request<T>(event, {
      ...options,
      method: "DELETE",
    });
  }
}
