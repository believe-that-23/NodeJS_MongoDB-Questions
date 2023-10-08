import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try {
        // Define your MongoDB connection URL
        const mongoDBUrl = 'mongodb://127.0.0.1:27017/chatApp';

        await mongoose.connect(mongoDBUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }
};


