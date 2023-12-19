import mongoose, { Document } from "mongoose";

export interface DProblem extends Document {
    main: ProblemData;
}

const problemSchema = new mongoose.Schema<DProblem>({
    main: {
        id: Number,
        name: String,
        name_slug: String,
        difficulty: String,
        like_count: Number,
        dislike_count: Number,
        acceptance_rate_count: Number,
        topic_tags: {
            type: String,
            default: "",
        },
    }
});

const ProblemModel = mongoose.model<DProblem>("Problem", problemSchema);

export default ProblemModel;
