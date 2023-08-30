import request from "supertest";
import app from "./index.js";
import { MongoClient, ObjectId } from "mongodb";
import { connectToMongoDB, getDB } from "./src/config/mongodb.js";

let createdStudentId = new ObjectId();

const seededStudents = {
    _id: createdStudentId,
    name: 'John Doe',
    age: 15,
    grade: 'A',
    assignments: [
        { title: 'Math', score: 85 },
        { title: 'Science', score: 75 },
    ],
}

let connectSpy;
let dbSpy;
const mockCollection = {
    insertOne: jest.fn(),
    findOne: jest.fn().mockResolvedValue(seededStudents),
    find: jest.fn().mockReturnThis(),
    toArray: jest.fn().mockResolvedValue([seededStudents]),
    updateOne: jest.fn(),
    createIndex: jest.fn(),
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
        .post("/api/student/add-student")
        .send(seededStudents);
});

describe('Student Management API', () => {

    it('should create indexes successfully', async () => {
        // Mock successful index creation
        const response = await request(app).post('/api/student/create-indexes');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Indexes created successfully.');
        expect(mockCollection.createIndex).toHaveBeenCalledWith({ name: 1 });
        expect(mockCollection.createIndex).toHaveBeenCalledWith({ age: 1, grade: -1 });
    });

    it('should get students with average score', async () => {
        const mockAggregatedResult = [
            { name: 'John Doe', averageScore: 80 },
            { name: 'Jane Smith', averageScore: 77.5 },
        ];
        mockCollection.aggregate = jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue(mockAggregatedResult),
        });

        const response = await request(app).get('/api/student/students-average-score');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockAggregatedResult);
    });

    it('should get qualified students count', async () => {
        const mockAggregatedResult = [{ qualifiedStudentsCount: 2 }];
        mockCollection.aggregate = jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue(mockAggregatedResult),
        });

        const response = await request(app).get('/api/student/qualified-students-count');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockAggregatedResult[0]); // Check for the specific property value
    });

    it('should award extra credit points to a student', async () => {

        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };

        mockClient.startSession = jest.fn().mockReturnValue(mockSession);
        mockClient.close = jest.fn();
        const extraCreditPoints = 5;
       
        // Make a POST request to the route
        const response = await request(app)
            .post("/api/student/award-extra-credit")
            .send({ studentId: createdStudentId, extraCreditPoints });

        expect(mockClient.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.commitTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
        expect(mockClient.close).toHaveBeenCalled();

        // Assert the response status
        expect(response.status).toBe(201);

        // Assert the response message
        expect(response.text).not.toBe("");
    });

});

