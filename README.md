# Need A Job

The creator of this fantastic library need a job
[tel](tel:+2349076931902),
[email](usegong@gmail.com)

## Jira

This is javascript client interface for djira

Project still in development, We use this library in production ready projects.
We are not liable for any problem encountered using this library

For the python server library check
[Djira](https://github.com/lyonkvalid/djira)

### Create client

Create or initialize a socketio client

```ts
    import { client } from "jira";

    client(...args); // a socketio client is initialize
```

> Note: This is required to be called in middleware, plugin or main / root project file

For example
React in `App.tsx` or `main.tsx` file the client is initialized
Nuxt in a client plugin file, `jira.client.ts`

### Actions

Send request to the server using `.create` ,`.get`, `.list`, `update`, `patch` action
To send custom action use the `request` method

#### Create

Send create action to the server

> Returns new created data

```ts
    import { create } from "jira";

    create("users", { username: "lyonkvalid", email: "email"}).then(console.log);
```

#### List

Send list action to the server

> Returns a paginated response or an array use the `PaginatedResponse<T>` when expecting paginated response from the server

```ts
    import { list } from "jira";

    list("users").then(console.log);

    // optional pass custom query params for filtering 
    list("users", { username__icontains: "lyon" }).then(console.log);
```

#### Get

Send get action to the server

> Return a response from the server

```ts
    import { get } from "jira";

    get("users", 1).then(console.log);

    // optional pass custom query params 
    get("users", 1, { email_verified: true }).then(console.log);
```

#### Update or Patch

Send an update or patch action to the server

> Return a response from the server

```ts
    import { update, patch } from "jira";

    // full update
    update("users", 1, { username: "lyonkvalid", email: "payouk.mytre@gmail.com", displayName: "Oguntunde Caleb Fiyinfoluwa"});

    // partial update 
    patch("users", 1, { username: "lyonkvalid" });

    // both method also have an optional arg `query`
```

#### Custom namespace and action

Send a request to a custom namespace

```ts
    import { request } from "jira";

    request(
        "users", 
        "get", 
        { 
            namespace:"current", // optional 
            data: {}, // optional,
            query: {}, // optional
        }).then(console.log); // this is equivalent to /users/current/ in http path

```

### Subscription

A subscription observe changes to query from database, You can listen or subscribe to changes based on your preference

#### Subscribe

Subscribe to observers on a server

```ts
    import { subscribe } from "jira";

    const { unsubscribe } = subscribe("user", snapshot => console.log(snapshot), {
        namespace: "subscribe_user", // optional, defaults to event name,
        query, // optional
        data, // optional
    });
```

#### Listen

Listen to a request return value changes

```ts
    import { listen, list } from "jira";


    const { unsubscribe } = listen(
        list("users"),
        snapshot => console.log(snapshot),
        {
            namespace, // optional, defaults to event name
            query, // optional
            data, // optional
        }
    );
```
