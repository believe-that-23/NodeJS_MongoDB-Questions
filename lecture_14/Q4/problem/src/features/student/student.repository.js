//No need to change code other than the last four methods
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


    //You need to implement methods below:

    async createIndexes() {}

    async getStudentsWithAverageScore() {}

    async getQualifiedStudentsCount() {}

    async updateStudentGrade() {}

};

export default studentRepository;
