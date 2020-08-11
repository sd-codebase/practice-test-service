import {Schema, mongoose} from '../../lib/mongoose.lib';
import { SubQuestionSchema } from '../question/question.model';
import { SubChapterSchema } from '../chapter/chapter.model';

let TestSchema = new Schema({
    userId: {type: String},
    testConfigId: {type: String},
    status: {type: Number, default:0},//0-created, 1- started, 2-finished
    chapter: {type: SubChapterSchema},
    questionCount: {type: Number},
    attemptCount: {type: Number, default:0},
    correctCount: {type: Number, default:0},
    allottedTime: {type: Number, default:0},
    completeTime: {type: Number, default:0},
    isSubmitted: {type:Boolean, default: false},
    questions: {type:[SubQuestionSchema]}, // questions=>!isPredefined or questionIds=>isPredefined
    questionIds: {type:[String]},
    requiredPercentage: {type: Number},
    percentage: {type:Number, default:0},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},
    isPredefined: {type:Boolean, default:false},
    testName:{type:String},
    instructions:{type: Schema.Types.Mixed},
    hasParagraph: {type: Boolean},
    paragraphs: {type: [Number]},
    sectionWisePercentage: {type: [SectionWisePercentageSchema]},
    result: {type: Boolean},
    totalMarks: {type: Number},
});

let SectionWisePercentageSchema = new Schema({
    section: {type: String},
    percentage: {type: Number},
    requiredPercentage: {type: Number},
});


const TestModel = mongoose.model('Test', TestSchema);

export {TestModel};

const ob = {
    "Section 1": {
        "questions": [1,2,3,4,5],
        "instruction": "Question 1-5, each question allotted maximum 4 marks. Correct answer will give you 4 marks, and wrong answer will give -1 marks."
    },
    "Section 2": {
        "questions": [6,7,8,9,10],
        "instruction": "Question 6-10, each question allotted maximum 4 marks. Correct answer will give you 4 marks, and wrong answer will give -1 marks."
    },
    "Section 3": {
        "questions": [11,12,13,14,15],
        "instruction": "Question 11-15, each question allotted maximum 4 marks. Correct answer will give you 4 marks, and wrong answer will give -1 marks."
    },
    "Section 4": {
        "questions": [16,17,18,19,20],
        "instruction": "Question 16-20, each question allotted maximum 4 marks. Correct answer will give you 4 marks, and wrong answer will give -1 marks."
    }
};

