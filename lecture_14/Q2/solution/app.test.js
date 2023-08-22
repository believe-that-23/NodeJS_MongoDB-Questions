import request from "supertest";
import app from "./index.js";
import { MongoClient, ObjectId } from "mongodb";
import { connectToMongoDB, getDB } from "./src/config/mongodb.js";

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
  const createResponse = await request(app)
    .post("/api/expenses")
    .send(seededExpense);
});
describe("Testing update and delete routes", () => {

  it("aggregates total revenue for each product", async () => {
    const response = await request(app).get("/api/expenses/aggregate/total-revenue");

    expect(mockCollection.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: "$title",
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);
    expect(response.status).toBe(200);
  });

  it("groups expenses by tags", async () => {
    const response = await request(app).get("/api/expenses/group/by-tags");

    expect(mockCollection.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: "$tags",
          expenses: {
            $push: {
              _id: "$_id",
              title: "$title",
              amount: "$amount",
              date: "$date",
              isRecurring: "$isRecurring",
              tags: "$tags",
            },
          },
        },
      },
    ]);
    expect(response.status).toBe(200);
  });

  it("groups and calculates average by recurring status", async () => {
    const response = await request(app).get("/api/expenses/group/avg-by-recurring");

    expect(mockCollection.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: "$isRecurring",
          avgAmount: { $avg: "$amount" },
        },
      },
    ]);
    expect(response.status).toBe(200);
  });
});

