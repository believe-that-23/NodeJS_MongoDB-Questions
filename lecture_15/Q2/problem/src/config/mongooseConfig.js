import mongoose from 'mongoose';

const url = "mongodb://localhost:27017/book";

export const connectUsingMongoose = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected using mongoose");
    } catch (err) {
        console.log(err);
    }
}
