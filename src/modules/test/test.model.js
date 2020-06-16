import {Schema, mongoose} from '../../lib/mongoose.lib';
import { QuestionSchema } from '../question/question.model';
import { ChapterSchema } from '../chapter/chapter.model';

let TestSchema = new Schema({
    userId: {type: String},
    status: {type: Number, default:0},//0-created, 1- started, 2-finished
    chapter: {type: ChapterSchema},
    questionCount: {type: Number},
    attemptCount: {type: Number, default:0},
    correctCount: {type: Number, default:0},
    allottedTime: {type: Number, default:1200},
    completeTime: {type: Number, default:0},
    isSubmitted: {type:Boolean, default: false},
    questions: {type:[QuestionSchema]},
    percentage: {type:Number, default:0},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
});


const TestModel = mongoose.model('Test', TestSchema);

export {TestModel};