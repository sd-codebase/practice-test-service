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

    static async getQuestions(query) {
        try {
            let questions = await Question.find(query).exec();
            questions = questions.map( question => question.toJSON());
            questions.forEach(question => {question.id=question._id});
            return {status: 1, data: questions};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async verifyQuestion(questionId) {
        try {
            const updated = await Question.updateOne({'_id': questionId}, {'isVerified': true}).exec();
            return {status: 1, data: updated};
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

    static async getRandomQuestions(limit,subject) {
        try {
            let query = {};
            if(subject) {
                query = {'chapter.subject': subject};
            }
            const question = await Question.find(query).limit(limit).exec();
            return {status: 1, data: question};
        } catch(err){
            return {status: 0, err};
        }
    }

    static async createQuestion(question, userToVerify) {
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
            question.verifiedBy = userToVerify;
            question.isVerified = false;
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

    static async uploadQuestions({questions, userId}){
        const uploadResult = [];
        for(let i=0; i<questions.length; i++) {
            uploadResult.push(await QuestionService.createQuestion(questions[i], userId));
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