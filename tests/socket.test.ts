import { createClient, Jira, subscribe } from "../src/main";

const client = createClient("http://127.0.0.1:8000", {
  auth: { token: "0a54470704ada9eac680ea18d4b5a09247f6b352" },
});

client.on("connect", () => {
  // jira.get("users", { action: "list" }).then(console.log);
  // jira.get("users", { action: "retrieve", query: { pk: 1 } }).then(console.log);

  // subscribe("users", { action: "subscribe_user" }, console.log);
  // jira
  //   .patch("users", {
  //     action: "update",
  //     query: { pk: 1 },
  //     data: { email: "admin@gmail.com" },
  //   })
  //   .then(console.log);

  // jira
  //   .post("users", {
  //     action: "create",
  //     data: { username: Math.random(), password: "1234567" },
  //   })
  //   .then(console.dir);
  jira.delete("users", { action: "destroy", query: { pk: 7 }}).then(console.log)
});


const jira = new Jira();
