import mongoose from 'mongoose';
import http, { createServer } from 'http';
import { connectToDatabase } from './db.config.js';
import Task from './task.schema.js';
import { io } from 'socket.io-client';
import { app } from './server.js';

let server;
let socketClient1;
let socketClient2;

beforeAll(async () => {
    // Connect to a test MongoDB database
    await connectToDatabase();
    server = createServer(app);

    await new Promise((resolve) => {
        server.listen(3001, resolve);
    });

    socketClient1 = io("http://localhost:3001");
    socketClient2 = io("http://localhost:3001");
});

afterAll(async () => {
    // Close the server and disconnect from the database after tests
    socketClient1.disconnect();
    socketClient2.disconnect();
    await mongoose.disconnect();
    await server.close();
});

beforeEach(async () => {
    // Clear the tasks collection before each test
    await Task.deleteMany({});
});

beforeEach(() => {
    // Connect two Socket.IO clients
    socketClient1.connect();
    socketClient2.connect();
});

afterEach(() => {
    // Disconnect the clients after each test
    socketClient1.disconnect();
    socketClient2.disconnect();
});

describe('Real-Time Todo App Tests', () => {
    it('should add a task and broadcast it to connected clients', () => {
        expect(true).toBe(true);
        const newTask = {
            text: 'Test Task',
        };

        const user2AddTaskPromise = new Promise((resolve) => {
            socketClient2.on('addTask', (task) => {
                // Check if the added task is received by client2
                expect(task.text).toEqual(newTask.text);
                resolve();
            });
        });

        const user1MessagePromise = new Promise((resolve) => {
            socketClient1.on('message', (message) => {
                expect(message.text).toBe('Welcome, User1!');
                resolve();
            });
        });

        Promise.all([user1MessagePromise, user2AddTaskPromise]).then(() => {
            // Emit the "addTask" event from client1
            client1.emit('addTask', newTask);

            // Rest of your test logic goes here

            socketClient2.on('addTask', (task) => {
                // Check if the added task is received by client2
                expect(task.text).toEqual(newTask.text);
            });
        });

    });


    it('should delete a task and broadcast the deletion to connected clients', () => {
        const taskToDelete = new Task({
            text: 'Task to Delete',
        });

        taskToDelete.save().then(() => {
            socketClient1.on('connect', () => {
                // Emit the "deleteTask" event from client1
                socketClient1.emit('deleteTask', taskToDelete._id.toString());

                socketClient2.on('deleteTask', (taskId) => {
                    // Check if the deleted task ID is received by client2
                    expect(taskId).toEqual(taskToDelete._id.toString());
                });
            });
        });
    });

    it('should retrieve a list of tasks when a new client connects', () => {
        const initialTasks = [
            { text: 'Task 1' },
            { text: 'Task 2' },
        ];

        Task.insertMany(initialTasks).then(() => {
            // Connect a new client (client2)
            socketClient2.on('connect', () => {
                socketClient2.on('initialTasks', (tasks) => {
                    // Check if the initial tasks are received by client2
                    expect(tasks.length).toBe(initialTasks.length);
                });
            });
        });
    });
});
