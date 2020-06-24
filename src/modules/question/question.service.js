import { QuestionModel as Question} from './question.model';

export class QuestionService {
    static async getQuestionById(questionId) {
        try {
            const question = await Question.findById(questionId).exec();
            return {status: 1, data: question};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async getQuestion(query) {
        try {
            const question = await Question.findOne(query).exec();
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
            let {data: savedQuestion} = await QuestionService.getQuestion({
                'question.statement': question.question.statement,
                'chapter.stream': question.chapter.stream,
                'chapter.class': question.chapter.class,
                'chapter.subject': question.chapter.subject,
                'chapter.chapter': question.chapter.chapter,
            });
            question = new Question(
                question
            );
            if (!savedQuestion) {
                question = await question.save();
            } else {
                question._id = savedQuestion._id;
                await Question.updateOne({'_id': savedQuestion._id}, question).exec();
            }
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

    static async getAnswer(questionId) {
        try {
            let {data: question} = await QuestionService.getQuestionById(questionId);
            let que = question.toJSON();
            return {status: 1, data: {answer: que.answer, answerDescription: que.answerDescription}};
        } catch(err){
            return {status: 0, err};
        }
    }
}