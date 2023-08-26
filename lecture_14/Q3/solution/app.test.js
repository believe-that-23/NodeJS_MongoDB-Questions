import request from "supertest";
import app from "./index.js";
import { MongoClient, ObjectId } from "mongodb";
import { connectToMongoDB, getDB, getClient } from "./src/config/mongodb.js";

const seededExpense = {
    title: "Lunch at Joe's",
    amount: 15.0,
    date: new Date().toISOString(),
    isRecurring: false,
    tags: ["food", "lunch"],
};

let connectSpy;
let dbSpy;
const mockCollection = {
    insertOne: jest.fn(),
    findOne: jest.fn().mockResolvedValue(seededExpense),
    find: jest.fn().mockReturnThis(),
    toArray: jest.fn().mockResolvedValue([seededExpense]),
    updateOne: jest.fn(),
    aggregate: jest.fn().mockReturnThis()
};
const mockClient = {
    db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue(mockCollection),
    }),
};
mockCollection.toArray
    .mockResolvedValueOnce([
        { _id: "Product 1", totalRevenue: 1000 },
        { _id: "Product 2", totalRevenue: 1500 },
    ])
    .mockResolvedValueOnce([
        { _id: ["food"], expenses: [seededExpense] },
        { _id: ["lunch"], expenses: [seededExpense] },
    ])
    .mockResolvedValueOnce([
        { _id: false, avgAmount: 15.0 },
        { _id: true, avgAmount: 20.0 },
    ]);
connectSpy = jest.spyOn(MongoClient, "connect").mockResolvedValue(mockClient);
dbSpy = mockClient.db;

beforeAll(async () => {
    await connectToMongoDB();
});

describe("Transaction operations", () => {
    it("adds an expense and updates tag within a transaction", async () => {

        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };

        mockClient.startSession = jest.fn().mockReturnValue(mockSession);
        mockClient.close = jest.fn();


        const addParams = {
            title: "Dinner at Restaurant",
            amount: 50.0,
            date: new Date().toISOString(),
            isRecurring: false,
            tags: ["food", "dinner"],
        };

        const updateParams = {
            oldTag: "dinner",
            newTag: "dining-out",
        };

        const response = await request(app)
            .post("/api/expenses/add-and-update-with-transaction")
            .send({ addParams, updateParams });

        expect(mockClient.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.commitTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
        expect(mockClient.close).toHaveBeenCalled();

        // Assert the response status
        expect(response.status).toBe(201);

        // Assert the response message
        expect(response.text).toBe(
            "Expense added and tag updated successfully within a transaction."
        );
    });
});
