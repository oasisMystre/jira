import { v4 } from "uuid";
import { ManagerOptions, SocketOptions, io } from "socket.io-client";

import type {
  Callback,
  Listener,
  Method,
  NonNull,
  Request,
  Response,
} from "./types";

export default class {
  public readonly socket: ReturnType<typeof io>;
  private readonly listeners: Record<Method, Record<string, Listener<any>[]>> =
    {
      GET: {},
      PUT: {},
      POST: {},
      PATCH: {},
      DELETE: {},
      SUBSCRIPTION: {},
    };

  constructor(url?: string, opts?: Partial<ManagerOptions & SocketOptions>) {
    if (url) this.socket = io(url, opts);
    else this.socket = io(opts);
  }

  sendRequest<T>(
    request: NonNull<Request>,
    onError: Listener<any>,
    onSuccess: Listener<any>
  ) {
    request.requestId = v4();

    this.listeners[request.method][request.requestId] = [onError, onSuccess];

    if (!this.socket.hasListeners(request.action)) {
      this.socket.on(request.event, (response: Response<T>) => {
        const listeners = this.listeners[response.method][
          response.requestId
        ] as Listener<T>[];

        if (listeners) {
          const [onError, onSuccess] = listeners;

          (Math.round(response.status / 200) === 1 ? onSuccess : onError)(
            response
          );
        }
      });
    }

    this.socket.emit(request.event, request);

    return request;
  }

  request<T>(request: NonNull<Request>) {
    return new Promise<Response<T>>((resolve, reject) => {
      return this.sendRequest<T>(request, reject, resolve);
    });
  }

  subscribe<T>(req: Request, callback: Callback<T>) {
    if (!req.method) req.method = "POST";
    if (!req.action) req.action = "subscribe";
    if (!callback.onError) callback.onError = () => void 0;

    return this.request<T>(req as NonNull<Request>)
      .then((response) => {
        this.listeners.SUBSCRIPTION[response.requestId] = [
          callback.onError!,
          callback.onSuccess,
        ];

        return response;
      })
      .catch(callback.onError);
  }

  unsubscribe(req: Request) {
    if (!req.requestId) throw new Error("requestId is required to unsubscribe");

    return this.request(req as NonNull<Request>);
  }
}
