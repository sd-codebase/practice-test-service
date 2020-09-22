import {Schema, mongoose} from '../../lib/mongoose.lib';
import { SubChapterSchema } from '../chapter/chapter.model';

let QuestionSchema = new Schema({
    chapter: {type: SubChapterSchema, required: true},
    question: {type: String, required: true},
    options: {type: [String], required: true},
    answer: {type: Schema.Types.Mixed, required: true},
    isSingleAnswer: {type: Boolean},
    noOfAnswers: {type: Number},
    answerDescription: {type: String},
    tags: {type:String},
    level: {type:Number, default:2}, //1-pro, 2-advanced, 3-mid, 4-basic
    createdBy: {type: String},
    verifiedBy: {type: String},
    isVerified: {type: Boolean},
    imagePath: {type: String},
    createdAt: {type: Date, default: Date.now()},
    infoPara: {type: Number},
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
    isCorrectAnswer:{type:Number}, // 0-false, 1-true, 2-partial
    tags: {type:String},
    imagePath: {type: String},
    infoPara: {type: Number},
    sortOrder: {type: Number},
    obtainedMarks: {type: Number},
    negativeMarks: {type: Number},
},{ _id : false });

let InfoParagraphSchema = new Schema({
    paraId : { type:  Number, unique: true},
    content: { type: String},
    createdBy: { type: String},
    updatedBy: { type: String},
    tags: {type: String},
    createdAt: {type: Date, default: Date.now()},
});

let QuestionReportSchema = new Schema({
    questionId : { type:  String, required: true},
    userId: { type: String, required: true},
    createdAt: {type: Date, default: Date.now()},
});


const QuestionModel = mongoose.model('Question', QuestionSchema);
const InfoParaModel = mongoose.model('InformationParagraph', InfoParagraphSchema);
const QuestionReportModel = mongoose.model('QuestionReport', QuestionReportSchema);

export { QuestionModel, SubQuestionSchema, InfoParaModel, QuestionReportModel };