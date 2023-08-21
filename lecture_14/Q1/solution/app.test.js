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
};
const mockClient = {
  db: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue(mockCollection),
  }),
};

connectSpy = jest.spyOn(MongoClient, "connect").mockResolvedValue(mockClient);
dbSpy = mockClient.db;

beforeAll(async () => {
  await connectToMongoDB();
  const createResponse = await request(app)
    .post("/api/expenses")
    .send(seededExpense);
});
describe("Testing update and delete routes", () => {

  it("updates a tag in a specific expense", async () => {
    const testId = new ObjectId().toString();
    const oldTag = "food";
    const newTag = "lunch";

    const response = await request(app)
      .patch(`/api/expenses/${testId}/tags`)
      .send({ oldTag, newTag });

    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(testId), tags: oldTag },
      { $set: { "tags.$": newTag } }
    );
    expect(response.status).toBe(200);
  });

  it("deletes a tag from a specific expense using pull operator", async () => {
    const testId = new ObjectId().toString();
    const tagToDelete = "lunch";

    const response = await request(app)
      .delete(`/api/expenses/${testId}/tags/${tagToDelete}`);

    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(testId) },
      { $pull: { tags: tagToDelete } }
    );
    expect(response.status).toBe(200);
  });
});

