import { Server } from "socket.io";
import { createServer } from "http";
import { JSDOM } from "jsdom";
import { io } from "socket.io-client";
import { app } from "./server";
import path from "path";

let server;
let socketClient1;
let socketClient2;
let dom1;
let dom2;

beforeAll(async () => {
  server = createServer(app);

  await new Promise((resolve) => {
    server.listen(3001, resolve);
  });

  socketClient1 = io("http://localhost:3001");
  socketClient2 = io("http://localhost:3001");

  const htmlPath = path.join(__dirname, "./client.html");
  dom1 = await JSDOM.fromFile(htmlPath);
  dom2 = await JSDOM.fromFile(htmlPath);
});

afterAll((done) => {
  socketClient1.disconnect();
  socketClient2.disconnect();
  server.close(done);
});

test("Users can connect and send messages", () => {
  socketClient1.emit("join", { username: "User1", room: "Room1" });

  socketClient2.emit("join", { username: "User2", room: "Room1" });

  const user1MessagePromise = new Promise((resolve) => {
    socketClient1.on("message", (message) => {
      expect(message.text).toBe("Welcome, User1!");
      resolve();
    });
  });

  const user2MessagePromise = new Promise((resolve) => {
    socketClient2.on("message", (message) => {
      expect(message.text).toBe("Welcome, User2!");
      resolve();
    });
  });

  Promise.all([user1MessagePromise, user2MessagePromise]).then(() => {
    socketClient1.emit("sendMessage", {
      username: "User1",
      message: "Hello from User1!",
      room: "Room1",
    });

    socketClient2.on("message", (message) => {
      expect(message.username).toBe("User1");
      expect(message.text).toBe("Hello from User1!");
    });
  });
});