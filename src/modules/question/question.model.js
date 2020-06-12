import {Schema, mongoose} from '../../lib/mongoose.lib';
import { ChapterSchema } from '../chapter/chapter.model';

let StatementSchema = new Schema({
    statement: {type: String, required: true}, //if isImage true question itself would be image
    containedImage: {type: String, default:''}, //if hasImage true, then img will have value 
    isImage: {type: Boolean, default:false},
    hasImage: {type: Boolean, default:false},
    isImageFloated: {type: Boolean, default:false},
    isMathExpression: {type: Boolean, default:false},
});

let QuestionSchema = new Schema({
    chapter: {type: ChapterSchema, required: true},
    question: {type: StatementSchema, required: true},
    options: {type: [StatementSchema], required: true},
    isSingleAnswer: {type: Boolean, required: true},
    answer: {type: Schema.Types.Mixed, required: true},
    isSubmitted: {type: Boolean},
    userAnswer:{type: [String]}
});


const QuestionModel = mongoose.model('Question', QuestionSchema);

export { QuestionModel, QuestionSchema };