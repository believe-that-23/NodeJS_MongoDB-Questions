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

    //You need to complete methods provided below:

    async createIndexes() {}

    async getStudentsWithAverageScore() {}

    async getQualifiedStudentsCount() {}

    async awardExtraCredit(studentId, extraCreditPoints) {}

};

export default studentRepository;
