import { getClient, getDB } from '../../config/mongodb.js';

const collectionName = 'students';

class studentRepository {


    async addStudent(studentData) {
        const db = getDB();
        await db.collection(collectionName).insertOne(studentData);
    }

    async getAllStudents() {
        const db = getDB();
        const students = await db.collection(collectionName).find({}).toArray();
        return students;
    }

    async createIndexes() {
        const db = getDB();

        // Create a single-field index on the 'name' field
        await db.collection(collectionName).createIndex({ name: 1 });

        // Create a compound index on the 'age' and 'grade' fields
        await db.collection(collectionName).createIndex({ age: 1, grade: -1 });
    }

    async getStudentsWithAverageScore() {
        const db = getDB();

        const aggregationPipeline = [
            {
                $project: {
                    _id: 0,
                    name: 1,
                    averageScore: { $avg: '$assignments.score' }
                }
            }
        ];

        const studentsWithAverageScore = await db.collection(collectionName).aggregate(aggregationPipeline).toArray();
        return studentsWithAverageScore;
    }
    async getQualifiedStudentsCount() {
        const db = getDB();

        const aggregationPipeline = [
            {
                $match: {
                    age: { $gt: 9 },
                    grade: { $lte: 'B' },
                    'assignments.title': { $in: ['Math'] },
                    'assignments.score': { $gte: 60 }
                }
            },
            {
                $count: 'qualifiedStudentsCount'
            }
        ];

        const result = await db.collection(collectionName).aggregate(aggregationPipeline).toArray();
        return result[0] ? result[0].qualifiedStudentsCount : 0;

    }

    async awardExtraCredit(studentId, extraCreditPoints) {
        const db = getDB();
        const client = getClient();
        // console.log(client);
        const session = client.startSession();

        try {
            session.startTransaction();
            const student = await db.collection(collectionName).findOne({ _id: studentId }, { session });
            console.log(student);
            if (!student) {
                throw new Error('Student not found.');
            }

            // Calculate new score based on extra credit points
            const updatedAssignments = student.assignments.map(assignment => {
                return {
                    ...assignment,
                    score: assignment.score + extraCreditPoints
                };
            });

            // Update student's assignments with extra credit
            await db.collection(collectionName).updateOne(
                { _id: studentId },
                { $set: { assignments: updatedAssignments } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        } finally {
            client.close();
        }
    }

};

export default studentRepository;
