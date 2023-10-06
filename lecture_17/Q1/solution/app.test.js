import { Server } from "socket.io";
import { createServer } from "http";
import { JSDOM } from "jsdom";
import { io } from "socket.io-client";
import { app } from "./server";
import path from "path";

// Include your app server code here (e.g., require your server.js file)

let server;
let socketClient1;
let socketClient2;
let dom1;
let dom2;

beforeAll(async () => {
    // Start your server (similar to how you start it in your server.js)
    // You can use a different port for testing if needed
    server = createServer(app);

    // Create a socket.io server for testing
    const ioServer = new Server(server);

    // Initialize the server logic here (e.g., the logic in your server.js)

    // Start the server and connect two socket.io clients
    await new Promise((resolve) => {
        server.listen(3001, resolve);
    });
    socketClient1 = io("http://localhost:3001");
    socketClient2 = io("http://localhost:3001");

    // Create two virtual DOMs for testing the client-side code of both users
    const htmlPath = path.join(__dirname, './client.html'); // Adjust the path as needed
    // const html = fs.readFileSync(htmlPath, 'utf8');
    dom1 = await JSDOM.fromFile(htmlPath);
    dom2 = await JSDOM.fromFile(htmlPath);
});

afterAll((done) => {
    // Clean up resources, close the server, and disconnect the clients
    socketClient1.disconnect();
    socketClient2.disconnect();
    server.close(() => {
        done();
    });
});

test("Users can connect and send messages", (done) => {
    // Simulate user 1 joining a room
    socketClient1.emit("join", { username: "User1", room: "Room1" });

    // Simulate user 2 joining the same room
    socketClient2.emit("join", { username: "User2", room: "Room1" });

    // Create promises to track when events are received by user 1 and user 2
    const user1MessagePromise = new Promise((resolve) => {
        socketClient1.on("message", (message) => {
            expect(message.text).toBe("Welcome, User1!");
            resolve();
        });
    });

    jest.setTimeout(10000);

    const user2MessagePromise = new Promise((resolve) => {
        socketClient2.on("message", (message) => {
            expect(message.text).toBe("Welcome, User2!");
            resolve();
        });
    });

    // Wait for both users to receive their welcome messages
    Promise.all([user1MessagePromise, user2MessagePromise])
        .then(() => {
            // Simulate user 1 sending a message
            socketClient1.emit("sendMessage", { username: "User1", message: "Hello from User1!", room: "Room1" });

            // Listen for the message sent by user 1 and received by user 2
            socketClient2.on("message", (message) => {
                expect(message.username).toBe("User1");
                expect(message.text).toBe("Hello from User1!");
                done();
            });
        });
});

