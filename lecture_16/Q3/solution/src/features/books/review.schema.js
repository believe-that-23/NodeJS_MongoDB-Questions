import mongoose from 'mongoose';

export const reviewSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    target: {
        type: String,
        enum: ["Author", "Book"],
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "target",
    },
});
