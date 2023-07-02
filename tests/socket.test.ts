import { createClient, Jira, subscribe } from "../src/main";

const client = createClient("http://127.0.0.1:8000", {
  auth: { token: "84d58813f131135475729b1f83f1802c9bfc6b39" },
});

client.on("connect", () => {
  subscribe(
    "orders",
    { action: "subscribe", query: { role: "BUSINESS" } },
    console.log
  );
});

const jira = new Jira();
