import {Schema, mongoose} from '../../lib/mongoose.lib';
import { SubChapterSchema } from '../chapter/chapter.model';

let StatementSchema = new Schema({
    statement: {type: String}, //if isImage true question itself would be image
    containedImage: {type: String, default:''}, //if hasImage true, then img will have value 
    isImage: {type: Boolean, default:false},
    hasImage: {type: Boolean, default:false},
    isImageFloated: {type: Boolean, default:false},
    isMathExpression: {type: Boolean, default:false},
},{ _id : false });

let QuestionSchema = new Schema({
    chapter: {type: SubChapterSchema, required: true},
    question: {type: StatementSchema, required: true},
    options: {type: [StatementSchema], required: true},
    isSingleAnswer: {type: Boolean, required: true},
    answer: {type: Schema.Types.Mixed, required: true},
    isSubmitted: {type: Boolean},
    userAnswer: {type: Schema.Types.Mixed},
    answerDescription: {type: StatementSchema},
    isCorrectAnswer:{type:Boolean},
    tags: {type:String},
    level: {type:Number, default:2}, //1-pro, 2-advanced, 3-mid, 4-basic
    createdBy: {type: String},
    verifiedBy: {type: String},
    isVerified: {type: Boolean},
    imagePath: {type: String},
});

let SubQuestionSchema = new Schema({
    id: {type:String},
    chapter: {type: SubChapterSchema, required: true},
    question: {type: StatementSchema, required: true},
    options: {type: [StatementSchema], required: true},
    isSingleAnswer: {type: Boolean, required: true},
    answer: {type: Schema.Types.Mixed, required: true},
    answerDescription: {type: StatementSchema},
    isSubmitted: {type: Boolean},
    userAnswer: {type: Schema.Types.Mixed},
    isCorrectAnswer:{type:Boolean},
    tags: {type:String},
    level: {type:Number, default:2}, //1-pro, 2-advanced, 3-mid, 4-basic
    createdBy: {type: String},
    verifiedBy: {type: String},
    isVerified: {type: Boolean},
    imagePath: {type: String},
},{ _id : false });


const QuestionModel = mongoose.model('Question', QuestionSchema);

export { QuestionModel, SubQuestionSchema };