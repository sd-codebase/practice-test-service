import {Schema, mongoose} from '../../lib/mongoose.lib';
import { SubChapterSchema } from '../chapter/chapter.model';

let QuestionSchema = new Schema({
    chapter: {type: SubChapterSchema, required: true},
    question: {type: String, required: true},
    options: {type: [String], required: true},
    answer: {type: Schema.Types.Mixed, required: true},
    isSingleAnswer: {type: Boolean},
    noOfAnswers: {type: Number},
    isSubmitted: {type: Boolean},
    userAnswer: {type: Schema.Types.Mixed},
    answerDescription: {type: String},
    isCorrectAnswer:{type:Boolean},
    tags: {type:String},
    level: {type:Number, default:2}, //1-pro, 2-advanced, 3-mid, 4-basic
    createdBy: {type: String},
    verifiedBy: {type: String},
    isVerified: {type: Boolean},
    imagePath: {type: String},
    createdAt: {type: Date, default: Date.now()},
    sortOrder: {type: Number},
});

let SubQuestionSchema = new Schema({
    id: {type:String},
    chapter: {type: SubChapterSchema, required: true},
    question: {type: String, required: true},
    options: {type: [String], required: true},
    answer: {type: Schema.Types.Mixed, required: true},
    isSingleAnswer: {type: Boolean},
    noOfAnswers: {type: Number},
    isSubmitted: {type: Boolean},
    userAnswer: {type: Schema.Types.Mixed},
    answerDescription: {type: String},
    isCorrectAnswer:{type:Boolean},
    tags: {type:String},
    level: {type:Number, default:2}, //1-pro, 2-advanced, 3-mid, 4-basic
    createdBy: {type: String},
    verifiedBy: {type: String},
    isVerified: {type: Boolean},
    imagePath: {type: String},
    createdAt: {type: Date, default: Date.now()},
    sortOrder: {type: Number},
},{ _id : false });


const QuestionModel = mongoose.model('Question', QuestionSchema);

export { QuestionModel, SubQuestionSchema };