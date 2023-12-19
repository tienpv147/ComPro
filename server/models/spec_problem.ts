import mongoose, { Document } from "mongoose";

export interface DSpecProblem extends Document {
    main: DescriptionData;
    hints: string;
    test: any[];
}

const specProblemSchema = new mongoose.Schema<DSpecProblem>({
    main: {
        id: Number,
        name_slug: String,
        description_body: String,
        similar_questions: String,
    },
    hints: String,
    test: Array,
});

const SpecProblemModel = mongoose.model<DSpecProblem>("Spec_Problem", specProblemSchema);

export default SpecProblemModel;
