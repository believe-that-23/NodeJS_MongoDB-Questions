import dotenv from 'dotenv';
dotenv.config();
// make the necessary imports here

// complete all the necessary functions to implement the auction app.

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

// Store auction details and timer
let isAuctionOngoing = false;
let currentAuction = {
    owner: null,
    item: null,
    currentPrice: 0,
    timer: 0,
    timerInterval: null,
};

// Function to save an auction to the database
export const saveAuctionToDatabase = async (auctionData) => { };

// Function to start the auction timer
const startAuctionTimer = () => { };

// Function to get the latest active auction from the database
const getLatestActiveAuctionFromDatabase = async () => { };



// Handle socket connections
io.on('connection', async (socket) => {
    console.log("Connection made");

    // Retrieve the latest auction from the database


    // Handle bidding
    socket.on('placeBid', (bidAmount, username) => { });

    // Handle posting a new item for auction
    socket.on('postItem', (item, startingPrice, timer, username) => { });

    socket.on("disconnect", () => {
        console.log("Connection aborted");
    });
});


export default app;
