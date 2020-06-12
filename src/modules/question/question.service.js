import { QuestionModel as Question} from './question.model';
import { ChapterModel as Chapter} from '../chapter/chapter.model';

export class QuestionService {
    static async getQuestionById(questionId) {
        try {
            const question = await Question.findOne({'_id': questionId}).exec();
            return {status: 1, data: question};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getQuestionsByIdIn(questionIds) {
        try {
            const question = await Question.find({'_id': {$in: questionIds}}).exec();
            return {status: 1, data: question};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getRandomQuestions(limit) {
        try {
            const question = await Question.find({}).limit(limit).exec();
            return {status: 1, data: question};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async createQuestion(question) {
        try {
            if(!question.isOptionImage) {
                question.isOptionImage = question.options.map( op => false);
            }
            question.chapter = new Chapter(
                question
            )
            question = new Question(
                question
            );
            question = await question.save();
            return {status: 1, data: question};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async uploadQuestions(questions){
        const uploadResult = [];
        for(let i=0; i<questions.length; i++) {
            uploadResult.push(await QuestionService.createQuestion(questions[i]));
        }
        return uploadResult;
    }
}