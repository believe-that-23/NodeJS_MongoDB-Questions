import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

// MongoDB setup using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/drawingApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a Mongoose model for drawings
const Drawing = mongoose.model('Drawing', {
    userId: String, // You can add user authentication here
    drawingData: Object, // Store drawing data
});

io.on("connection", async (socket) => {
    console.log("Connection made.");

    // Load existing drawings from the database and send them to the new user
    // Load existing drawings from the database and send them to the new user
    try {
        const drawings = await Drawing.find({}).exec();
        socket.emit("loadDrawings", drawings);
    } catch (err) {
        console.error(err);
    }


    socket.on("draw", async (data) => {
        console.log("Drawing received:", data);

        // Broadcast the drawing data to all connected clients, including the sender
        io.emit("drawing", data);

        // Save the drawing in the database
        const newDrawing = new Drawing(data);

        // Save the drawing in the database
        try {
            await newDrawing.save();
        } catch (err) {
            console.error(err);
        }
    });
    
    socket.on("clear", () => {
        // Broadcast the "clear" event to all connected clients
        io.emit("clear");
    });

    socket.on("disconnect", () => {
        console.log("Connection disconnected.");
    });
});

server.listen(3000, () => {
    console.log("Listening on port 3000");
});
