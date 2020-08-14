import {Schema, mongoose} from '../../lib/mongoose.lib';
import { SubQuestionSchema } from '../question/question.model';
import { SubChapterSchema } from '../chapter/chapter.model';

const schema = {
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
    course: {type:String},
    users: {type:[String]},
};

let TestSchema = new Schema(schema);
let GuestTestSchema = new Schema(Object.assign({}, schema, {guestUserId: {type: String}, mappedTestId: {type: String}}));

let SectionWisePercentageSchema = new Schema({
    section: {type: String},
    percentage: {type: Number},
    requiredPercentage: {type: Number},
});


const TestModel = mongoose.model('Test', TestSchema);
const GuestTestModel = mongoose.model('GuestTest', GuestTestSchema);

export { TestModel, GuestTestModel };

export const COURSES = {
    NEET : 'Neet',
    JEE_MAINS : 'Jee Mains',
    JEE_ADV_PAPER_1 : 'Jee Advanced Paper 1',
    JEE_ADV_PAPER_2 : 'Jee Advanced Paper 2',
}